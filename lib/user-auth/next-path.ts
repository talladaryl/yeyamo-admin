export function validateNextPath(value: string | null | undefined, fallback = "/") {
  if (!value || value.length > 2048) return fallback;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }
  if (!decoded.startsWith("/") || decoded.startsWith("//") || decoded.includes("\\")) return fallback;
  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded.slice(1)) || /[\u0000-\u001f\u007f]/.test(decoded)) return fallback;
  try {
    const parsed = new URL(decoded, "https://yeyamo.local");
    return parsed.origin === "https://yeyamo.local" ? `${parsed.pathname}${parsed.search}${parsed.hash}` : fallback;
  } catch {
    return fallback;
  }
}
