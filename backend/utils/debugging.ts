namespace PKEdit.Util {
    namespace Debugging {
        function debugMessage(message, preferedFormat = "console", platformTarget: any = "all") {
            switch (PKEdit.Util.Devices.Frontend.getFrontendType()) {
                case PKEdit.Data.Devices.FrontendDevice.DESKTOP:
                    if (!(platformTarget == "all") && !(platformTarget == PKEdit.Data.Devices.FrontendDevice.DESKTOP))
                        break;
                    if (preferedFormat == "console") {
                        console.debug(message);
                    } else if (preferedFormat == "dom") {
                        document.getElementById("content").innerHTML = message;
                    } else if (preferedFormat == "alert") {
                        alert(message);
                    }
                case PKEdit.Data.Devices.FrontendDevice.MOBILE:
                    if (preferedFormat == "dom") {
                        document.getElementById("content").innerHTML = message;
                    } else if (preferedFormat == "alert") {
                        alert(message);
                    } else {
                        // default to alerting the user
                        alert("Debug message! You can disable these in the settings.\n" + message);
                    }
                case PKEdit.Data.Devices.FrontendDevice.N3DS:
                    if (preferedFormat == "dom") {
                        document.getElementById("content").innerHTML = message;
                    } else {
                        alert(message);
                    }
                case PKEdit.Data.Devices.FrontendDevice.WINJS:
            }
        }
    }
}