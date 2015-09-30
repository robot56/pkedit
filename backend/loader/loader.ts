namespace PKEdit.Loader {
    export namespace LoadFile {
        export function loadFile(deviceInformation: PKEdit.Data.Devices.FrontendDevice): any {

            PKEdit.Util.Devices.Frontend.setFrontendType(deviceInformation);

            var length: number = PKEdit.File.binary_file.length;

            document.getElementById("content").innerHTML = "PKEdit.Loader.LoadFile.loadFile(): Called.";
            //alert("PKEdit.Loader.LoadFile.loadFile(): Called.");
            console.debug("Length of Uint8Array: " + length);
            console.debug("Type hint: " + PKEdit.File.type_hint);
            //console.debug("Raw Data: " + PKEdit.Util.Numbers.UintArrayToString(PKEdit.File.binary_file));
            document.getElementById("content").innerHTML = PKEdit.Util.Numbers.truncateString(PKEdit.Util.Numbers.UintArrayToString(PKEdit.File.binary_file), 10000);

            if (!PKEdit.File.type_hint) {
                if (length == 232) {
                    var isEncrypted: boolean = PKEdit.Loader.FileTypes.PKX.checkIfEncrypted();
                    if (isEncrypted == true) {
                        PKEdit.File.setTypeHint = PKEdit.Loader.FileType.ENCRYPTED_EK6_BOXFILE;
                        console.info("Starting decryption!");

                        var decryptor = new Loader.FileTypes.PK6.Encrytion();
                        var decryptedFile = decryptor.decrypt();
                        console.debug("Result: " + decryptedFile);

                    } else {
                        console.log("encrypting...");
                        PKEdit.Loader.FileTypes.PKX.Decryptor.encrypt();
                        console.debug("Result: ", PKEdit.Util.Numbers.UintArrayToString(PKEdit.File.binary_file));
                    }
                } else if (length == 260) {
                    var isEncrypted: boolean = PKEdit.Loader.FileTypes.PKX.checkIfEncrypted();
                    if (isEncrypted == true) {
                        PKEdit.File.setTypeHint = PKEdit.Loader.FileType.ENCRYPTED_EK6_PARTYFILE;

                        console.info("Starting decryption!");

                        var decryptor = new Loader.FileTypes.PK6.Encrytion();
                        var decryptedFile = decryptor.decrypt();
                        console.debug("Result: " + decryptedFile);
                    }
                } else if (length == 0x65600) { // XY decrypted partial save
                    console.info("PKEdit.Loader.LoadFile: [File Type] Decrypted XY save file");
                    PKEdit.File.setTypeHint = PKEdit.Loader.FileType.DECRYPTED_XY_CYBERSAVE_FILE;
                    var newArray = new Uint8Array(new ArrayBuffer(0x100000));

                    console.log(newArray.length);

                    for (var i = 0x5400; i < 0x100000; i++) {
                        newArray[i] = PKEdit.File.binary_file[i - 0x5400] || 0;
                    }

                    PKEdit.File.binary_file = newArray;

                    /*document.getElementById("content").innerHTML = ".";
                    
                    document.getElementById("content").innerHTML = PKEdit.Util.Numbers.truncateString(PKEdit.Util.Numbers.UintArrayToString(newArray), 10000);

                    console.log(newArray.length);
                    console.log("is newArray==1MB", newArray.length == 0x100000, newArray.length - 0x100000);

                    console.debug("0x9800 box 1 name: ", PKEdit.Core.SAV.Memory.RW.getValueAt(0x9800, 16));

                    var pocket_items = Core.SAV.Memory.XYMap.POCKET_ITEMS,
                        address = pocket_items[0],
                        bits = pocket_items[1];
                    console.log("Items pocket: ", Core.SAV.Memory.RW.getValueAt(address, bits));

                    var instance = new Core.SAV.SAVObject();
                    var boxes = instance.Common.getPlayerPCBoxes();
                    alert("Done fetching boxes.");
                    console.log(boxes);
                    var printBuffer = "";
                    for (var b in boxes) {
                        var box = boxes[b];
                        for (var s in box) {
                            var slot = box[s];
                            let po: any = new PKEdit.Core.PokemonObject(slot);
                            console.log(po.getPokemonNickname(), "box", b, "slot", s);
                            po.setPokemonSuperTrainingFlags(["SuperTraining.L1.SPECIALATTACK"]);
                            po.setPokemonIndividualValues({ "attack": 31, "defense": 31 });
                            console.log("Ribbon array:", po.getPokemonSuperTrainingFlags());
                            console.log("IV array", po.getPokemonIndividualValues());
                            var e = PKEdit.Core.Export.PK6.exportToDecryptedBinary(po);

                            return;
                        }
                    }

                    return;
                    document.getElementById("content").innerHTML = printBuffer;

                    var po = new PKEdit.Core.PokemonObject(boxes[0][0]);

                    console.log(String.fromCharCode.apply(null, po.getPokemonNickname()));
                    console.log(PKEdit.Util.Numbers.UintArrayToString(po.getPokemonNickname()));
                    try {
                        po.setPokemonNationalID(0xfffff);
                    } catch (e) {
                        if (e instanceof PKEdit.OutOfBoundsException) {
                            JSON.stringify(e);
                            console.warn("PKEdit.OutOfBoundsException");
                        } else {
                            console.warn("nope");
                        }
                    }*/


                } else if (length == 0x76000) { // ORAS decrypted partial save
                    console.info("PKEdit.Loader.LoadFile: [File Type] Decrypted ORAS save file");
                    PKEdit.File.setTypeHint = PKEdit.Loader.FileType.DECRYPTED_ORAS_CYBERSAVE_FILE;
                    var newArray = new Uint8Array(new ArrayBuffer(0x100000));

                    console.log(newArray.length);

                    for (var i = 0x5400; i < 0x100000; i++) {
                        newArray[i] = PKEdit.File.binary_file[i - 0x5400] || 0;
                    }

                    PKEdit.File.binary_file = newArray;
                } else if (length == 0x100000) { // Raw save
                    throw new Error("NYI!");
                } else {
                    throw new Error("Unknown file type [" + length + "]!");
                }
            } else {
                switch (PKEdit.File.type_hint) {
                    case PKEdit.Loader.FileType.DECRYPTED_ORAS_CYBERSAVE_FILE:
                    case PKEdit.Loader.FileType.DECRYPTED_XY_CYBERSAVE_FILE:
                    case PKEdit.Loader.FileType.DECRYPTED_RAW_XY_SAVE_FILE:
                    case PKEdit.Loader.FileType.DECRYPTED_RAW_ORAS_SAVE_FILE:
                    case PKEdit.Loader.FileType.ENCRYPTED_RAW_SAVE_FILE:
                    case PKEdit.Loader.FileType.DECRYPTED_PK6_BOXFILE:
                        // ok
                    case PKEdit.Loader.FileType.ENCRYPTED_EK6_BOXFILE:
                        console.info("Starting decryption...");


                    case PKEdit.Loader.FileType.DECRYPTED_PK6_PARTYFILE:

                    case PKEdit.Loader.FileType.ENCRYPTED_EK6_PARTYFILE:
                        console.info("Starting decryption...");
                    default:
                        true;
                }
            }
            
            return true;
        }
    }
}