import assert from "assert/strict";

const { TZ } = process.env;
const dates = process.argv.slice(2);

if (!TZ) {
  throw new Error("Missing TZ env");
}

if (dates.length === 0) {
  throw new Error("Missing ISO_DATE env");
}

if (!process.send) {
  throw new Error("Not called as a forked process");
}

assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, TZ);

const results = Object.fromEntries(
  dates.map((dateString) => {
    const time = Date.parse(dateString);
    assert.notEqual(time, NaN);
    const date = new Date(time);
    assert.equal(date.toISOString(), dateString);

    return [
      dateString,
      {
        fullYear: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
        day: date.getDay(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds(),
        timezoneOffset: date.getTimezoneOffset(),
        dateString: date.toDateString(),
        timeString: date.toTimeString(),
        string: date.toString(),
        localeDate: date.toLocaleDateString("en-US"),
        localeTime: date.toLocaleTimeString("en-US"),
      },
    ];
  })
);

process.send(results, undefined, undefined, (error) => {
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    process.exit();
  }
});
