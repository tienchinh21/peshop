import { Metadata } from "next";
import LoginPageComponent from "@/views/pages/xac-thuc/page";

export const metadata: Metadata = {
  title: "Đăng nhập - PeShop",
  description: "Đăng nhập vào tài khoản PeShop",
};

export default function LoginPage() {
  return <LoginPageComponent />;
}
