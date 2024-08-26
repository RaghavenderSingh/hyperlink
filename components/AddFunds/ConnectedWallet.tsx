"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Combobox } from "../Select";
import { Input } from "../ui/input";
import CustomTextField from "../CustomTextField";
import { Button } from "../ui/button";
import { useTransferSOL } from "@/app/hooks/useTransferSOL";
import { getPublicKey } from "@/lib/KeyStore";
import BouncingDotsLoader from "../BouncingDotsLoader";

type FundingOptionsProps = {
  setStep: (value: number) => void;
  handleDeposit: () => void;
  setAddAmount: (value: string) => void;
  loading: boolean;
  amount: string;
};

export default function ConnectedWallet({
  setStep,
  handleDeposit,
  setAddAmount,
  loading,
  amount,
}: FundingOptionsProps) {
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
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

  return (
    <div>
      <div className="py-5">
        <div
          onClick={() => setStep(3)}
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
        <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <div>
            <Combobox />
          </div>
          <div className="flex w-full items-center justify-center text-left text-sm font-normal text-grey-700 xs:text-base">
            <span className="text-sm font-semibold text-grey-700 ">
              Your available SOL:{" "}
            </span>
            <span className="text-sm font-bold text-grey-700">
              {balance ? balance.toFixed(2) : "0.00"}
              {" SOL"}
            </span>
          </div>
          <div>
            <div>
              <CustomTextField setAmount={setAddAmount} amount={amount} />
            </div>
            <div className="flex justify-between mt-4">
              <Button onClick={() => setStep(0)}>Cancel</Button>
              <Button disabled={loading} onClick={handleDeposit}>
                {loading ? <BouncingDotsLoader /> : "Deposit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
