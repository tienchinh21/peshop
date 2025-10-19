import { PublicGuard } from "@/components/guards";

/**
 * PublicLayout - Layout cho các trang authentication
 * Chỉ dùng PublicGuard cho login/register pages
 * Nếu đã login thì redirect về home
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicGuard>{children}</PublicGuard>;
}
