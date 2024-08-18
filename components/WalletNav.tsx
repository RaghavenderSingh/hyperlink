"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AlignJustify, Wallet } from "lucide-react";
import { SheetDemo } from "./DrawerNav";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletNav({
  profileImage,
  signOut,
}: {
  profileImage: string;
  signOut: () => Promise<void>;
}) {
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
            <Wallet />
          </WalletMultiButton>

          <SheetDemo profileImage={profileImage} signOut={signOut} />
        </div>
      </div>
    </div>
  );
}
