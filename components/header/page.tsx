"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { FaGoogle } from "react-icons/fa6";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

interface IHeader {
  walletAddress: string;
  signIn: () => Promise<void>;
  user: any;
  signOut: () => Promise<void>;
  setWalletAddress: (val: string) => void;
}

export default function Header(props: IHeader) {
  const { signIn } = props;
  const { connected } = useWallet();
  return (
    <div>
      <header className="relative z-[9]">
        <header className="py-4 border-b md:border-none fixed top-0 left-0 right-0 z-10 bg-white md:bg-white/0">
          <div className="container mx-auto px-4 ">
            <div className="flex justify-between items-center md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto md:bg-white/90 md:backdrop:blur-sm">
              <div>
                <div className="border h-10 w-10 rounded-lg inline-flex justify-center items-center">
                  {/* <Logo className="h-8 w-8" fill="#000000" /> */}
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
                  <WalletMultiButton
                    style={{ backgroundColor: "black", height: "40px" }}
                  >
                    {!connected && <Wallet />}
                  </WalletMultiButton>
                </div>
                <div>
                  <Button
                    onClick={signIn}
                    className="pl-2 py-6 text-sm md:text-base"
                  >
                    <span className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-lg border bg-white text-black">
                        <FaGoogle />
                      </div>
                      Sign up
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </header>
    </div>
  );
}
