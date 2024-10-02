import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: "HyperLink",
  description: "The world's simplest wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}  h-[100vh]`}>
        <NextTopLoader color="#333" />
        {children}
      </body>
    </html>
  );
}
