import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedPaths = ['/gio-hang', '/thanh-toan', '/don-hang', '/tai-khoan', '/yeu-thich', '/shop'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/xac-thuc', request.url));
  }

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
