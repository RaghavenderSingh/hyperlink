"use client";
import React from "react";
import { Wallet } from "lucide-react";
import { SheetDemo } from "./DrawerNav";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import logo from "../public/assets/images/logo.png";
import { useAuth } from "@/context/AuthContext";

export default function WalletNav({
  profileImage,
  signOut,
  mail,
  name,
}: {
  profileImage: string;
  mail: string;
  name: string;
  signOut: () => Promise<void>;
}) {
  const { connected } = useWallet();
  const { state } = useAuth();
  return (
    <div className="flex justify-between gap-4 p-4 rounded-lg ">
      <Image src={logo} alt="logo" width={75} height={60} />
      <div></div>
      <div></div>
      <div>
        <div className="flex justify-between gap-2">
          <WalletMultiButton
            style={{ backgroundColor: "black", height: "40px" }}
          >
            {!connected && <Wallet />}
          </WalletMultiButton>

          <SheetDemo />
        </div>
      </div>
    </div>
  );
}
