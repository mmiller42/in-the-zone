export class ReadonlyDate extends Date {
  setFullYear(): never {
    throw new TypeError("Cannot call setFullYear on ReadonlyDate");
  }

  setMonth(): never {
    throw new TypeError("Cannot call setMonth on ReadonlyDate");
  }

  setDate(): never {
    throw new TypeError("Cannot call setDate on ReadonlyDate");
  }

  setHours(): never {
    throw new TypeError("Cannot call setHours on ReadonlyDate");
  }

  setMinutes(): never {
    throw new TypeError("Cannot call setMinutes on ReadonlyDate");
  }

  setSeconds(): never {
    throw new TypeError("Cannot call setSeconds on ReadonlyDate");
  }

  setMilliseconds(): never {
    throw new TypeError("Cannot call setMilliseconds on ReadonlyDate");
  }

  setTime(): never {
    throw new TypeError("Cannot call setTime on ReadonlyDate");
  }

  setUTCFullYear(): never {
    throw new TypeError("Cannot call setUTCFullYear on ReadonlyDate");
  }

  setUTCMonth(): never {
    throw new TypeError("Cannot call setUTCMonth on ReadonlyDate");
  }

  setUTCDate(): never {
    throw new TypeError("Cannot call setUTCDate on ReadonlyDate");
  }

  setUTCHours(): never {
    throw new TypeError("Cannot call setUTCHours on ReadonlyDate");
  }

  setUTCMinutes(): never {
    throw new TypeError("Cannot call setUTCMinutes on ReadonlyDate");
  }

  setUTCSeconds(): never {
    throw new TypeError("Cannot call setUTCSeconds on ReadonlyDate");
  }

  setUTCMilliseconds(): never {
    throw new TypeError("Cannot call setUTCMilliseconds on ReadonlyDate");
  }
}
