namespace PKEdit.Core {
    export namespace SAV {

        export class SAVObject {

            // This should be undefined in most cases as some browsers are unable to cope with more than one
            // save file loaded into memory. That said, note using PKEdit.File.binary_file passes by reference.
            private sav: Uint8Array;
            private gameType: string;

            constructor(sav?, gameType?) {
                this.sav = sav;
                this.gameType = gameType;
            }

            public getGameType() {
                return this.gameType;
            }

            public Common = new CommonSAV(this.sav, this.gameType);
            //public XY = new XySAV(this.sav);
            //public ORAS = new OrasSAV(this.sav);
        }

        //var s = new SAVObject();
        //Core.SAV.ICommonSave

        function getSaveFile() {

        }

        function setSaveFile() {

        }
    }
}