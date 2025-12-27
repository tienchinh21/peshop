import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to decode JWT payload (without verification - just for reading claims)
function decodeJwtPayload(token: string): { authorities?: string[]; exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

// Helper to get user data from cookie
function getUserDataFromCookie(request: NextRequest): { roles?: string[] } | null {
  try {
    const userDataCookie = request.cookies.get('user_data')?.value;
    if (!userDataCookie) return null;
    return JSON.parse(decodeURIComponent(userDataCookie));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Protected paths that require authentication
  const customerProtectedPaths = ['/gio-hang', '/thanh-toan', '/don-hang', '/tai-khoan', '/yeu-thich'];
  const isCustomerProtected = customerProtectedPaths.some(path => pathname.startsWith(path));

  // Shop paths that require Shop role (except registration page)
  const isShopPath = pathname.startsWith('/shop') && pathname !== '/shop/dang-ky';
  const isShopRegistration = pathname === '/shop/dang-ky';

  // Check if path requires authentication
  if ((isCustomerProtected || isShopPath || isShopRegistration) && !token) {
    return NextResponse.redirect(new URL('/xac-thuc', request.url));
  }

  // For shop paths (except registration), check if user has Shop role
  if (isShopPath && token) {
    // Try to get roles from user_data cookie first (faster)
    const userData = getUserDataFromCookie(request);
    let hasShopRole = userData?.roles?.includes('Shop') || false;
    
    // If no user_data cookie, try to decode from JWT
    if (!hasShopRole) {
      const payload = decodeJwtPayload(token);
      hasShopRole = payload?.authorities?.includes('Shop') || false;
    }
    
    if (!hasShopRole) {
      // Redirect to shop registration if user doesn't have Shop role
      return NextResponse.redirect(new URL('/shop/dang-ky', request.url));
    }
  }

  // Add token to request headers for server components
  if (token) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-auth-token', token);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
