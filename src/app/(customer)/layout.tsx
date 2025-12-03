import { AuthGuard } from "@/shared/guards";

/**
 * CustomerLayout - Layout cho các trang customer yêu cầu authentication
 * Dùng cho: giỏ hàng, checkout, tài khoản, đơn hàng, yêu thích, ...
 * Nếu chưa login thì redirect về trang login
 */
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
