namespace PKEdit.Util {
    export namespace Devices.Frontend {

        var frontendType;

        export function setFrontendType(frontend: PKEdit.Data.Devices.FrontendDevice) {
            frontendType = frontend;
        }

        export function getFrontendType() {
            return frontendType;
        }
    }
}