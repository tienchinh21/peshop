import { AuthGuard } from "@/components/guards";

/**
 * ProtectedLayout - Layout cho các trang yêu cầu authentication
 * Dùng cho: giỏ hàng, checkout, tài khoản, đơn hàng, ...
 * Nếu chưa login thì redirect về trang login
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
