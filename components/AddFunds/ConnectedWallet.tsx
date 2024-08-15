"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

type FundingOptionsProps = {
  setStep: (value: number) => void;
};

export default function ConnectedWallet({ setStep }: FundingOptionsProps) {
  const { publicKey, sendTransaction, wallets } = useWallet();
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  console.log("publicKey", publicKey);
  console.log("wallet", wallets);
  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (!info) {
        return;
      }
      setBalance(info.lamports / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);
  console.log("balance", balance);
  return (
    <div>
      <div className="py-5">
        <div
          onClick={() => setStep(2)}
          className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{" "}
          <span>Back</span>
        </div>
        <div className=" flex-col px-15 py-3">
          <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-grey-800 xs:text-[26px]">
            Deposit via connected wallet
          </h4>
          <p className="pb-3 text-sm font-normal text-grey-700">
            Specify asset and amount:
          </p>
        </div>
      </div>
    </div>
  );
}
