export type DateValues = {
    fullYear: number;
    month: number;
    date: number;
    day: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    timezoneOffset: number;
    dateString: string;
    timeString: string;
    string: string;
};
export declare function extractDateValues(target: Date, timezone: string): DateValues;
export declare function localTimezone(): string;
