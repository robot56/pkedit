namespace PKEdit.Util {
    export namespace Numbers {
        declare var escape;

        export function pad(hex, padding = undefined) {
            var padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

            while (hex.length < padding) {
                hex = "0" + hex;
            }
            return hex;
        }

        export function UintArrayToString(a) {
            var buffer = "";
            for (var i in a) {
                var f = a[i];
                buffer += pad(f.toString(16), 2) + "-";
            }
            return buffer;
        }

        export function truncateString(strings, truncate) {
            return strings;
            return strings.substring(0, length);
        }

        export function toFloat32(value) {
            var bytes = 0;
            switch (value) {
                case Number.POSITIVE_INFINITY: bytes = 0x7F800000; break;
                case Number.NEGATIVE_INFINITY: bytes = 0xFF800000; break;
                case +0.0: bytes = 0x40000000; break;
                case -0.0: bytes = 0xC0000000; break;
                default:
                    if (isNaN(value)) { bytes = 0x7FC00000; break; }

                    if (value <= -0.0) {
                        bytes = 0x80000000;
                        value = -value;
                    }

                    var exponent = Math.floor(Math.log(value) / Math.log(2));
                    var significand = ((value / Math.pow(2, exponent)) * 0x00800000) | 0;

                    exponent += 127;
                    if (exponent >= 0xFF) {
                        exponent = 0xFF;
                        significand = 0;
                    } else if (exponent < 0) exponent = 0;

                    bytes = bytes | (exponent << 23);
                    bytes = bytes | (significand & ~(-1 << 23));
                    break;
            }
            return bytes;
        };

        function bytesFromHex(str, pad) {
            if (str.length % 2) str = "0" + str;
            var bytes = str.match(/../g).map(function (s) {
                return parseInt(s, 16);
            });
            if (pad) for (var i = bytes.length; i < pad; ++i) bytes.unshift(0);
            return bytes;
        }
    }
}