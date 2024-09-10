"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDateValues = extractDateValues;
exports.localTimezone = localTimezone;
function extractDateValues(target, timezone) {
    const milliseconds = target.getMilliseconds();
    const values = {
        fullYear: NaN,
        month: NaN,
        date: NaN,
        day: NaN,
        hours: NaN,
        minutes: NaN,
        seconds: NaN,
        milliseconds,
        timezoneOffset: NaN,
        dateString: "Invalid Date",
        timeString: "Invalid Date",
        string: "Invalid Date",
    };
    if (Number.isNaN(values.milliseconds)) {
        return values;
    }
    const { main, extendedTz } = getFormatters(timezone);
    let weekdayName;
    let monthName;
    let offsetDescription;
    for (const { type, value } of main.formatToParts(target)) {
        switch (type) {
            case "year":
                values.fullYear = Number(value);
                break;
            case "month":
                values.month = Number(value) - 1;
                monthName = {
                    0: "Jan",
                    1: "Feb",
                    2: "Mar",
                    3: "Apr",
                    4: "May",
                    5: "Jun",
                    6: "Jul",
                    7: "Aug",
                    8: "Sep",
                    9: "Oct",
                    10: "Nov",
                    11: "Dec",
                }[values.month];
                break;
            case "day":
                values.date = Number(value);
                break;
            case "weekday":
                values.day =
                    {
                        Sun: 0,
                        Mon: 1,
                        Tue: 2,
                        Wed: 3,
                        Thu: 4,
                        Fri: 5,
                        Sat: 6,
                    }[value] ?? NaN;
                weekdayName = value;
                break;
            case "hour": {
                let hours = Number(value);
                hours = hours === 24 ? 0 : hours;
                values.hours = hours;
                break;
            }
            case "minute":
                values.minutes = Number(value);
                break;
            case "second":
                values.seconds = Number(value);
                break;
            case "timeZoneName": {
                const res = getOffsetFromLongName(value);
                values.timezoneOffset = res?.value ?? NaN;
                offsetDescription = res?.string ?? undefined;
                break;
            }
        }
    }
    const classicTzName = extendedTz
        .formatToParts(target)
        .find(({ type }) => type === "timeZoneName")?.value;
    for (const [key, value] of Object.entries({
        ...values,
        weekdayName,
        monthName,
        offsetDescription,
        classicTzName,
    })) {
        if (value === undefined || Number.isNaN(value)) {
            throw new Error(`Failed to extract ${key} from DateTimeFormatPart, got: ${value}`);
        }
    }
    values.dateString = [
        weekdayName,
        monthName,
        zpad(values.date),
        zpad(values.fullYear, 4),
    ].join(" ");
    values.timeString = [
        zpad(values.hours),
        zpad(values.minutes),
        zpad(values.seconds),
        offsetDescription,
        `(${classicTzName})`,
    ].join(" ");
    values.string = [values.dateString, values.timeString].join(" ");
    return values;
}
const formatters = new Map();
function getFormatters(timeZone) {
    if (formatters.has(timeZone)) {
        return formatters.get(timeZone);
    }
    const main = new Intl.DateTimeFormat("en-US", {
        calendar: "gregory",
        numberingSystem: "latn",
        hour12: false,
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone,
        timeZoneName: "longOffset",
    });
    const extendedTz = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "long",
    });
    formatters.set(timeZone, { main, extendedTz });
    return { main, extendedTz };
}
function getOffsetFromLongName(longName) {
    if (!longName) {
        return null;
    }
    if (longName === "GMT") {
        return { value: 0, string: "GMT" };
    }
    const match = longName.match(/^GMT([+-])(\d{2}):(\d{2})$/);
    if (!match) {
        return null;
    }
    const [, offsetSign, offsetH, offsetM] = match;
    const value = (Number(offsetH) + 60 * Number(offsetM)) * (offsetSign === "+" ? -1 : 1);
    return { value, string: `GMT${offsetSign}${offsetH}${offsetM}` };
}
function zpad(n, length = 2) {
    const sign = n < 0 ? "-" : "";
    const padded = `${Math.abs(n)}`.padStart(length, "0");
    return `${sign}${padded}`;
}
function localTimezone() {
    return Intl.DateTimeFormat("en-US").resolvedOptions().timeZone;
}
