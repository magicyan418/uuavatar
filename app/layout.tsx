import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UU Avatar · 头像工作室",
  description: "输入一个名字，生成一个独一无二的 UU Avatar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
