namespace PKEdit.Core {
    export class PokemonObject {

        private binary_file: Array<Uint8Array>;

        // Read/Write caches saved to memory

        private encryptionKey: Uint8Array;
        private pkxChecksum: Uint8Array;

        private encounterFlags: Uint8Array;

        constructor(binaryFile) {
            window["PKI"] = this; // debug
            this.binary_file = binaryFile;
        }

        setPKXChecksum() {

        }

        getPKXChecksum() {

        }

        setPKXEncryptionKey() {

        }

        getPKXEncryptionKey() {

        }

        /// Internally used

        private _setIVs(IVs?: { "hp"?: number, "attack"?: number, "defense"?: number, "specialattack"?: number, "specialdefense"?: number, "speed"?: number },
            isEgg?: boolean, isNicknamed?: boolean
            ): boolean {
            var offset = PK6.Memory.Map.INDIVIDUAL_VALUES;
            var current_data = this._getIVs();

            var IV32 = new Uint32Array(1);

            let IV_HP = IVs.hp || current_data[0];
            //console.debug("Setting IV HP to", IV_HP, " -- previously was: ", current_data[0]); // debug
            let IV_Attack = IVs.attack || current_data[1];
            //console.debug("Setting IV_Attack to", IV_Attack, " -- previously was: ", current_data[1]); // debug
            let IV_Defense = IVs.defense || current_data[2];
            //console.debug("Setting IV_Defense to", IV_Defense, " -- previously was: ", current_data[2]); // d
            let IV_Speed = IVs.speed || current_data[3];
            //console.debug("Setting IV_Speed to", IV_Speed, " -- previously was: ", current_data[3]);
            let IV_SpecialAttack = IVs.specialattack || current_data[4];
            //console.debug("Setting IV_SpecialAttack to", IV_SpecialAttack, " -- previously was: ", current_data[4]);
            let IV_SpecialDefense = IVs.specialdefense || current_data[5];
            //console.debug("Setting IV_SpecialDefense to", IV_SpecialDefense, " -- previously was: ", current_data[5]);
            let Is_Egg = Number(isEgg) || current_data[6];
            //console.debug("Setting Is_Egg to", Is_Egg, " -- previously was: ", current_data[6]);
            let Is_Nicknamed = Number(isNicknamed) || current_data[7];
            //console.debug("Setting Is_Nicknamed to", Is_Nicknamed, " -- previously was: ", current_data[7]);

            IV32[0] = IV_HP & 0x1F;                                     // HP IV
            IV32[0] |= ((IV_Attack & 0x1F) << 5);                       // ATTACK IV
            IV32[0] |= ((IV_Defense & 0x1F) << 10);                     // DEFENSE IV
            IV32[0] |= ((IV_Speed & 0x1F) << 15);                       // SPEED IV
            IV32[0] |= ((IV_SpecialAttack & 0x1F) << 20);               // SPECIAL ATTACK IV
            IV32[0] |= ((IV_SpecialDefense & 0x1F) << 25);              // SPECIAL DEFENSE IV
            IV32[0] |= (Is_Egg << 30);                                  // IS EGG?
            IV32[0] |= (Is_Nicknamed << 31);                            // IS NICK?

            var u8a = new Uint8Array(IV32.buffer);
            console.log("IVSet: ", u8a, "as binary", IV32[0].toString(2));
            PK6.Memory.RW.setValueAt(offset[0], u8a, offset[1], this);
            return true;
        }

        private _getIVs() {
            var offset = PK6.Memory.Map.INDIVIDUAL_VALUES;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            var u32a = new Uint32Array(memory.buffer);
            console.debug("u32a", u32a[0].toString(2));

            let hp = (u32a[0] & 0x1F);
            let attack = (u32a[0] >> 5) & 0x1F;
            let defense = (u32a[0] >> 10) & 0x1F;
            let speed = (u32a[0] >> 15) & 0x1F;
            let specialattack = (u32a[0] >> 20) & 0x1F;
            let specialdefense = (u32a[0] >> 25) & 0x1F;
            let is_egg = ((u32a[0] >> 30) & 1);
            let is_nicknamed = ((u32a[0] >> 31));

            return [hp, attack, defense, speed, specialattack, specialdefense, is_egg, is_nicknamed];

        }

        
        private _setEncounterData(isFateful?: number, gender?: number, form?: number, isGenderless?: number) {
            var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
            var current = this._getEncounterData();
            var u8 = new Uint8Array(1);

            let Is_Fateful: number = isFateful || Number(current[0]);
            let Gender = gender || current[1];
            let Genderless = isGenderless || current[2];
            let Form = form || current[3];

            if (Gender > 1 || Is_Fateful > 31)
                throw new PKEdit.OutOfBoundsException(this, "The gender or form is out of bounds.");
            // var newThing = 0x0;newThing |= 1 & 1;newThing |= ((1 & 0b11) << 1);newThing |= ((1 & 0b11) << 2);newThing |= ((0b11001 & 0b11111) << 3);newThing.toString(2)
            u8[0] |= Is_Fateful & 1;
            u8[0] |= (Gender & 0b11) << 1;
            u8[0] |= (Genderless & 0b11) << 2;
            u8[0] |= (Form & 0x1f) << 3;

            this.encounterFlags = u8;
            PK6.Memory.RW.setValueAt(offset[0], u8, offset[1], this);
        }

