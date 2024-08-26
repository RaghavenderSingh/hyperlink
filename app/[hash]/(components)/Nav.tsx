"use client";
import LoginButton from "@/components/LoginButton";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import Image from "next/image";
import logo from "../../../public/assets/images/logo.png";

export default function Nav() {
  const { connected } = useWallet();
  return (
    <div className="flex justify-between items-center">
      <div className="mt-5">
        <div className="border h-10 w-10 ml-4 rounded-lg inline-flex justify-center items-center">
          <Image src={logo} alt="logo" width={75} height={60} />
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
            <div>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
