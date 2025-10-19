import { Metadata } from "next";
import RegisterPageComponent from "@/views/pages/xac-thuc/register";

export const metadata: Metadata = {
  title: "Đăng ký - PeShop",
  description: "Đăng ký tài khoản PeShop",
};

export default function RegisterPage() {
  return <RegisterPageComponent />;
}
