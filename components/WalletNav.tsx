"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { AlignJustify, Wallet } from "lucide-react";
import { SheetDemo } from "./DrawerNav";

export default function WalletNav({
  profileImage,
  signOut,
}: {
  profileImage: string;
  signOut: () => Promise<void>;
}) {
  return (
    <div className="flex justify-between gap-4 bg-white p-4 rounded-lg ">
      {/* <Image alt="" src={"/public/assets/logo.jpg"} width={200} height={200} /> */}
      <div></div>
      <div></div>
      <div>
        <div className="flex justify-between gap-2">
          <Button>
            <Wallet />
          </Button>

          <SheetDemo profileImage={profileImage} signOut={signOut} />
        </div>
      </div>
    </div>
  );
}
