///<reference path='../PKEdit.ts'/>

declare var bigInt;
declare var md5;

namespace PKEdit.Loader.FileTypes.PKX.Decryptor {

    // http://projectpokemon.org/wiki/Pokemon_NDS_Structure

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

    var pkx;
    var ekx;

    function getRandomSeed(object) {
        object.seed = object.seed.multiply(0x41C64E6D).add(0x6073).and(0xFFFFFFFF);
        return object.seed >>> 16;
    }

    function shuffleBlocks2(pkx, shuffleOrder, sv = ((((pkx[0] + (pkx[1] << 8) + (pkx[2] << 16)) & 0x3E000) >>> 0xD) % 24)) {
        console.log("FILE BEFORE SHUFFLEBLOCK2 PROCESSES");
        console.debug(PKEdit.Util.Numbers.UintArrayToString(pkx));

        var pkx = pkx || PKEdit.File.binary_file;

        console.log(sv);

        var ekx = new Uint8Array(260 - 8);

        for (var i = 8; i < 260; i++) {
            ekx[i - 8] = pkx[i];
        }

        var aloc = [ 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 2, 3 ];
        var bloc = [ 1, 1, 2, 3, 2, 3, 0, 0, 0, 0, 0, 0, 2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2 ];
        var cloc = [ 2, 3, 1, 1, 3, 2, 2, 3, 1, 1, 3, 2, 0, 0, 0, 0, 0, 0, 3, 2, 3, 2, 1, 1 ];
        var dloc = [ 3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 3, 2, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0 ];

        //var shlog = [aloc[sv], bloc[sv], cloc[sv], dloc[sv]];

        var shlog = shuffleSequence[sv][shuffleOrder];
        //var shlog = [A, B, D, C];

        console.debug("shlog ", shlog);

        /* Array.Copy(  pkx,
                        8 + 56 * shlog[b],
                        ekx,
                        8 + 56 * b,
                        56);
        */
        /*  public static void Copy(
	            Array sourceArray,
	            int sourceIndex,
	            Array destinationArray,
	            int destinationIndex,
	            int length
            ) */

        
        for (var i: number = 0; i < 4; i++) {
            //console.debug("Number of items copied: ", (8 + 56 * shlog[i]) - (8 + 56 * i), shlog[i]);
            console.debug("Number of items copied: ", ((8 + 56 * shlog[i])) - ((8 + 56 * shlog[i]) + 56), pkx.slice(8 + 56 * shlog[i], (8 + 56 * shlog[i]) + 56));
            //ekx[i] = pkx.slice(8 + 56 * shlog[i], 8 + 56 * i);
            ekx.set(pkx.slice(8 + 56 * shlog[i], (8 + 56 * shlog[i]) + 56), 8 + 56 * i)
            //ekx[8 + 56 * i] = pkx.slice(8 + 56 * shlog[i], (8 + 56 * shlog[i]) + 56);
            console.log(md5(ekx));
        }

        //if (pkx.length > 232)


        console.debug("", PKEdit.Util.Numbers.UintArrayToString(ekx), ekx.length);

        var result = new Uint8Array(/*pkx.length == 232 ? 232 : */260);
        console.debug("", result);
        result.set(pkx);
        console.debug(PKEdit.Util.Numbers.UintArrayToString(result));
        result.set(ekx.slice(0, 232 - 8), 8);
        console.debug(PKEdit.Util.Numbers.UintArrayToString(result));
        if (pkx.length == 260) {
            console.info("+ is larger than 232, it's 260");
            for (var i = 232; i < 260; i++) {
                result[i + 1] = ekx[i + 1 - 8];
            }
        }
        console.log(PKEdit.Util.Numbers.UintArrayToString(result), result.length);
        pkx = result;
        this.pkx = result;
        return result;
        //throw new Error();
        /*

            // Get Shuffle Order
            

            // UnShuffle Away!
            for (int b = 0; b < 4; b++)
            Array.Copy(pkx, 8 + 56 * shlog[b], ekx, 8 + 56 * b, 56);

            // Fill the Battle Stats back
            if (pkx.Length > 232)
                Array.Copy(pkx, 232, ekx, 232, 28);

            return ekx;*/
    }

    function shuffleBlocks(sortMode, binaryFile?) {

        console.info("Sort mode is", sortMode);

        var arrayToShuffle = [];
        var binaryFile = binaryFile || PKEdit.File.binary_file;
        console.debug("binary post shuffle: ", binaryFile.toString());
        console.warn(PKEdit.Util.Numbers.UintArrayToString(binaryFile).toUpperCase().slice(0, -1));
        var sortOrder;

        for (var i = 0; i < 232; ++i) {
            arrayToShuffle[i] = binaryFile[i];
        }

        sortOrder = (((binaryFile[0] + (binaryFile[1] << 8) + (binaryFile[2] << 16)) & 0x3E000) >>> 0xD) % 24;

        // 4 encrypted sections
        for (var i = 0; i < 4; ++i) {
            // each section is 56-bytes large
            for (var j = 0; j < 56; ++j) {
                console.debug("Shuffle operation: Section is", i, "byte is ", j);
                console.debug(binaryFile[j + 56 * i + 8], j + 56 * i + 8, arrayToShuffle[j + 56 * shuffleSequence[sortOrder][sortMode][i] + 8]);
                //binaryFile.set(arrayToShuffle[j + 56 * shuffleSequence[sortOrder][sortMode][i] + 8], j + 56 * i + 8);
                binaryFile[j + 56 * i + 8] = arrayToShuffle[j + 56 * shuffleSequence[sortOrder][sortMode][i] + 8];
            }
        }

        console.log("ats", PKEdit.Util.Numbers.UintArrayToString(arrayToShuffle));
        console.log("sort order was", sortOrder);

        console.warn("binary @ shuffleBlocks(): ", binaryFile.toString());
        console.warn(PKEdit.Util.Numbers.UintArrayToString(binaryFile).toUpperCase().slice(0, -1));
            
    }

