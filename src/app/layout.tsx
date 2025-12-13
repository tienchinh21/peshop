import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/providers";
import { Toaster } from "@/shared/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
export const metadata: Metadata = {
  title: "PeShop - Nền tảng mua sắm trực tuyến",
  description: "Nền tảng mua sắm trực tuyến hiện đại và tiện lợi",
  keywords: ["mua sắm", "thương mại điện tử", "online shopping"],
  authors: [{
    name: "PeShop Team"
  }],
  robots: "index, follow"
};
export const viewport = {
  width: "device-width",
  initialScale: 1
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>;
}