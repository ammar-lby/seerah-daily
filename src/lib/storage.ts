const STORAGE_PREFIX = 'seerah-daily';

type Json = unknown;

export function storageKey(key: string): string {
  return `${STORAGE_PREFIX}:${key}`;
}

export function readJson<T = Json>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T = Json>(key: string, value: T): void {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // ignore quota errors for MVP
  }
}

export function readString(key: string, fallback: string): string {
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(key: string, value: string): void {
  try {
    localStorage.setItem(storageKey(key), value);
  } catch {
    // ignore
  }
}


