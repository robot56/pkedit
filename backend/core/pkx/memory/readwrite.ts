namespace PKEdit.Core {
    export namespace PK6.Memory.RW {
        // gets memory value at specified address
        export function getValueAt(address: number, bits: number, pkObject?): Uint8Array {
            var buffer: Uint8Array = new Uint8Array(bits);

            if (pkObject)
                var binary = pkObject;
            else
                var binary = PKEdit.File;

            for (var b = bits, i = 0; b != 0; b-- , i++ , address++) {
                //console.debug("getting value at ", address.toString(16), binary.binary_file[address]);
                buffer[i] = binary.binary_file[address];
                if (i > 0xFFF)
                    break;
            }
            return buffer;
        }

        // sets memory value at specified address
        export function setValueAt(address: number, buffer: Uint8Array, bits: number, pkObject?): boolean {

            if (pkObject)
                var binary = pkObject;
            else
                var binary = PKEdit.File;

            for (var b = bits, i = 0; b != 0; b-- , i++ , address++) {
                //console.debug("Setting value at ", address.toString(16), "to", buffer[i]);
                binary.binary_file[address] = buffer[i];
            }
            return true;
        }

        export function commitToBox(boxData, savObject: SAV.SAVObject, encrypt = false) {
            /*var gameType = savObject.getGameType();
            var offset;

            if (gameType == "xy")
                offset = SAV.Memory.ORASMap.BOX_DATA;
            else
                offset = SAV.Memory.XYMap.BOX_DATA;

            for (var boxes in boxData) {
                var box = boxData[boxes];
                for (var slots in box) {
                    var slot = box[slots];
                    // TODO
                }
            }

            if (saveFile.length != 232) {
                throw new PKEdit.OutOfBoundsException(this, "Cannot export a Pokemon that is greater or less than 232 bytes to the PC storage.");
            }

            savObject.Common.setPlayerPCBoxes(boxData)
            SAV.Memory.RW.setValueAt(offset[0], pkObject, offset[1]);*/
        }

        export function commitToParty(pkObject) {
            throw new Error("Not yet implemented!");
        }
    }
}