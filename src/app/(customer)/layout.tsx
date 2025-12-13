import { AuthGuard } from "@/shared/guards";
export default function CustomerLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}