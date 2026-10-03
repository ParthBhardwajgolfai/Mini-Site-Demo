/** Format a relative-to-par score the way a broadcast would. */
export function fmtToPar(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n === 0) return "E";
  return n > 0 ? `+${n}` : `${n}`;
}

export function fmtMoney(n: number, currency = "USD"): string {
  if (currency === "INR") return `₹${n.toLocaleString("en-IN")}`;
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "";
  return `${sym}${n.toLocaleString("en-US")}`;
}

export function fmtDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const mo = (d: Date) => d.toLocaleString("en-US", { month: "long" });
  if (s.getMonth() === e.getMonth()) {
    return `${mo(s)} ${s.getDate()}–${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${mo(s)} ${s.getDate()} – ${mo(e)} ${e.getDate()}, ${e.getFullYear()}`;
}

/** classnames join */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
