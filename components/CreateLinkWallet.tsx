"use client";
import React, { useState } from "react";
import ConnectOptionsButton from "./ui/ConnectOptionsButton";
import { Card } from "./ui/card";
import CustomTextField from "./CustomTextField";
import { Button } from "./ui/button";

export default function CreateLinkWallet() {
  const [amount, setAmount] = useState("0");
  const handleSelection = (selectedOption: any) => {
    console.log("Selected option:", selectedOption);
    // Here you can handle the selected option, e.g., navigate to a login page,
    // open a wallet connection dialog, etc.
  };

  return (
    <Card className="relative w-full max-w-[580px] flex-col items-center rounded-[12px] border border-white bg-white/40 p-5 text-center mobile:p-10 sm:px-[60px] sm:py-[52px] css-0">
      <div className="mb-3 text-center mobile:space-y-2 mobile:mb-4 css-0">
        <h1 className="text-[24px] font-bold text-grey-900 mobile:text-[36px] sm:text-[40px]">
          Create HyperLink
        </h1>
        <p className="text-sm leading-snug text-grey-700 mobile:text-base">
          Send crypto & NFTs to anyone, even if they don't have a wallet. No app
          needed!
        </p>
      </div>
      <div>
        <ConnectOptionsButton onSelect={handleSelection} />
      </div>
      <div className="inline-flex w-full flex-wrap items-center justify-center gap-y-1 py-2 text-xs text-grey-700 css-0">
        Supported assets:
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full css-0"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        />
        SOL,
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full css-0"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
        />
        <span className="chakra-text css-0/">USDC, and </span>{" "}
        <span className="chakra-text flex w-max items-center justify-start css-0">
          <span className="chakra-text shrink-0 css-0">
            all Solana tokens + NFTs
          </span>
        </span>
      </div>
      <div className="pb-5">
        <CustomTextField setAmount={setAmount} />
      </div>
      <div>
        <Button className="w-full">Create Hyperlink</Button>
      </div>
    </Card>
  );
}
