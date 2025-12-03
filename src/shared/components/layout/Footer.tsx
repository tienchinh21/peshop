/**
 * Footer Component
 * Footer cho trang web với các liên kết và thông tin liên hệ
 */

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t mt-auto bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">PeShop</h3>
            <p className="text-sm text-muted-foreground">
              Nền tảng mua sắm trực tuyến hiện đại và tiện lợi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/gioi-thieu"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Chính sách
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/huong-dan"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hướng dẫn
                </Link>
              </li>
              <li>
                <Link
                  href="/van-chuyen"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link
                  href="/doi-tra"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Đổi trả
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: support@peshop.com</li>
              <li>Hotline: 1900 xxxx</li>
              <li>Địa chỉ: TP. HCM, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PeShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
