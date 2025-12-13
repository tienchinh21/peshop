import { PublicGuard } from "@/shared/guards";
export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <PublicGuard>{children}</PublicGuard>;
}