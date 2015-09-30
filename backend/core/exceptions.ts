namespace PKEdit {

    export class Exception {
        constructor() {
            Error.apply(this, arguments);
        }
    }

    Exception.prototype = new Error();

    export class OutOfBoundsException extends Exception {
        constructor(public func: any, public message: string) {
            super();
        }
    }
}