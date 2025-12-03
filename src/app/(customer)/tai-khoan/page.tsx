import { Metadata } from "next";
import { AccountPage } from "@/features/customer/account";

export const metadata: Metadata = {
  title: "Tài khoản - PeShop",
  description: "Quản lý tài khoản của bạn",
};

export default function AccountPageRoute() {
  return <AccountPage />;
}
