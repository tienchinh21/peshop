import { PublicGuard } from "@/shared/guards";

/**
 * AuthLayout - Layout cho các trang authentication
 * Chỉ dùng PublicGuard cho login/register pages
 * Nếu đã login thì redirect về home
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicGuard>{children}</PublicGuard>;
}
