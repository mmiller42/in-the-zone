const unboundSym: unique symbol = Symbol();

function isUnbound(target: object): boolean {
  return Reflect.get(target, unboundSym) === true;
}

export function unbindZonedDate(target: Date): Date {
  if (isUnbound(target)) {
    return target;
  }

  const dateMethods = Reflect.ownKeys(Date.prototype).reduce((acc, name) => {
    acc[name] = Date.prototype[name as keyof Date].bind(target);
    return acc;
  }, Object.create(null) as Record<string | symbol, Date[keyof Date]>);

  return new Proxy(target, {
    get: (target, p, receiver) => {
      if (p === unboundSym) {
        return true;
      } else if (dateMethods[p]) {
        return dateMethods[p];
      } else {
        return Reflect.get(target, p, receiver);
      }
    },
  });
}
