





import { SERVER_BASE_URL } from "@/lib/server-url";

const TOKEN_KEY_PREFIX = "sevaconnect-jwt:";

function tokenKey(email) {
  return `${TOKEN_KEY_PREFIX}${email}`;
}

export async function ensureToken(email) {
  if (!email || typeof window === "undefined") return null;

  const cached = window.localStorage.getItem(tokenKey(email));
  if (cached) return cached;

  try {
    const res = await fetch(
      `${SERVER_BASE_URL}/jwt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.token) return null;
    window.localStorage.setItem(tokenKey(email), data.token);
    return data.token;
  } catch {
    return null;
  }
}

export async function refresh(email) {
  try {
    window.localStorage.removeItem(tokenKey(email));
  } catch {}
  return ensureToken(email);
}

export async function authHeaders(email) {
  const token = await ensureToken(email);
  return token ? { Authorization: "Bearer " + token } : {};
}

export function clearToken() {
  if (typeof window === "undefined") return;
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(TOKEN_KEY_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {}
}
