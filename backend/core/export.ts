namespace PKEdit.Core {
    export namespace Export {
        export namespace PK6 {
            function exportToBox(pkObject, saveObject, box: number, slot: number) {
                var encryptor = new Loader.FileTypes.PK6.Encrytion(pkObject.binary_file);
                pkObject = encryptor.decrypt();

                var boxname = "box" + String(box);
                var slotname = "slot" + String(slot);

                var boxData = {
                    boxname: {
                        slotname: pkObject.binary_file
                    }
                };

                Core.PK6.Memory.RW.commitToBox(boxData, PKEdit.File.binary_file);

                // destroy the object
                pkObject = null;
                return;
            }

            function exportToParty() {
                console.warn("Call to unimplemented function: exportToParty()");
            }

            export function exportToEncryptedBinary(pkObject): Uint8Array {
                var encryptor = new Loader.FileTypes.PK6.Encrytion(pkObject.binary_file);
                pkObject = encryptor.encrypt();

                return pkObject;
            }

            export function exportToDecryptedBinary(pkObject): Uint8Array {
                var encryptor = new Loader.FileTypes.PK6.Encrytion(pkObject.binary_file);
                pkObject = encryptor.setChecksum();

                return pkObject;
            }
        }

        export namespace SAV6 {

            function exportToDecryptedBinary() {

            }
        }
    }
}