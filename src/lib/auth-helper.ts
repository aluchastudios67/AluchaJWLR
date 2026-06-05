export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
}

export function getAuthenticatedUser(request: Request): SessionUser | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const pairs = cookieHeader.split(";");
  let sessionCookie: string | null = null;
  
  for (const pair of pairs) {
    const parts = pair.split("=");
    const k = parts[0]?.trim();
    const v = parts.slice(1).join("=");
    if (k === "alucha-session") {
      sessionCookie = v.trim();
      break;
    }
  }
  
  if (!sessionCookie) return null;
  
  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    if (session && session.id && session.role) {
      return session as SessionUser;
    }
    return null;
  } catch {
    return null;
  }
}
