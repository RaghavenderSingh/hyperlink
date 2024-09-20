import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiWrapper } from "@/utils/wagmi/WagmiContext";
import AppWalletProvider from "@/components/AppWalletProvider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyperlink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiWrapper>
          <AppWalletProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AppWalletProvider>
        </WagmiWrapper>
      </body>
    </html>
  );
}