    function cipher(binaryFile?): number {
        var x: number;
        var binaryFile = binaryFile || PKEdit.File.binary_file;
        // pv or personality value

        console.debug("File before cipher", PKEdit.Util.Numbers.UintArrayToString(binaryFile).toUpperCase().slice(0, -1));

        var seedObject = {};
        seedObject["seed"] = bigInt(binaryFile[0] + (binaryFile[1] << 8) + (binaryFile[2] << 16) + (binaryFile[3] * 0x1000000));
        console.info("Seed/PV is at", seedObject["seed"], seedObject["seed"] == 874719978);

        for (var i = 8; i < 232; i += 2) {
            // shuffle value
            x = (binaryFile[i] + (binaryFile[i + 1] << 8)) ^ getRandomSeed(seedObject);
            binaryFile[i] = x & 0xFF;
            binaryFile[i + 1] = x >>> 8;
        }
        
        // Pokemon is in party
        if (binaryFile.length > 232) {
            for (var i = 232; i < 260; i += 2) {
                x = (binaryFile[i] + (binaryFile[i + 1] << 8)) ^ getRandomSeed(seedObject);
                binaryFile[i] = x & 0xFF;
                binaryFile[i + 1] = x >>> 8;

            }
        }
        
        console.warn("binary @ cipher(): ", binaryFile.toString());
        console.warn(PKEdit.Util.Numbers.UintArrayToString(binaryFile).toUpperCase().slice(0, -1));

        return x;
    }

    function cipher2() {
        var x: number;
        var binaryFile = PKEdit.File.binary_file;
        // pv or personality value
        var seedObject = {};
        seedObject["seed"] = bigInt(binaryFile[0] + (binaryFile[1] << 8) + (binaryFile[2] << 16) + (binaryFile[3] * 0x1000000));
        console.info("Seed/PV is at", seedObject["seed"], seedObject["seed"] == 874719978);
        var shuffleValue = (((seedObject["seed"] & 0x3E000) >> 0xD) % 24);
        console.info("Shuffle value is at", shuffleValue);
        console.info("Decryption key is", getRandomSeed(seedObject));

        console.log(md5(PKEdit.Util.Numbers.UintArrayToString(PKEdit.File.binary_file).toUpperCase().slice(0, -1)));
        for (var i = 8; i < 232; i += 2) {
            // shuffle value
            x = (binaryFile[i] + (binaryFile[i + 1] << 8)) ^ getRandomSeed(seedObject);
            console.log(md5(PKEdit.Util.Numbers.UintArrayToString(PKEdit.File.binary_file).toUpperCase().slice(0, -1)));
            if (x != 0) {
                console.debug("  ->", i, PKEdit.Util.Numbers.pad((binaryFile[i] + (binaryFile[i + 1] << 8)).toString(16)));
            }
            console.debug(PKEdit.Util.Numbers.pad(x.toString(16)));
            //binaryFile[i] = x & 0xFF;
            //binaryFile[i + 1] = x >>> 8;
        }

        console.warn("binary @ cipher(): ", binaryFile.toString());

        return x;
    }

    function setChecksum(ekx?): boolean {
        var binaryFile = ekx || PKEdit.File.binary_file;
        var sum = 0;

        var chk = binaryFile[6] + (binaryFile[7] << 8);

        for (var i = 8; i < 232; i += 2) {
            sum = (sum + (binaryFile[i] + (binaryFile[i + 1] << 8))) & 0xFFFFFFFF;
        }
        sum &= 0xFFFF;
        var blocks = PKEdit.Util.Numbers.formatInteger(sum);
        binaryFile[6] = blocks[0];
        binaryFile[7] = blocks[1];
        return true;
    }

    function getChecksum() {

    }

    export function encrypt(pkx?) {
        var o = { pkx: pkx || PKEdit.File.binary_file };
        console.warn(PKEdit.Util.Numbers.UintArrayToString(pkx).toUpperCase().slice(0, -1), o.pkx.length);
        // TODO: (Important) This shouldn't need a for loop
        for (var i = 0; i < 11; i++) {
            console.log(md5(o.pkx));
            shuffleBlocks2(o.pkx/*0*/, 1);
            console.warn(PKEdit.Util.Numbers.UintArrayToString(o.pkx));
        }
        return cipher(o.pkx);
    }

    export function decrypt(ekx?) {
        ekx = ekx || PKEdit.File.binary_file;
        alert(md5(ekx.binary_file) + " > " + ekx.binary_file.length);
        var sv = cipher(ekx.binary_file);
        alert(md5(ekx.binary_file) + " > " + ekx.binary_file.length);
        //shuffleBlocks(1, ekx.binary_file);
        shuffleBlocks2(ekx.binary_file, 1);
        alert(md5(ekx.binary_file) + " > " + ekx.binary_file.length);
        console.info(PKEdit.Util.Numbers.UintArrayToString(ekx.binary_file));
        //shuffleBlocks2(PKEdit.File.binary_file);
    }
}