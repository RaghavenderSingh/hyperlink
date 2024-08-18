"use client";
import React from "react";
import { Wallet } from "lucide-react";
import { SheetDemo } from "./DrawerNav";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletNav({
  profileImage,
  signOut,
}: {
  profileImage: string;
  signOut: () => Promise<void>;
}) {
  const { connected } = useWallet();
  return (
    <div className="flex justify-between gap-4 p-4 rounded-lg ">
      {/* <Image alt="" src={"/public/assets/logo.jpg"} width={200} height={200} /> */}
      <div></div>
      <div></div>
      <div>
        <div className="flex justify-between gap-2">
          <WalletMultiButton
            style={{ backgroundColor: "black", height: "40px" }}
          >
            {!connected && <Wallet />}
          </WalletMultiButton>

          <SheetDemo profileImage={profileImage} signOut={signOut} />
        </div>
      </div>
    </div>
  );
}
