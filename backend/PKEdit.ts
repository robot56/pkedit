namespace PKEdit {

    // Holds the class instance
    export var File;

    // Public class used to interact with internals
    export class PKObject {
        private binary_file: Array<Uint8Array>;
        private pk_binary_file: Array<Uint8Array>;
        private type_hint: number;

        constructor(binary_file, type_hint = undefined) {

            if (!window["bigInt"]) {
                throw new ReferenceError("BigInt not found!");
            }

            this.binary_file = binary_file;
            this.type_hint = type_hint || undefined;
            File = this;
        }

        public get getBinaryFile() {
            return this.binary_file;
        }

        public set setBinaryFile(buffer: any) {
            this.binary_file = buffer;
        }

        public get getTypeHint() {
            return this.type_hint;
        }

        public set setTypeHint(hint: any) {
            this.type_hint = hint;
        }
    }
}