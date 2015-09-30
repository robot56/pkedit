namespace PKEdit.Loader.FileTypes {
    export namespace PK6 {
        var A = 0, B = 1, C = 2, D = 3;

        var shuffleSequence = [
                        /*   enc   */  /*   dec   */
            /* 00 */    [[A, B, C, D], [A, B, C, D]],
            /* 01 */    [[A, B, D, C], [A, B, D, C]],
            /* 02 */    [[A, C, B, D], [A, C, B, D]],
            /* 03 */    [[A, C, D, B], [A, D, B, C]],
            /* 04 */    [[A, D, B, C], [A, C, D, B]],
            /* 05 */    [[A, D, C, B], [A, D, C, B]],
            /* 06 */    [[B, A, C, D], [B, A, C, D]],
            /* 07 */    [[B, A, D, C], [B, A, D, C]],
            /* 08 */    [[B, C, A, D], [C, A, B, D]],
            /* 09 */    [[B, C, D, A], [D, A, B, C]],
            /* 10 */    [[B, D, A, C], [C, A, D, B]],
            /* 11 */    [[B, D, C, A], [D, A, C, B]],
            /* 12 */    [[C, A, B, D], [B, C, A, D]],
            /* 13 */    [[C, A, D, B], [B, D, A, C]],
            /* 14 */    [[C, B, A, D], [C, B, A, D]],
            /* 15 */    [[C, B, D, A], [D, B, A, C]],
            /* 16 */    [[C, D, A, B], [C, D, A, B]],
            /* 17 */    [[C, D, B, A], [D, C, A, B]],
            /* 18 */    [[D, A, B, C], [B, C, D, A]],
            /* 19 */    [[D, A, C, B], [B, D, C, A]],
            /* 20 */    [[D, B, A, C], [C, B, D, A]],
            /* 21 */    [[D, B, C, A], [D, B, C, A]],
            /* 22 */    [[D, C, A, B], [C, D, B, A]],
            /* 23 */    [[D, C, B, A], [D, C, B, A]]
        ];

        export class Encrytion {
            // Stores the Pokemon
            private pk;
            // Stores a length cache of the original array
            private pklen;

            private seed: any;

            // Constructor takes a saveFile optionally
            constructor(saveFile?) {
                // If a save file is specified, use that
                if (saveFile) {
                    this.pk = saveFile;
                } else {
                    // Otherwise default to the PKObject data
                    this.pk = PKEdit.File.binary_file;
                }
                // Set the cache
                this.pklen = this.pk.length;
            }

            // Generate seeds required to cipher the binary
            private getRandomSeed(object?): number {
                if (object) {
                    // Pass-by-reference via an Object, generates random seeds
                    object.seed = object.seed.multiply(0x41C64E6D).add(0x6073).and(0xFFFFFFFF);
                    return object.seed >>> 16;
                } else {
                    // Use the `seed` variable if an object is not specified 
                    this.seed = this.seed.multiply(0x41C64E6D).add(0x6073).and(0xFFFFFFFF);
                    return this.seed >>> 16;
                }
            }

            // Shuffles the binary
            private shuffleBlocks(shuffleOrder, sortValue?): boolean {
                // Create a new array to hold the temporary data
                // We don't need header data such as the checksum, so don't allocate memory for it
                var ekx = new Uint8Array(260 - 8);

                // Copy the `pk` and `ekx` arrays, but exclude the header data
                for (var i = 8; i < 260; i++) {
                    ekx[i - 8] = this.pk[i];
                }

                // If the sortValue was not specified, set it
                if (!sortValue)
                    sortValue = (((this.pk[0] + (this.pk[1] << 8) + (this.pk[2] << 16)) & 0x3E000) >>> 0xD) % 24;

                // Get the shuffle order from the `shuffleSequence` array
                var order = shuffleSequence[sortValue][shuffleOrder];

                for (var i: number = 0; i < 4; i++) {
                    ekx.set(
                        this.pk.slice(8 + 56 * order[i], (8 + 56 * order[i]) + 56), // Array to copy
                        /*8 + */56 * i // `ekx` offset to copy the array to // debug
                    );
                }

                // Create a new `result` array as a temporary buffer
                var result = new Uint8Array(this.pklen);

                // Copy the core data back into the `result` array
                result.set(
                    ekx.slice(0, (this.pklen == 260 ? 232 : 232 - 8)), // Slice of array to copy
                    8 // Offset of `result` to copy the array to
                );

                // Copy the header data back into the `result`
                for (var i = 0; i < 8; i++)
                    result[i] = this.pk[i];

                // Check if the PK file was in the PC or player's party
                if (this.pklen > 232)
                    // If so add the party data to the result array
                    for (var i = 232; i < 260; i++)
                        result[i + 1] = ekx[i + 1 - 8];

                // Set `pk` to be equall to the `result` buffer;
                this.pk = result;

                return true;
            }

            private cipher(): boolean {
                // Variable to store decryption data
                var x: number;
                // Variable to store the RNG seed
                this.seed = bigInt(this.pk[0] + (this.pk[1] << 8) + (this.pk[2] << 16) + (this.pk[3] * 0x1000000));

                // Loop through the core data
                for (var i = 8; i < 232; i += 2) {
                    // Decrypt the blocks with the RNG seed
                    x = (this.pk[i] + (this.pk[i + 1] << 8)) ^ this.getRandomSeed();
                    this.pk[i] = x & 0xFF;
                    this.pk[i + 1] = x >>> 8;
                }

                this.seed = bigInt(this.pk[0] + (this.pk[1] << 8) + (this.pk[2] << 16) + (this.pk[3] * 0x1000000));

                // Check if the PK file was in the player's party
                if (this.pklen > 232) {
                    for (var i = 232; i < 260; i += 2) {
                        x = (this.pk[i] + (this.pk[i + 1] << 8)) ^ this.getRandomSeed();
                        this.pk[i] = x & 0xFF;
                        this.pk[i + 1] = x >>> 8;
                    }
                }

                return true;
            }

            // TODO(Extreme): Document this.
            public setChecksum(): boolean {
                var sum = 0;

                var chk = this.pk[6] + (this.pk[7] << 8);

                for (var i = 8; i < 232; i += 2) {
                    sum = (sum + (this.pk[i] + (this.pk[i + 1] << 8))) & 0xFFFFFFFF;
                }
                sum &= 0xFFFF;

                var buff = new Uint16Array([sum]);
                var u8a = new Uint8Array(buff.buffer);


                console.debug("SetChecksum(): ", sum.toString(16), sum.toString(2), PKEdit.Util.Numbers.UintArrayToString(u8a));
                //var blocks = PKEdit.Util.Numbers.formatInteger(sum);
                this.pk[6] = u8a[0];
                this.pk[7] = u8a[1];
                return this.pk;
            }

            public getChecksum() {
                var sum = 0;

                var chk = this.pk[6] + (this.pk[7] << 8);

                for (var i = 8; i < 232; i += 2) {
                    sum = (sum + (this.pk[i] + (this.pk[i + 1] << 8))) & 0xFFFFFFFF;
                }
                sum &= 0xFFFF;
                return sum;
            }

            public validateChecksum() {
                var sum = 0;

                var chk = this.pk[6] + (this.pk[7] << 8);

                for (var i = 8; i < 232; i += 2) {
                    sum = (sum + (this.pk[i] + (this.pk[i + 1] << 8))) & 0xFFFFFFFF;
                }
                sum &= 0xFFFF;

                return sum === chk;
            }

            public decrypt(): Uint8Array {

                //console.debug("Was given:", this.pk, md5(this.pk));

                this.cipher();
                this.shuffleBlocks(1);

                if (!this.validateChecksum()) {
                    console.warn("The PK6 checksum is invalid! This could mean that the pokemon is corrupt.");
                }

                //console.debug("--> Returned: ", md5(this.pk));

                //console.debug("Decrypted file (shuffled)", PKEdit.Util.Numbers.UintArrayToString(this.pk), this.pk.length); // debug

                return this.pk;
            }

            public encrypt() {
                if (!this.validateChecksum()) {
                    console.info("The PK6 checksum is invalid, we'll try to correct this!");
                }
                this.setChecksum();
                this.shuffleBlocks(0);
                this.cipher();
                return this.pk;
            }

        }
    }
}