        // TODO: Fix paramater type consistency
        private _getEncounterData(): [boolean, number, number, number] {
            var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
            var memory = this.encounterFlags || PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let is_fateful = (memory[0] % 2) == 0;
            var gender = ((memory[0] >> 1) & 0x3);
            if (gender == 2)
                var genderless = 1, gender = 0;
            else
                var genderless = 0;
            let form = (memory[0] >> 3);

            return [is_fateful, gender, genderless, form];
        }

        ///

        setPokemonNationalID(pokedexId: number): boolean {
            var offset = PK6.Memory.Map.NATIONAL_POKEDEX_ID;

            if (pokedexId > 0xffff) {
                throw new PKEdit.OutOfBoundsException(this, "The national ID is out of bounds.");
            }

            var buffer = new Uint16Array([pokedexId]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonNationalID(): number {
            var offset = PK6.Memory.Map.NATIONAL_POKEDEX_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonHeldItem(item): boolean {
            var offset = PK6.Memory.Map.HELD_ITEM;

            if (item > 0xffff) {
                throw new PKEdit.OutOfBoundsException(this, "The selected Pokemon held item is out of bounds");
            }

            var buffer = new Uint16Array([item]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;

        }

        getPokemonHeldItem(): number {
            var offset = PK6.Memory.Map.HELD_ITEM;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonOriginalTrainerID(tid: number) {
            var offset = PK6.Memory.Map.OT_ID;
            var buffer = new Uint16Array([tid]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this)
        }

        getPokemonOriginalTrainerID(): number {
            var offset = PK6.Memory.Map.OT_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonExperience(exp_points: number): boolean {
            var offset = PK6.Memory.Map.EXP_POINTS;
            if (exp_points > 0xffffff) {
                throw new PKEdit.OutOfBoundsException(this, "The speicified number of experience points is invalid.");
            }
            var buffer = new Uint16Array([exp_points, 0x0]);
            var u8a = new Uint8Array(buffer.buffer);
            var memory = new Uint8Array([u8a[0], u8a[1], u8a[2]]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonExperience(): number {
            var offset = PK6.Memory.Map.EXP_POINTS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var buffer = new Uint32Array(memory.buffer);

            return buffer[0];
        }

        setPokemonPersonalityValue(pid: number): boolean {
            var offset = PK6.Memory.Map.EXP_POINTS;
            var buffer = new Uint32Array([pid]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonPersonalityValue() {
            var offset = PK6.Memory.Map.PERSONALITY_VALUE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u32a = new Uint32Array(memory.buffer);

            return u32a[0];
        }

        setPokemonNature(nature): boolean {
            var offset = PK6.Memory.Map.NATURE;
            if (nature > 25)
                throw new PKEdit.OutOfBoundsException(this, "Nature is out of bounds");
            var memory = new Uint8Array([nature]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonNature(): number {
            var offset = PK6.Memory.Map.NATURE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setIsPokemonFatefulEncounter(isFateful: boolean): boolean {
            this._setEncounterData(Number(isFateful));
            return true;
        }

        getIsPokemonFateFulEncounter(): boolean {
            if (!this.encounterFlags) {
                var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
                var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
                this.encounterFlags = memory;
            }
            
            return Boolean((this.encounterFlags[0] >> 0) & 1);
        }

        setPokemonGender(gender: number): boolean {
            if (gender == 2) {
                gender = 0;
                this.setIsPokemonGenerless(true);
            }

            this._setEncounterData(null, Number(gender));

            return true;
        }

        getPokemonGender(): number {
            if (!this.encounterFlags) {
                var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
                var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
                this.encounterFlags = memory;
            }

            return (this.encounterFlags[0] >> 1) & 1;
        }

        setIsPokemonGenerless(genderless: boolean): boolean {
            this._setEncounterData(null, null, null, Number(genderless));

            return true;
        }

        getIsPokemonGenderless(): boolean {
            if (!this.encounterFlags) {
                var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
                var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
                this.encounterFlags = memory;
            }

            return Boolean((this.encounterFlags[0] >> 2) & 1);
        }

        setPokemonAlternateForm(form: number): boolean {
            if (form > 31 || form < 0)
                throw new PKEdit.OutOfBoundsException(this, "Alternate form is out of bounds.");

            this._setEncounterData(null, null, form);

            return true;
        }

        getPokemonAlternateForm(): number {
            if (!this.encounterFlags) {
                var offset = PK6.Memory.Map.ENCOUNTER_FLAGS;
                var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
                this.encounterFlags = memory;
            }

            return (this.encounterFlags[0] >> 3);
        }

        setPokemonEffortValues(effort_values: {"hp": number, "attack": number, "defense": number, "specialattack": number, "specialdefense": number, "speed": number}): boolean {
            var offset_hp = PK6.Memory.Map.EV_HP;

            var memory = new Uint8Array(6);
            memory[0] = effort_values.hp;
            memory[1] = effort_values.attack;
            memory[2] = effort_values.defense;
            memory[3] = effort_values.specialattack;
            memory[4] = effort_values.specialdefense;
            memory[5] = effort_values.speed;

            PK6.Memory.RW.setValueAt(offset_hp[0], memory, 0x6, this);

            return true;
        }

        getPokemonEffortValues(): { "hp": number, "attack": number, "defense": number, "specialattack": number, "specialdefense": number, "speed": number } {
            var offset_hp = PK6.Memory.Map.EV_HP;
            var memory = PK6.Memory.RW.getValueAt(offset_hp[0], 0x6, this);

            let hp = memory[0];
            let attack = memory[1];
            let defense = memory[2];
            let specialattack = memory[3];
            let specialdefense = memory[4];
            let speed = memory[5];

            return { "hp": hp, "attack": attack, "defense": defense, "specialattack": specialattack, "specialdefense": specialdefense, "speed": speed };
        }

        setPokemonContestStats(stats: { "cool": number, "beauty": number, "cute": number, "tough": number, "sheen": number }): boolean {
            var offset_cool = PK6.Memory.Map.CONTEST_COOL;

            var memory = new Uint8Array(5);
            memory[0] = stats.cool;
            memory[1] = stats.beauty;
            memory[2] = stats.cute;
            memory[3] = stats.tough;
            memory[4] = stats.sheen;

            PK6.Memory.RW.setValueAt(offset_cool[0], memory, 0x6, this);

            return true;
        }

        getPokemonContestStats(): { "cool": number, "beauty": number, "cute": number, "tough": number, "sheen": number } {
            var offset_cool = PK6.Memory.Map.EV_HP;
            var memory = PK6.Memory.RW.getValueAt(offset_cool[0], 0x5, this);

            let cool = memory[0];
            let beauty = memory[1];
            let cute = memory[2];
            let tough = memory[3];
            let sheen = memory[4];

            return { "cool": cool, "beauty": beauty, "cute": cute, "tough": tough, "sheen": sheen };
        }

        setPokemonMarkings(circle: boolean, triangle: boolean, square: boolean, heart: boolean, star: boolean, diamond: boolean): boolean {
            var offset = PK6.Memory.Map.MARKINGS;
            var markings = new Uint8Array(1);

            markings[0] = circle ? (1 << 0) : 0;
            markings[0] |= triangle ? (1 << 1) : 0;
            markings[0] |= square ? (1 << 2) : 0;
            markings[0] |= heart ? (1 << 3) : 0;
            markings[0] |= star ? (1 << 4) : 0;
            markings[0] |= diamond ? (1 << 5) : 0;

            PK6.Memory.RW.setValueAt(offset[0], markings, offset[1], this);

            return true;

        }

        getPokemonMarkings(): Array<Boolean> {
            var offset = PK6.Memory.Map.MARKINGS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1]);
            var markings = memory[0];

            let circle = ((markings >> 0) & 1) == 1;
            let triangle = ((markings >> 1) & 1) == 1;
            let square = ((markings >> 2) & 1) == 1;
            let heart = ((markings >> 3) & 1) == 1;
            let star = ((markings >> 4) & 1) == 1;
            let diamond = ((markings >> 5) & 1) == 1;

            return [circle, triangle, square, heart, star, diamond];
        }

        setPokemonPokerus(strain: number, duration: number): boolean {
            var offset = PK6.Memory.Map.POKERUS;
            var buffer = new Uint8Array(1);
            buffer[0] = (strain << 4 | duration);
            PK6.Memory.RW.setValueAt(offset[0], buffer, offset[0], this);
            return true;
        }

        getPokemonPokerus(): Array<number> {
            var offset = PK6.Memory.Map.POKERUS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let strain = memory[0] >> 4;
            let duration = memory[0] & 0xf;

            return [strain, duration];
        }

        setPokemonSuperTrainingFlags(flags: Array<String>): boolean {
            var offset = PK6.Memory.Map.SUPERTRAINING_GOLD_FLAGS;
            var memory = new Uint8Array(4);

            for (var flag in flags) {
                var f: any = flags[flag];
                var r = PK6.Ribbons.superTrainingMap[f];
                memory[r[0] - 0x2C] |= (1 << r[1]);
            }
            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonSuperTrainingFlags(): Array<String> {
            var offset = PK6.Memory.Map.SUPERTRAINING_GOLD_FLAGS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var result = [];

            for (var key in PK6.Ribbons.superTrainingMap) {
                var value = PK6.Ribbons.superTrainingMap[key];
                for (var i in memory) {
                    if ((value[0] - 0x2C == i) && ((memory[i] >> value[1]) & 1)) {
                        result.push(key);
                    }
                }
            }

            return result;

        }
        
        setPokemonRibbons(ribbons: Array<String>): boolean {
            var offset = PK6.Memory.Map.RIBBONS;
            var memory = new Uint8Array(5);

            for (var ribbon in ribbons) {
                var key: any = ribbons[ribbon];
                var value = PK6.Ribbons.superTrainingMap[key];
                memory[value[0] - 0x2C] |= (1 << value[1]);
            }
            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonRibbons(): Array<String> {
            var offset = PK6.Memory.Map.RIBBONS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var result = [];

            for (var key in PK6.Ribbons.ribbonsMap) {
                var value = PK6.Ribbons.ribbonsMap[key];
                for (var i in memory) {
                    if ((value[0] - 0x30 == i) && ((memory[i] >> value[1]) & 1)) {
                        result.push(key);
                    }
                }
            }

            return result;
        }

        setPokemonRibbonStats(contest: number, battle: number): boolean {
            var offset = PK6.Memory.Map.RIBBON_STATS;
            var memory = new Uint8Array(2);
            memory[0] = contest;
            memory[1] = battle;

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonRibbonStats(): Array<Number> {
            var offset = PK6.Memory.Map.RIBBON_STATS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1]);
            
            // returns amount of contest and battle memory ribbons
            return [memory[0], memory[1]];
        }

        setSuperTrainingDistributionFlags(flags: Array<String>): boolean {
            var offset = PK6.Memory.Map.RIBBONS;
            var memory = new Uint8Array(1);

            for (var flag in flags) {
                var key: any = flags[flag];
                var value = PK6.Ribbons.superTrainingDistributionMap[key];
                memory[0] |= (1 << value[1]);
            }
            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getSuperTrainingDistributionFlags(): Array<String> {
            var offset = PK6.Memory.Map.SUPERTRAINING_DISTRIBUTION_FLAGS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var result = [];

            for (var key in PK6.Ribbons.superTrainingDistributionMap) {
                var value = PK6.Ribbons.superTrainingDistributionMap[key];
                if ((memory[0] >> value[1]) & 1) {
                    result.push(key);
                }
            }

            return result;
        }

        /* Block B */
        
        setPokemonNickname(nickname: string): boolean {
            var offset = PK6.Memory.Map.NICKNAME;

            var uint16arr = new Uint16Array(0x9);
            for (var i = 0, j = nickname.length; i < j; ++i) {
                uint16arr[i] = nickname.charCodeAt(i);
            }

            var uint8arr = new Uint8Array(uint16arr.buffer);

            PK6.Memory.RW.setValueAt(offset[0], uint8arr, offset[1], this);

            return true;
        }

        getPokemonNickname(): string {
            var offset = PK6.Memory.Map.NICKNAME;
            var memory = new Uint16Array(PK6.Memory.RW.getValueAt(offset[0], offset[1], this).buffer);

            return String.fromCharCode.apply(null, memory);
        }

        setPokemonMoves(move1?: number, move2?: number, move3?: number, move4?: number): boolean {
            var offset_move1 = PK6.Memory.Map.MOVE1_ID;
            var offset_move2 = PK6.Memory.Map.MOVE2_ID;
            var offset_move3 = PK6.Memory.Map.MOVE3_ID;
            var offset_move4 = PK6.Memory.Map.MOVE4_ID;

            if (move1) {
                let ua = new Uint8Array(new Uint16Array([move1]).buffer);
                PK6.Memory.RW.setValueAt(offset_move1[0], ua, offset_move1[1], this);
            }
            if (move2) {
                let ua = new Uint8Array(new Uint16Array([move2]).buffer);
                PK6.Memory.RW.setValueAt(offset_move2[0], ua, offset_move2[1], this);
            }
            if (move3) {
                let ua = new Uint8Array(new Uint16Array([move3]).buffer);
                PK6.Memory.RW.setValueAt(offset_move3[0], ua, offset_move3[1], this);
            }
            if (move4) {
                let ua = new Uint8Array(new Uint16Array([move4]).buffer);
                PK6.Memory.RW.setValueAt(offset_move4[0], ua, offset_move4[1], this);
            }

            return true;
        }

        getPokemonMoves(): Array<Number> {
            var offset_move1 = PK6.Memory.Map.MOVE1_ID;
            var offset_move2 = PK6.Memory.Map.MOVE2_ID;
            var offset_move3 = PK6.Memory.Map.MOVE3_ID;
            var offset_move4 = PK6.Memory.Map.MOVE4_ID;

            var memory_move1 = PK6.Memory.RW.getValueAt(offset_move1[0], offset_move1[1], this);
            var ua_move1 = new Uint16Array(memory_move1.buffer);

            var memory_move2 = PK6.Memory.RW.getValueAt(offset_move2[0], offset_move2[1], this);
            var ua_move2 = new Uint16Array(memory_move2.buffer);

            var memory_move3 = PK6.Memory.RW.getValueAt(offset_move3[0], offset_move3[1], this);
            var ua_move3 = new Uint16Array(memory_move3.buffer);

            var memory_move4 = PK6.Memory.RW.getValueAt(offset_move4[0], offset_move4[1], this);
            var ua_move4 = new Uint16Array(memory_move4.buffer);

            return [ua_move1[0], ua_move2[0], ua_move3[0], ua_move4[0]];
        }

        setPokemonMovePP(move1?: number, move2?: number, move3?: number, move4?: number): boolean {
            var offset_pp1 = PK6.Memory.Map.MOVE1_PP;
            var offset_pp2 = PK6.Memory.Map.MOVE2_PP;
            var offset_pp3 = PK6.Memory.Map.MOVE3_PP;
            var offset_pp4 = PK6.Memory.Map.MOVE4_PP;

            if (move1) {
                PK6.Memory.RW.setValueAt(offset_pp1[0], new Uint8Array(move1), offset_pp1[1], this);
            }
            if (move2) {
                PK6.Memory.RW.setValueAt(offset_pp2[0], new Uint8Array(move2), offset_pp2[1], this);
            }
            if (move3) {
                PK6.Memory.RW.setValueAt(offset_pp3[0], new Uint8Array(move3), offset_pp3[1], this);
            }
            if (move4) {
                PK6.Memory.RW.setValueAt(offset_pp4[0], new Uint8Array(move4), offset_pp4[1], this);
            }

            return true;
        }

        getPokemonMovePP(): Array<Number> {
            var offset_pp1 = PK6.Memory.Map.MOVE1_PP;
            var offset_pp2 = PK6.Memory.Map.MOVE2_PP;
            var offset_pp3 = PK6.Memory.Map.MOVE3_PP;
            var offset_pp4 = PK6.Memory.Map.MOVE4_PP;

            var memory_pp1 = PK6.Memory.RW.getValueAt(offset_pp1[0], offset_pp1[1], this);
            var memory_pp2 = PK6.Memory.RW.getValueAt(offset_pp2[0], offset_pp2[1], this);
            var memory_pp3 = PK6.Memory.RW.getValueAt(offset_pp3[0], offset_pp3[1], this);
            var memory_pp4 = PK6.Memory.RW.getValueAt(offset_pp4[0], offset_pp4[1], this);


            return [memory_pp1[0], memory_pp2[0], memory_pp3[0], memory_pp4[0]];
        }

        setPokemonMovePPUps(move1?: number, move2?: number, move3?: number, move4?: number): boolean {
            var offset_ppup1 = PK6.Memory.Map.MOVE1_PPUPS;
            var offset_ppup2 = PK6.Memory.Map.MOVE2_PPUPS;
            var offset_ppup3 = PK6.Memory.Map.MOVE3_PPUPS;
            var offset_ppup4 = PK6.Memory.Map.MOVE4_PPUPS;

            if (move1) {
                PK6.Memory.RW.setValueAt(offset_ppup1[0], new Uint8Array(move1), offset_ppup1[1], this);
            }
            if (move2) {
                PK6.Memory.RW.setValueAt(offset_ppup2[0], new Uint8Array(move2), offset_ppup2[1], this);
            }
            if (move3) {
                PK6.Memory.RW.setValueAt(offset_ppup3[0], new Uint8Array(move3), offset_ppup3[1], this);
            }
            if (move4) {
                PK6.Memory.RW.setValueAt(offset_ppup4[0], new Uint8Array(move4), offset_ppup4[1], this);
            }

            return true;
        }

        getPokemonMovePPUps(): Array<Number> {
            var offset_ppup1 = PK6.Memory.Map.MOVE1_PPUPS;
            var offset_ppup2 = PK6.Memory.Map.MOVE2_PPUPS;
            var offset_ppup3 = PK6.Memory.Map.MOVE3_PPUPS;
            var offset_ppup4 = PK6.Memory.Map.MOVE4_PPUPS;

            var memory_ppup1 = PK6.Memory.RW.getValueAt(offset_ppup1[0], offset_ppup1[1], this);
            var memory_ppup2 = PK6.Memory.RW.getValueAt(offset_ppup2[0], offset_ppup2[1], this);
            var memory_ppup3 = PK6.Memory.RW.getValueAt(offset_ppup3[0], offset_ppup3[1], this);
            var memory_ppup4 = PK6.Memory.RW.getValueAt(offset_ppup4[0], offset_ppup4[1], this);


            return [memory_ppup1[0], memory_ppup2[0], memory_ppup3[0], memory_ppup4[0]];
        }

        setPokemonRelearnMoves(move1?: number, move2?: number, move3?: number, move4?: number): boolean {
            var offset_relearn1 = PK6.Memory.Map.MOVE1_RELEARN;
            var offset_relearn2 = PK6.Memory.Map.MOVE2_RELEARN;
            var offset_relearn3 = PK6.Memory.Map.MOVE3_RELEARN;
            var offset_relearn4 = PK6.Memory.Map.MOVE4_RELEARN;

            if (move1) {
                let ua = new Uint8Array(new Uint16Array([move1]).buffer);
                PK6.Memory.RW.setValueAt(offset_relearn1[0], ua, offset_relearn1[1], this);
            }
            if (move2) {
                let ua = new Uint8Array(new Uint16Array([move2]).buffer);
                PK6.Memory.RW.setValueAt(offset_relearn2[0], ua, offset_relearn2[1], this);
            }
            if (move3) {
                let ua = new Uint8Array(new Uint16Array([move3]).buffer);
                PK6.Memory.RW.setValueAt(offset_relearn3[0], ua, offset_relearn3[1], this);
            }
            if (move4) {
                let ua = new Uint8Array(new Uint16Array([move4]).buffer);
                PK6.Memory.RW.setValueAt(offset_relearn4[0], ua, offset_relearn4[1], this);
            }

            return true;
        }

        getPokemonRelearnMoves(): Array<Number> {
            var offset_move1 = PK6.Memory.Map.MOVE1_RELEARN;
            var offset_move2 = PK6.Memory.Map.MOVE2_RELEARN;
            var offset_move3 = PK6.Memory.Map.MOVE3_RELEARN;
            var offset_move4 = PK6.Memory.Map.MOVE4_RELEARN;

            var memory_move1 = PK6.Memory.RW.getValueAt(offset_move1[0], offset_move1[1], this);
            var ua_move1 = new Uint16Array(memory_move1.buffer);

            var memory_move2 = PK6.Memory.RW.getValueAt(offset_move2[0], offset_move2[1], this);
            var ua_move2 = new Uint16Array(memory_move2.buffer);

            var memory_move3 = PK6.Memory.RW.getValueAt(offset_move3[0], offset_move3[1], this);
            var ua_move3 = new Uint16Array(memory_move3.buffer);

            var memory_move4 = PK6.Memory.RW.getValueAt(offset_move4[0], offset_move4[1], this);
            var ua_move4 = new Uint16Array(memory_move4.buffer);

            return [ua_move1[0], ua_move2[0], ua_move3[0], ua_move4[0]];
        }

        setPokemonSuperTrainingSecretMissionFlag(flag: boolean): boolean {
            var offset = PK6.Memory.Map.SUPERTRAINING_MISSIONFLAG;

            PK6.Memory.RW.setValueAt(offset[0], new Uint8Array([Number(flag)]), offset[1]);
            
            return true;
        }

        getPokemonSuperTrainingSecretMissionFlag(): boolean {
            var offset = PK6.Memory.Map.SUPERTRAINING_MISSIONFLAG;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return (memory[0] == 1);
        }

        // TODO: Implement this better
        setPokemonIndividualValues(IVs: { "hp"?: number, "attack"?: number, "defense"?: number, "specialattack"?: number, "specialdefense"?: number, "speed"?: number }): boolean {
            return this._setIVs(IVs);

            return true;
        }

        getPokemonIndividualValues(): Array<Number> {
            var values = this._getIVs();
            return [
                values[0], // HP
                values[1], // Attack
                values[2], // Defense
                values[4], // Special Attack
                values[5], // Special Defense
                values[3]  // Speed
            ];
        }

        setIsPokemonEgg(isEgg: boolean): boolean {
            this._setIVs(null, isEgg);

            return true;
        }

        getIsPokemonEgg(): boolean {
            var values = this._getIVs();

            return Boolean(values[6]);
        }

        setIsPokemonNicknamed(isNicknamed: boolean): boolean {
            return this._setIVs(null, null, isNicknamed);
        }

        getIsPokemonNicknamed(): boolean {
            var values = this._getIVs();
            return Boolean(values[7]);
        }

        /* Block C */

        setPokemonLastHadlerNickname(nickname: string): boolean {
            var offset = PK6.Memory.Map.LH_NICKNAME;

            var uint16arr = new Uint16Array(0x9);
            for (var i = 0, j = nickname.length; i < j; ++i) {
                uint16arr[i] = nickname.charCodeAt(i);
            }

            var uint8arr = new Uint8Array(uint16arr.buffer);

            PK6.Memory.RW.setValueAt(offset[0], uint8arr, offset[1], this);

            return true;
        }

        getPokemonLastHandlerNickname(): string {
            var offset = PK6.Memory.Map.LH_NICKNAME;
            var memory = new Uint16Array(PK6.Memory.RW.getValueAt(offset[0], offset[1], this).buffer);
            return String.fromCharCode.apply(null, memory);
        }

        setPokemonLastHandlerGender(gender: any): boolean {
            var offset = PK6.Memory.Map.LH_GENDER;
            
            if (gender !== 0 && gender !== 1)
                throw new PKEdit.OutOfBoundsException(this, "The specified last handler gender is out of bounds");

            PK6.Memory.RW.setValueAt(offset[0], new Uint8Array([gender]), offset[1], this);

            return true;
        }

        getPokemonLastHandlerGender(): number {
            var offset = PK6.Memory.Map.LH_GENDER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonCurrentHandler(is_ot: boolean): boolean {
            var offset = PK6.Memory.Map.CURRENT_HANDLER;
            var memory = new Uint8Array([Number(is_ot)]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonCurrentHandler(): number {
            var offset = PK6.Memory.Map.CURRENT_HANDLER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonTraveledLocations(region1: [number, number], region2?: [number, number],
            region3?: [number, number], region4?: [number, number], region5?: [number, number]): boolean {
            var offset1 = PK6.Memory.Map.GEOLOC_1;
            var offset2 = PK6.Memory.Map.GEOLOC_2;
            var offset3 = PK6.Memory.Map.GEOLOC_3;
            var offset4 = PK6.Memory.Map.GEOLOC_4;
            var offset5 = PK6.Memory.Map.GEOLOC_5;

            if (region1)
                PK6.Memory.RW.setValueAt(offset1[0], new Uint8Array(region1), offset1[1], this);
            if (region2)
                PK6.Memory.RW.setValueAt(offset2[0], new Uint8Array(region2), offset2[1], this);
            if (region3)
                PK6.Memory.RW.setValueAt(offset3[0], new Uint8Array(region3), offset3[1], this);
            if (region4)
                PK6.Memory.RW.setValueAt(offset4[0], new Uint8Array(region4), offset4[1], this);
            if (region5)
                PK6.Memory.RW.setValueAt(offset5[0], new Uint8Array(region5), offset5[1], this);

            return true;
        }

        getPokemonTraveledLocation(): Array<Uint8Array> {
            var offset1 = PK6.Memory.Map.GEOLOC_1;
            var offset2 = PK6.Memory.Map.GEOLOC_2;
            var offset3 = PK6.Memory.Map.GEOLOC_3;
            var offset4 = PK6.Memory.Map.GEOLOC_4;
            var offset5 = PK6.Memory.Map.GEOLOC_5;

            var region1 = PK6.Memory.RW.getValueAt(offset1[0], offset1[1], this);
            var region2 = PK6.Memory.RW.getValueAt(offset2[0], offset2[1], this);
            var region3 = PK6.Memory.RW.getValueAt(offset3[0], offset3[1], this);
            var region4 = PK6.Memory.RW.getValueAt(offset4[0], offset4[1], this);
            var region5 = PK6.Memory.RW.getValueAt(offset5[0], offset5[1], this);

            return [region1, region2, region3, region4, region5];
        }

        setPokemonLastHandlerFriendship(friendship: number): boolean {
            var offset = PK6.Memory.Map.LH_FRIENDSHIP;
            var memory = new Uint8Array([friendship]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerFriendship(): number {
            var offset = PK6.Memory.Map.LH_FRIENDSHIP;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonLastHanderAffection(affection: number): boolean {
            var offset = PK6.Memory.Map.LH_AFFECTION;
            var memory = new Uint8Array([affection]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerAffection(friendship: number): number {
            var offset = PK6.Memory.Map.LH_FRIENDSHIP;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonLastHanderMemoryIntensity(memory_intensity: number): boolean {
            var offset = PK6.Memory.Map.LH_MEMORY_INTENSITY;
            var memory = new Uint8Array([memory_intensity]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerMemoryIntensity(): number {
            var offset = PK6.Memory.Map.LH_MEMORY_INTENSITY;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonLastHandlerMemoryLine(memory_line: number): boolean {
            var offset = PK6.Memory.Map.LH_MEMORY_LINE;
            var memory = new Uint8Array([memory_line]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerMemoryLine(): number {
            var offset = PK6.Memory.Map.LH_MEMORY_LINE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonLastHanderMemoryFeeling(memory_feeling: number): boolean {
            var offset = PK6.Memory.Map.LH_MEMORY_FEELING;
            var memory = new Uint8Array([memory_feeling]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerMemoryFeeling(): number {
            var offset = PK6.Memory.Map.LH_MEMORY_FEELING;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonLastHandlerMemoryText(memory_text: number): boolean {
            var offset = PK6.Memory.Map.LH_MEMORY_TEXT;
            var u16a = new Uint16Array([memory_text]);
            var memory = new Uint8Array(u16a.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonLastHandlerMemoryText(): number {
            var offset = PK6.Memory.Map.LH_MEMORY_TEXT;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonAmieFullness(amie_fullness: number): boolean {
            var offset = PK6.Memory.Map.AMIE_FULLNESS;
            var memory = new Uint8Array([amie_fullness]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonAmieFullness(): number {
            var offset = PK6.Memory.Map.AMIE_FULLNESS;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonAmieEnjoyment(amie_enjoyment: number): boolean {
            var offset = PK6.Memory.Map.AMIE_ENJOYMENT;
            var memory = new Uint8Array([amie_enjoyment]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonAmieEnjoyment(): number {
            var offset = PK6.Memory.Map.AMIE_ENJOYMENT;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        /* Block D */

        setPokemonOriginalTrainerNickname(nickname: string): boolean {
            var offset = PK6.Memory.Map.OT_NICKNAME;

            var uint16arr = new Uint16Array(0x9);
            for (var i = 0, j = nickname.length; i < j; ++i) {
                uint16arr[i] = nickname.charCodeAt(i);
            }

            var uint8arr = new Uint8Array(uint16arr.buffer);

            PK6.Memory.RW.setValueAt(offset[0], uint8arr, offset[1], this);

            return true;
        }

        getPokemonOrignalTrainerNickname(): string {
            var offset = PK6.Memory.Map.OT_NICKNAME;
            var memory = new Uint16Array(PK6.Memory.RW.getValueAt(offset[0], offset[1], this).buffer);
            return String.fromCharCode.apply(null, memory);
        }

        setPokemonOriginalTrainerFriendship(friendship: number): boolean {
            var offset = PK6.Memory.Map.OT_FRIENDSHIP;
            var memory = new Uint8Array([friendship]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerFriendship(): number {
            var offset = PK6.Memory.Map.OT_FRIENDSHIP;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonOriginalTrainerMemoryIntensity(memory_intensity: number): boolean {
            var offset = PK6.Memory.Map.OT_MEMORY_INTENSITY;
            var memory = new Uint8Array([memory_intensity]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerMemoryIntensity(): number {
            var offset = PK6.Memory.Map.OT_MEMORY_INTENSITY;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonOriginalTrainerMemoryLine(memory_line: number): boolean {
            var offset = PK6.Memory.Map.OT_MEMORY_LINE;
            var memory = new Uint8Array([memory_line]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerMemoryLine(): number {
            var offset = PK6.Memory.Map.OT_MEMORY_LINE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonOriginalTrainerMemoryText(memory_text: number): boolean {
            var offset = PK6.Memory.Map.LH_MEMORY_TEXT;
            var u16a = new Uint16Array([memory_text]);
            var memory = new Uint8Array(u16a.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerMemoryText(): number {
            var offset = PK6.Memory.Map.OT_MEMORY_TEXT;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonOriginalTrainerMemoryFeeling(memory_feeling: number): boolean {
            var offset = PK6.Memory.Map.OT_MEMORY_FEELING;
            var memory = new Uint8Array([memory_feeling]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerMemoryFeeling(): number {
            var offset = PK6.Memory.Map.OT_MEMORY_FEELING;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonEggMetDate(year: number, month: number, day: number): boolean {
            var offset = PK6.Memory.Map.EGG_MET_DATE;

            if (year > 0xff || year < 2000 || month > 0xff || day >> 0xff)
                throw new PKEdit.OutOfBoundsException(this, "The specified egg met date is invalid.");
            
            var buffer = new Uint8Array(3);

            buffer[0] = Number(year.toString().substr(-2));
            buffer[1] = month;
            buffer[2] = day;

            return true;
        }

        getPokemonEggMetDate(): Array<Number> {
            var offset = PK6.Memory.Map.EGG_MET_DATE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let year = Number("20" + memory[0]);
            let month = memory[1];
            let day = memory[2];

            return [year, month, day];
            
        }

        setPokemonMetDate(year: number, month: number, day: number): boolean {
            var offset = PK6.Memory.Map.MET_DATE;

            if (year > 0xff || year < 2000 || month > 0xff || day >> 0xff)
                throw new PKEdit.OutOfBoundsException(this, "The specified met date is invalid.");

            var buffer = new Uint8Array(3);

            buffer[0] = Number(year.toString().substr(-2));
            buffer[1] = month;
            buffer[2] = day;

            return true;
        }

        getPokemonMetDate(): Array<Number> {
            var offset = PK6.Memory.Map.MET_DATE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let year = Number("20" + memory[0]);
            let month = memory[1];
            let day = memory[2];

            return [year, month, day];
        }

        setPokemonPokeball(pokeball: number): boolean {
            var offset = PK6.Memory.Map.POKEBALL;
            var memory = new Uint8Array(pokeball);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonPokeball(): number {
            var offset = PK6.Memory.Map.POKEBALL;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonEggMetLocation(met_location: number): boolean {
            var offset = PK6.Memory.Map.EGG_MET_DATE;
            var buffer = new Uint16Array([met_location]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonEggMetLocation(): number {
            var offset = PK6.Memory.Map.EGG_MET_DATE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonMetLocation(met_location: number): boolean {
            var offset = PK6.Memory.Map.MET_DATE;
            var buffer = new Uint16Array([met_location]);
            var memory = new Uint8Array(buffer.buffer);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonMetLocation(): number {
            var offset = PK6.Memory.Map.MET_DATE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);
            var u16a = new Uint16Array(memory.buffer);

            return u16a[0];
        }

        setPokemonEncounterLevel(level: number): boolean {
            var offset = PK6.Memory.Map.ENCOUNTER_OT_GENDER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let ot_gender = memory[0] >> 7;
            let encounter_level = memory[0] & 0x7F;

            memory[0] = ((level & 0x7F) | (ot_gender << 7));

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonEncounterLevel(): number {
            var offset = PK6.Memory.Map.ENCOUNTER_OT_GENDER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let ot_gender = memory[0] >> 7;
            let encounter_level = memory[0] & 0x7F;

            return encounter_level;
        }

        setPokemonOriginalTrainerGender(gender: number): boolean {
            var offset = PK6.Memory.Map.ENCOUNTER_OT_GENDER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let ot_gender = memory[0] >> 7;
            let encounter_level = memory[0] & 0x7F;

            if (gender !== 0 && gender !== 1)
                throw new PKEdit.OutOfBoundsException(this, "The specified last handler gender is out of bounds");

            memory[0] = ((encounter_level & 0x7F) | (gender << 7));

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);

            return true;
        }

        getPokemonOriginalTrainerGender(): number {
            var offset = PK6.Memory.Map.ENCOUNTER_OT_GENDER;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            let ot_gender = memory[0] >> 7;
            let encounter_level = memory[0] & 0x7F;

            return ot_gender;
        }

        setPokemonEncounterType(encounter_type: number): boolean {
            var offset = PK6.Memory.Map.ENCOUNTER_TYPE;
            var memory = new Uint8Array([encounter_type]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonEncounterType(): number {
            var offset = PK6.Memory.Map.ENCOUNTER_TYPE;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonOriginalTrainerGameID(game_id: number): boolean {
            var offset = PK6.Memory.Map.OT_GAME_ID;
            var memory = new Uint8Array([game_id]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerGameID(): number {
            var offset = PK6.Memory.Map.OT_GAME_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonFromCountryID(country_id: number): boolean {
            var offset = PK6.Memory.Map.COUNTRY_ID;
            var memory = new Uint8Array([country_id]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonFromCountryID(): number {
            var offset = PK6.Memory.Map.COUNTRY_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonFromRegionID(region_id: number): boolean {
            var offset = PK6.Memory.Map.REGION_ID;
            var memory = new Uint8Array([region_id]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonRegionID(): number {
            var offset = PK6.Memory.Map.REGION_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonFrom3DSRegionID(region_id: number): boolean {
            var offset = PK6.Memory.Map.REGION_3DS_ID;
            var memory = new Uint8Array([region_id]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonFrom3DSRegionID(): number {
            var offset = PK6.Memory.Map.REGION_3DS_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }

        setPokemonOriginalTrainerLanguageID(language_id: number): boolean {
            var offset = PK6.Memory.Map.OT_LANGUAGE_ID;
            var memory = new Uint8Array([language_id]);

            PK6.Memory.RW.setValueAt(offset[0], memory, offset[1], this);
            return true;
        }

        getPokemonOriginalTrainerLanguageID(): number {
            var offset = PK6.Memory.Map.OT_LANGUAGE_ID;
            var memory = PK6.Memory.RW.getValueAt(offset[0], offset[1], this);

            return memory[0];
        }
    }
}