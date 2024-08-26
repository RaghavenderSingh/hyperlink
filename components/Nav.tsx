"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import logo from "../public/assets/images/logo.png";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { SideNavBar } from "./SideNavBar";
import { useEffect, useState } from "react";

export default function Nav() {
  const { state } = useAuth();
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (state.isAuthenticated) {
    return (
      <div className="flex justify-between gap-4 p-4 rounded-lg ">
        <Image src={logo} alt="logo" width={75} height={60} />
        <div></div>
        <div></div>
        <div>
          <div className="flex justify-between gap-2">
            {mounted && (
              <WalletMultiButton
                style={{ backgroundColor: "black", height: "40px" }}
              >
                {!connected && <Wallet />}
              </WalletMultiButton>
            )}

            <SideNavBar />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div>
        <header className="relative z-[9]">
          <header className="py-4 border-b md:border-none fixed top-0 left-0 right-0 z-10 bg-white md:bg-white/0">
            <div className="container mx-auto px-4 ">
              <div className="flex justify-between items-center md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto md:bg-white/90 md:backdrop:blur-sm">
                <div>
                  <div className="border h-10 w-10 rounded-lg inline-flex justify-center items-center">
                    <Image src={logo} alt="logo" width={75} height={60} />
                  </div>
                </div>
                <div className="hidden md:block">
                  <nav className="flex gap-8 text-sm">
                    <Link
                      className="text-black/70 hover:text-black transition"
                      href="#"
                    >
                      Products
                    </Link>
                    <Link
                      className="text-black/70 hover:text-black transition"
                      href="#"
                    >
                      API & Docs
                    </Link>
                    <Link
                      className="text-black/70 hover:text-black transition"
                      href="#"
                    >
                      FAQ
                    </Link>
                    <Link
                      className="text-black/70 hover:text-black transition"
                      href="#"
                    >
                      Company
                    </Link>
                    <Link
                      className="hidden lg:block text-black/70 hover:text-black transition"
                      href="#"
                    >
                      Blogs
                    </Link>
                  </nav>
                </div>
                <div className="flex gap-4 items-center pr-2">
                  <div>
                    {mounted && (
                      <WalletMultiButton
                        style={{ backgroundColor: "black", height: "40px" }}
                      >
                        {!connected && <Wallet />}
                      </WalletMultiButton>
                    )}
                  </div>
                  <div>
                    <LoginButton />
                  </div>
                </div>
              </div>
            </div>
          </header>
        </header>
      </div>
    </div>
  );
}
