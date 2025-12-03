import { Metadata } from "next";
import { RegisterPage as RegisterPageComponent } from "@/features/customer/auth";

export const metadata: Metadata = {
  title: "Đăng ký - PeShop",
  description: "Đăng ký tài khoản PeShop",
};

export default function RegisterPage() {
  return <RegisterPageComponent />;
}
