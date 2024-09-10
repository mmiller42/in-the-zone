import { writeFile } from "fs/promises";
import { fork } from "child_process";
import { resolve } from "path";

const testDates = {
  "America/Denver": [
    "2024-01-01T17:00:00-07:00", // 5pm MST (standard time in winter)
    "2024-03-10T01:59:59-07:00", // Just before DST starts
    "2024-03-10T03:00:00-06:00", // 3am MDT (right after DST starts, clocks jump forward)
    "2024-06-15T07:00:00-06:00", // 7am MDT (summer time, in daylight saving)
    "2024-11-03T01:59:59-06:00", // Just before DST ends
    "2024-11-03T01:00:00-07:00", // 1am MST (right after DST ends, clocks fall back)
    "2024-12-15T15:17:22-07:00", // 3:17pm MST (standard time in winter)
  ],
  "Europe/London": [
    "2024-01-01T12:00:00+00:00", // 12pm GMT (winter standard time)
    "2024-03-31T00:59:59+00:00", // Just before DST starts
    "2024-03-31T02:00:00+01:00", // 2am BST (right after DST starts, clocks jump forward)
    "2024-06-15T15:00:00+01:00", // 3pm BST (summer time)
    "2024-10-27T00:59:59+01:00", // Just before DST ends
    "2024-10-27T01:00:00+00:00", // 1am GMT (right after DST ends, clocks fall back)
  ],
  "Australia/Lord_Howe": [
    "2019-01-01T12:00:00+11:00", // 12pm LHST (summer time, pre-2020)
    "2019-04-07T01:29:59+11:00", // Just before DST ends (pre-2020)
    "2019-04-07T01:00:00+10:30", // 1am LHST (clocks fall back 30 minutes)
    "2019-10-06T01:59:59+10:30", // Just before DST starts (pre-2020)
    "2019-10-06T02:00:00+11:00", // 2am LHST (clocks spring forward 30 minutes)
    "2024-06-15T12:00:00+10:30", // 12pm LHST (no DST currently observed)
  ],
  "America/New_York": [
    "2024-01-01T12:00:00-05:00", // 12pm EST (winter standard time)
    "2024-03-10T01:59:59-05:00", // Just before DST starts
    "2024-03-10T03:00:00-04:00", // 3am EDT (right after DST starts, clocks jump forward)
    "2024-06-15T12:00:00-04:00", // 12pm EDT (summer time)
    "2024-11-03T01:59:59-04:00", // Just before DST ends
    "2024-11-03T01:00:00-05:00", // 1am EST (right after DST ends, clocks fall back)
  ],
  "Pacific/Auckland": [
    "2024-01-01T12:00:00+13:00", // 12pm NZDT (summer time)
    "2024-04-07T02:59:59+13:00", // Just before DST ends
    "2024-04-07T02:00:00+12:00", // 2am NZST (right after DST ends, clocks fall back)
    "2024-09-29T01:59:59+12:00", // Just before DST starts
    "2024-09-29T03:00:00+13:00", // 3am NZDT (right after DST starts, clocks jump forward)
    "2024-12-15T12:00:00+13:00", // 12pm NZDT (summer time)
  ],
  "America/Phoenix": [
    "2024-01-01T12:00:00-07:00", // 12pm MST (standard time, no DST)
    "2024-06-15T15:00:00-07:00", // 3pm MST (standard time, no DST)
    "2024-11-03T01:00:00-07:00", // 1am MST (no DST change)
    "2024-12-31T23:59:59-07:00", // 11:59pm MST (standard time, no DST)
    "2024-03-10T02:00:00-07:00", // 2am MST (no DST change, same time zone offset year-round)
    "2024-11-03T02:00:00-07:00", // 2am MST (no DST change)
  ],
  "Asia/Tokyo": [
    "2024-01-01T12:00:00+09:00", // 12pm JST (standard time, no DST)
    "2024-06-15T15:00:00+09:00", // 3pm JST (standard time, no DST)
    "2024-11-03T01:00:00+09:00", // 1am JST (standard time, no DST)
    "2024-12-31T23:59:59+09:00", // 11:59pm JST (standard time, no DST)
    "2024-03-10T02:00:00+09:00", // 2am JST (no DST change)
    "2024-11-03T02:00:00+09:00", // 2am JST (no DST change)
  ],
  "Africa/Nairobi": [
    "2024-01-01T12:00:00+03:00", // 12pm EAT (standard time, no DST)
    "2024-06-15T15:00:00+03:00", // 3pm EAT (standard time, no DST)
    "2024-11-03T01:00:00+03:00", // 1am EAT (standard time, no DST)
    "2024-12-31T23:59:59+03:00", // 11:59pm EAT (standard time, no DST)
    "2024-03-10T02:00:00+03:00", // 2am EAT (no DST change)
    "2024-11-03T02:00:00+03:00", // 2am EAT (no DST change)
  ],
};

const dataScript = resolve(import.meta.dirname, "getData.mjs");

async function execDataScript(TZ, dates) {
  return new Promise((resolve) => {
    const child = fork(dataScript, dates, {
      env: { TZ },
    });

    child.on("message", (result) => {
      resolve(result);
    });
  });
}

async function main() {
  const isoDates = Object.values(testDates).reduce((acc, strings) => {
    for (const string of strings) {
      const time = Date.parse(string);
      if (Number.isNaN(time)) {
        throw new Error(`invalid: ${string}`);
      }
      acc[string] = new Date(time).toISOString();
    }
    return acc;
  }, {});
  const uniqueDates = Array.from(new Set(Object.values(isoDates)));

  const results = {};
  for (const TZ of Object.keys(testDates)) {
    const rows = await execDataScript(TZ, uniqueDates);

    for (const [isoDate, result] of Object.entries(rows)) {
      results[isoDate] ??= {};
      results[isoDate][TZ] = result;
    }
  }

  await writeFile(
    resolve(import.meta.dirname, "fixtures.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );
}

main().catch((e) => console.error(e));
