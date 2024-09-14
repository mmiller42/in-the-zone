export function localTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
