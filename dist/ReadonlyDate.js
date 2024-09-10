"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadonlyDate = void 0;
class ReadonlyDate extends Date {
    setFullYear() {
        throw new TypeError("Cannot call setFullYear on ReadonlyDate");
    }
    setMonth() {
        throw new TypeError("Cannot call setMonth on ReadonlyDate");
    }
    setDate() {
        throw new TypeError("Cannot call setDate on ReadonlyDate");
    }
    setHours() {
        throw new TypeError("Cannot call setHours on ReadonlyDate");
    }
    setMinutes() {
        throw new TypeError("Cannot call setMinutes on ReadonlyDate");
    }
    setSeconds() {
        throw new TypeError("Cannot call setSeconds on ReadonlyDate");
    }
    setMilliseconds() {
        throw new TypeError("Cannot call setMilliseconds on ReadonlyDate");
    }
    setTime() {
        throw new TypeError("Cannot call setTime on ReadonlyDate");
    }
    setUTCFullYear() {
        throw new TypeError("Cannot call setUTCFullYear on ReadonlyDate");
    }
    setUTCMonth() {
        throw new TypeError("Cannot call setUTCMonth on ReadonlyDate");
    }
    setUTCDate() {
        throw new TypeError("Cannot call setUTCDate on ReadonlyDate");
    }
    setUTCHours() {
        throw new TypeError("Cannot call setUTCHours on ReadonlyDate");
    }
    setUTCMinutes() {
        throw new TypeError("Cannot call setUTCMinutes on ReadonlyDate");
    }
    setUTCSeconds() {
        throw new TypeError("Cannot call setUTCSeconds on ReadonlyDate");
    }
    setUTCMilliseconds() {
        throw new TypeError("Cannot call setUTCMilliseconds on ReadonlyDate");
    }
}
exports.ReadonlyDate = ReadonlyDate;
