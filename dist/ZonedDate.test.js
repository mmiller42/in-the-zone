"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const ZonedDate_1 = require("./ZonedDate");
const fixtures_json_1 = __importDefault(require("../test_data/fixtures.json"));
describe("ZonedDate", () => {
    describe.each(Object.entries(fixtures_json_1.default).map(([date, zones]) => ({ date, zones })))("renders $date", ({ date: dateString, zones }) => {
        it.each(Object.entries(zones).map(([timezone, values]) => ({ timezone, values })))("in time zone $timezone", ({ timezone, values }) => {
            const DateZ = ZonedDate_1.ZonedDate.zoned(timezone);
            const date = new DateZ(Date.parse(dateString));
            expect((0, date_fns_1.format)(date, "M/d/yyyy h:mm:ss aa")).toBe(`${values.localeDate} ${values.localeTime}`);
        });
    });
});
