export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readStored(key: string): unknown {
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    // localStorage can throw in private mode or when disabled — fall back to defaults.
    return undefined;
  }
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted payload (e.g. truncated write) — ignore rather than crash on load.
    return undefined;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota errors or private mode — persistence is best-effort, so swallow.
  }
}
