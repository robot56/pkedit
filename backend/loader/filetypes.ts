namespace PKEdit.Loader {


    export namespace FileTypes {

        export namespace PKX {

            // Checks if a PKX file is encrypted
            export function checkIfEncrypted() {
                // 0xE4-0xE7 are occupied if the file is encrypted
                if (PKEdit.File.binary_file[0xe4] != 0) {
                    return true;
                }
                return false;
            }

        }

    }

}