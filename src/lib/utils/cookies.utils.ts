const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;
export const setAuthTokenCookie = (token: string) => {
  if (typeof window === "undefined") {
    console.warn("setAuthTokenCookie can only be called on client-side");
    return;
  }
  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_MAX_AGE * 1000);
  const isSecure = window.location.protocol === "https:";
  // Chỉ thêm Secure flag khi chạy HTTPS
  const securePart = isSecure ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${securePart}`;
};
export const getAuthTokenCookie = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const name = COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};
export const removeAuthTokenCookie = () => {
  if (typeof window === "undefined") {
    return;
  }
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
export const getAuthTokenFromServerCookies = async (): Promise<string | null> => {
  try {
    const {
      cookies
    } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
  } catch (error) {
    console.error("Error reading auth token from server cookies:", error);
    return null;
  }
};