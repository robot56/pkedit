var PKView;
(function (PKView) {
    var Core;
    (function (Core) {
        var Bindings;
        (function (Bindings) {
            function onPokemonChangeEvent() {
            }
        })(Bindings = Core.Bindings || (Core.Bindings = {}));
    })(Core = PKView.Core || (PKView.Core = {}));
})(PKView || (PKView = {}));
///<reference path='..\..\..\..\app.d.ts'/>
///<reference path='..\..\jquery.d.ts'/>
String.prototype.format = function () {
    var str = this.toString();
    if (!arguments.length)
        return str;
    var args = typeof arguments[0];
    var args = (("string" == args || "number" == args) ? arguments : arguments[0]);
    for (var arg in args)
        str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
    return str;
};
function makeBinaryArray(fileLocation, callback) {
    alert("makeBinaryArray(): Called.");
    var oReq = new XMLHttpRequest();
    oReq.open("GET", fileLocation, true);
    oReq.responseType = "arraybuffer";
    alert("makeBinaryArray(): Starting onload.");
    oReq.onload = function (oEvent) {
        //alert("makeBinaryArray(): triggered onload.");
        var arrayBuffer = oReq.response; // Note: not oReq.responseText
        //alert(arrayBuffer.length + JSON.stringify(oEvent));
        if (arrayBuffer) {
            var byteArray = new Uint8Array(arrayBuffer);
            //alert("makeBinaryArray(): created uintarray!");
            for (var i = 0; i < byteArray.byteLength; i++) {
            }
            //alert("makeBinaryArray(): Calling callback.");
            callback(byteArray);
            //console.debug(byteArray.toString());
            console.log("File size is: " + byteArray.length);
        }
    };
    oReq.send(null);
}
function promptToDownload(uint8arr, fileName) {
    if (fileName === void 0) { fileName = "pkedit.bin"; }
    var p = confirm("Save the file " + fileName + "?");
    if (!p)
        return;
    var saveByteArray = (function () {
        console.debug("Initiated saveByteArray");
        var a = document.createElement("a");
        console.log(a);
        document.body.appendChild(a);
        a.style = "display: none";
        return function (data, name) {
            console.debug("set octet-stream");
            var blob = new Blob(data, { type: "octet/stream" }), url = window["URL"].createObjectURL(blob);
            a.href = url;
            a.download = name;
            a.click();
            window["URL"].revokeObjectURL(url);
        };
    }());
    console.warn(uint8arr.length);
    saveByteArray([uint8arr], fileName);
    throw new Error();
}
makeBinaryArray("/assets/main-oras-9_29_2015.sav6.bin", function (binary_array) {
    console.log("loaded file!");
    alert("loaded file.");
    var SaveFile = new PKEdit.PKObject(binary_array /*, PKEdit.Loader.FileType.DECRYPTED_XY_CYBERSAVE_FILE*/);
    PKEdit.Loader.LoadFile.loadFile(PKEdit.Data.Devices.FrontendDevice.DESKTOP);
    var saveObject = new PKEdit.Core.SAV.SAVObject();
    var pcboxes = saveObject.Common.getPlayerPCBoxes();
    $("#content").html("<hr />");
    $("#content").append("<ol>");
    for (var boxes in pcboxes) {
        var box = pcboxes[boxes];
        for (var slots in box) {
            var slot = box[slots];
            var po = new PKEdit.Core.PokemonObject(slot);
            console.log(po.getPokemonNickname(), "box", boxes, "slot", slots);
            po.setPokemonSuperTrainingFlags(["SuperTraining.L1.SPECIALATTACK"]);
            po.setPokemonIndividualValues({ "attack": 31, "defense": 31 });
            console.log("Ribbon array:", po.getPokemonSuperTrainingFlags());
            console.log("IV array", po.getPokemonIndividualValues());
            $("#content ol").append("\n            <li>\n                <b>Pokemon</b>: {nickname} <br />\n                <b>Pokemon EVs</b>: {evs} <br />\n                <b>Pokemon IVs</b>: {ivs} <br />\n                <b>OT Nickname</b>: {otname} <br />\n                <b>OT Sex</b>: {otgender} <br />\n                <b>Egg?</b>: {isEgg} <br />\n                <b>Fateful?</b>: {isFateful} <br />\n                <b>Genderless?</b>: {isGenderless} <br />\n                <b>Nicknamed?</b>: {isNicknamed} <br />\n                <b>Form</b>: {alternateform} <br />\n                <b>Amie Enjoyment</b>: {enjoyment} <br />\n                <b>Contest stats</b>: {contest_stats} <br />\n                <b>Current handler</b>: {currenthandler} <br />\n                <b>Encountered on level</b>: {encounteredonlvl} <br />\n                <b>3DS Region</b>: {n3dsregion} <br />\n            </li>\n            ".format({
                nickname: po.getPokemonNickname(),
                evs: JSON.stringify(po.getPokemonEffortValues()),
                ivs: po.getPokemonIndividualValues().toString(),
                otname: po.getPokemonOrignalTrainerNickname(),
                otgender: (po.getPokemonOriginalTrainerGender() == 0 ? "male" : "female"),
                isEgg: po.getIsPokemonEgg().toString(),
                isFateful: po.getIsPokemonFateFulEncounter().toString(),
                isGenderless: po.getIsPokemonGenderless().toString(),
                isNicknamed: po.getIsPokemonNicknamed().toString(),
                alternateForm: po.getPokemonAlternateForm().toString(),
                enjoyment: po.getPokemonAmieEnjoyment().toString(),
                contest_stats: JSON.stringify(po.getPokemonContestStats()),
                currenthandler: po.getPokemonCurrentHandler().toString(),
                encounteredonlvl: po.getPokemonEncounterLevel().toString(),
                n3dsregion: po.getPokemonFrom3DSRegionID().toString()
            }));
            var e = PKEdit.Core.Export.PK6.exportToDecryptedBinary(po);
            var u = PKEdit.Core.Export.PK6.exportToEncryptedBinary(po);
        }
    }
});
//# sourceMappingURL=frontend.js.map