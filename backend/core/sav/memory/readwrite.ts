namespace PKEdit.Core {
    export namespace SAV.Memory.RW {
        // gets memory value at specified address
        export function getValueAt(address: number, bits: number): Uint8Array {
            var buffer: Uint8Array = new Uint8Array(bits);
            for (var b = bits, i = 0; b != 0; b--, i++, address++) {
                //console.debug("getting value at ", address.toString(16), PKEdit.File.binary_file[address]);
                buffer[i] = PKEdit.File.binary_file[address];
                /*if (i > 0xFFF)
                    break;*/
            }
            return buffer;
        }

        // sets memory value at specified address
        export function setValueAt(address: number, buffer: Uint8Array, bits: number): boolean {
            for (var b = bits, i = 0; b != 0; b--, i++, address++) {
                PKEdit.File.binary_file[address] = buffer[i];
            }
            return true;
        }
    }
}