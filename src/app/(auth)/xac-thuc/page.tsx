import { Metadata } from "next";
import { LoginPage as LoginPageComponent } from "@/features/customer/auth";
export const metadata: Metadata = {
  title: "Đăng nhập - PeShop",
  description: "Đăng nhập vào tài khoản PeShop"
};
export default function LoginPage() {
  return <LoginPageComponent />;
}