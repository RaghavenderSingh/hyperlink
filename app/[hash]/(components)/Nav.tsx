"use client";

import Logo from "@/components/icons/Logo";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

export default function Nav() {
  const { connected } = useWallet();
  return (
    <div className="flex justify-between items-center">
      <div className="mt-5">
        <div className="border h-10 w-10 ml-4 rounded-lg inline-flex justify-center items-center">
          <Logo />
        </div>
      </div>
      <div>
        <div className="fixed right-4 flex items-end justify-end z-10">
          <div className="flex gap-4 items-center pr-2">
            <div>
              <WalletMultiButton
                style={{ backgroundColor: "black", height: "48px" }}
              >
                {!connected && <Wallet />}
              </WalletMultiButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
