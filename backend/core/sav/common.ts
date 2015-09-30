namespace PKEdit.Core.SAV {
    export class CommonSAV /*implements ICommonSave*/ {

        //CommonSAV.getThis

        private sav;
        private game;
        
        constructor(sav, gameType?) {
            this.sav = sav;
            if (!gameType || (gameType !== "xy") && (gameType !== "oras")) {
                if (PKEdit.File.type_hint == PKEdit.Loader.FileType.DECRYPTED_XY_CYBERSAVE_FILE ||
                    PKEdit.File.type_hint == PKEdit.Loader.FileType.DECRYPTED_RAW_XY_SAVE_FILE) {
                    this.game = "xy";
                } else {
                    this.game = "oras";
                }
            } else {
                this.game = gameType;
            }
        }

        getPlayerPokepuffData() {

        };
        getPlayerPocketData() {

        };
        /*getPlayerQuickAccessItems();
        getPlayerMapData();
        getPlayerPlayTime();
        getPlayerWardrobe();
        getWorldData();
        getPlayerTrainerInformation();
        getPlayerBoxMetadata();
        getPlayerBattleBox();
        getPlayerPSSFriends();
        getPlayerPSSAcquaintances();
        getPlayerPSSPasserby();
        getPlayerTrainerCard();
        getPlayerParty();
        getWorldEventFlags();
        getPlayerPokedex();
        getPlayerZRStorage();
        getPlayerOPowerFlags();
        getPlayerMetadata();
        getPlayerGTSCache();
        getWorldEncounterData();
        getPlayerNetworkData();
        getPlayerHallOfFameData();
        getPlayerMaisonData();
        getPlayerDaycareData();
        getWorldBerryData();
        getPlayerWondercardData();
        //getAnistarOldManStorage();
        getPlayerFriendSafariData();
        getPlayerPSSExtraData();
        getPlayerPSSExtraFriendData();
        getPlayerSupertrainingData();
        getPlayerPKBankGifts();
        getPlayerPGLGifts();*/

        getPlayerPCBoxes(box?: number, slot?: number): Object {
            var offset = (this.game == "xy" ? Memory.XYMap.BOX_DATA : Memory.ORASMap.BOX_DATA);
            var data = Memory.RW.getValueAt(offset[0], offset[1]);
            var pokemon = [];

            console.info("Decrypting boxes, please wait...");

            // Loops through all the boxes
            for (var boxno = 0, address = 232; boxno < 31; boxno++) {
                pokemon[boxno] = [];
                for (var slotno = 0; slotno < 30; slotno++, address += 232) {
                    var buffer = new Uint8Array(data.slice(address - 232, address));
                    var Decryptor = new PKEdit.Loader.FileTypes.PK6.Encrytion(buffer);
                    var decryptedFile = Decryptor.decrypt();
                    Decryptor.setChecksum();
                    //console.debug("Decrypted file was: ", PKEdit.Util.Numbers.UintArrayToString(decryptedFile));
                    pokemon[boxno].push(decryptedFile);
                }
            }
            data = new Uint8Array(0); // remove from memory
            return pokemon;
        }
        //getPlayerPGLImageCache();

        ///

        /*setPlayerPokepuffData(): boolean;
        setPlayerPocketData(): boolean;
        setPlayerQuickAccessItems(): boolean;
        setPlayerMapData(): boolean;
        setPlayerPlayTime(): boolean;
        setPlayerWardrobe(): boolean;
        setWorldData(): boolean;
        setPlayerTrainerInformation(): boolean;
        setPlayerBoxMetadata(): boolean;
        setPlayerBattleBox(): boolean;
        setPlayerPSSFriends(): boolean;
        setPlayerPSSAcquaintances(): boolean;
        setPlayerPSSPasserby(): boolean;
        setPlayerTrainerCard(): boolean;
        setPlayerParty(): boolean;
        setWorldEventFlags(): boolean;
        setPlayerPokedex(): boolean;
        setPlayerZRStorage(): boolean;
        setPlayerOPowerFlags(): boolean;
        setPlayerMetadata(): boolean;
        setPlayerGTSCache(): boolean;
        setWorldEncounterData(): boolean;
        setPlayerNetworkData(): boolean;
        setPlayerHallOfFameData(): boolean;
        setPlayerMaisonData(): boolean;
        setPlayerDaycareData(): boolean;
        setWorldBerryData(): boolean;
        setPlayerWondercardData(): boolean;
        //setAnistarOldManStorage(): boolean;
        setPlayerFriendSafariData(): boolean;
        setPlayerPSSExtraData(): boolean;
        setPlayerPSSExtraFriendData(): boolean;
        setPlayerSupertrainingData(): boolean;
        setPlayerPKBankGifts(): boolean;
        setPlayerPGLGifts(): boolean;*/

        setPlayerPCBoxes(boxes: any): boolean {
            var offset = (this.game == 'xy' ? Memory.XYMap.BOX_DATA : Memory.ORASMap.BOX_DATA);

            if (boxes instanceof Array) {
                if (boxes.length !== 31) {
                    throw new PKEdit.OutOfBoundsException(this, "boxes.length: Out of bounds");
                }
                for (let slots in boxes) {
                    if (slots.length !== 30) {
                        throw new PKEdit.OutOfBoundsException(this, "slots.length: Out of bounds")
                    }
                }
            } else if (boxes instanceof Object) {

            }
            return true;
        }
        //setPlayerPGLImageCache(): boolean;
    }
}