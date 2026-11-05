/**
 * JWT handle for protected API calls.
 * Better-auth owns sessions/cookies for identity; this token guards the
 * Express resource endpoints (create/update/delete/join/user-events).
 */

const TOKEN_KEY = "sevaconnect-jwt";

export async function ensureToken(email) {
  if (!email || typeof window === "undefined") return null;

  const cached = window.localStorage.getItem(TOKEN_KEY);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/jwt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.token) return null;
    window.localStorage.setItem(TOKEN_KEY, data.token);
    return data.token;
  } catch {
    return null;
  }
}

export async function refresh(email) {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
  return ensureToken(email);
}

export async function authHeaders(email) {
  const token = await ensureToken(email);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function clearToken() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
