"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoned = zoned;
const utils_1 = require("./utils");
const ZonedDate_1 = require("./ZonedDate");
function zoned(timeZone) {
    var _ZonedDate_fullYear, _ZonedDate_month, _ZonedDate_date, _ZonedDate_day, _ZonedDate_hours, _ZonedDate_minutes, _ZonedDate_seconds, _ZonedDate_milliseconds, _ZonedDate_timezoneOffset, _ZonedDate_dateString, _ZonedDate_timeString, _ZonedDate_string, _a;
    return _a = class ZonedDate extends ZonedDate_1.ZonedDate {
            static getTimezone() {
                return timeZone;
            }
            constructor(...args) {
                let time;
                if (args.length === 0) {
                    time = Date.now();
                }
                else if (args.length > 1) {
                    throw new TypeError("ZonedDate constructor does not support multiple arguments");
                }
                else if (typeof args[0] === "string") {
                    time = Date.parse(args[0]);
                }
                else {
                    time = Number(args[0]);
                }
                super(time);
                _ZonedDate_fullYear.set(this, void 0);
                _ZonedDate_month.set(this, void 0);
                _ZonedDate_date.set(this, void 0);
                _ZonedDate_day.set(this, void 0);
                _ZonedDate_hours.set(this, void 0);
                _ZonedDate_minutes.set(this, void 0);
                _ZonedDate_seconds.set(this, void 0);
                _ZonedDate_milliseconds.set(this, void 0);
                _ZonedDate_timezoneOffset.set(this, void 0);
                _ZonedDate_dateString.set(this, void 0);
                _ZonedDate_timeString.set(this, void 0);
                _ZonedDate_string.set(this, void 0);
                const values = (0, utils_1.extractDateValues)(ZonedDate_1.realDateMap.get(this), timeZone);
                __classPrivateFieldSet(this, _ZonedDate_fullYear, values.fullYear, "f");
                __classPrivateFieldSet(this, _ZonedDate_month, values.month, "f");
                __classPrivateFieldSet(this, _ZonedDate_date, values.date, "f");
                __classPrivateFieldSet(this, _ZonedDate_day, values.day, "f");
                __classPrivateFieldSet(this, _ZonedDate_hours, values.hours, "f");
                __classPrivateFieldSet(this, _ZonedDate_minutes, values.minutes, "f");
                __classPrivateFieldSet(this, _ZonedDate_seconds, values.seconds, "f");
                __classPrivateFieldSet(this, _ZonedDate_milliseconds, values.milliseconds, "f");
                __classPrivateFieldSet(this, _ZonedDate_timezoneOffset, values.timezoneOffset, "f");
                __classPrivateFieldSet(this, _ZonedDate_dateString, values.dateString, "f");
                __classPrivateFieldSet(this, _ZonedDate_timeString, values.timeString, "f");
                __classPrivateFieldSet(this, _ZonedDate_string, values.string, "f");
            }
            getFullYear() {
                return __classPrivateFieldGet(this, _ZonedDate_fullYear, "f");
            }
            getMonth() {
                return __classPrivateFieldGet(this, _ZonedDate_month, "f");
            }
            getDate() {
                return __classPrivateFieldGet(this, _ZonedDate_date, "f");
            }
            getDay() {
                return __classPrivateFieldGet(this, _ZonedDate_day, "f");
            }
            getHours() {
                return __classPrivateFieldGet(this, _ZonedDate_hours, "f");
            }
            getMinutes() {
                return __classPrivateFieldGet(this, _ZonedDate_minutes, "f");
            }
            getSeconds() {
                return __classPrivateFieldGet(this, _ZonedDate_seconds, "f");
            }
            getMilliseconds() {
                return __classPrivateFieldGet(this, _ZonedDate_milliseconds, "f");
            }
            getTimezoneOffset() {
                return __classPrivateFieldGet(this, _ZonedDate_timezoneOffset, "f");
            }
            toDateString() {
                return __classPrivateFieldGet(this, _ZonedDate_dateString, "f");
            }
            toTimeString() {
                return __classPrivateFieldGet(this, _ZonedDate_timeString, "f");
            }
            toString() {
                return __classPrivateFieldGet(this, _ZonedDate_string, "f");
            }
            toLocaleDateString(locales, options) {
                return super.toLocaleDateString(locales, { timeZone, ...options });
            }
            toLocaleTimeString(locales, options) {
                return super.toLocaleTimeString(locales, { timeZone, ...options });
            }
            toLocaleString(locales, options) {
                return super.toLocaleString(locales, { timeZone, ...options });
            }
        },
        _ZonedDate_fullYear = new WeakMap(),
        _ZonedDate_month = new WeakMap(),
        _ZonedDate_date = new WeakMap(),
        _ZonedDate_day = new WeakMap(),
        _ZonedDate_hours = new WeakMap(),
        _ZonedDate_minutes = new WeakMap(),
        _ZonedDate_seconds = new WeakMap(),
        _ZonedDate_milliseconds = new WeakMap(),
        _ZonedDate_timezoneOffset = new WeakMap(),
        _ZonedDate_dateString = new WeakMap(),
        _ZonedDate_timeString = new WeakMap(),
        _ZonedDate_string = new WeakMap(),
        _a;
}
