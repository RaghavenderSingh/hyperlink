"use client";
import React, { useEffect, useState } from "react";
import CustomTextField from "../InputComponent";
import { Button } from "../ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import BouncingDotsLoader from "../BouncingDotsLoader";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowLeft } from "lucide-react";
import { Combobox } from "../Combobox";
import { convertUsdToSol } from "@/lib/KeyStore";
import { useTransferSOL } from "@/app/hooks/useTransferSOL";

interface FundingOptionsProps {
  HyperLinkPublicKey: string | null;
  setShowExternalWallet: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ExternalWalletTab({
  HyperLinkPublicKey,
  setShowExternalWallet,
}: FundingOptionsProps) {
  const [amount, setAmount] = useState("");
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const { transferSOL, isTransferring, error } = useTransferSOL();

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

  const handleDeposit = async () => {
    if (!HyperLinkPublicKey) {
      console.error("HyperLinkPublicKey is null");
      return;
    }

    try {
      setLoading(true);
      const amtInSolString = await convertUsdToSol(amount);
      const amtInSol = parseFloat(amtInSolString);

      if (isNaN(amtInSol)) {
        throw new Error("Invalid SOL amount");
      }

      const amtInLamports = Math.round(amtInSol * LAMPORTS_PER_SOL);
      await transferSOL(HyperLinkPublicKey, amtInLamports);

      if (error) {
        console.error("Transfer error:", error);
        // Handle error, maybe show it to the user
      } else {
        console.log("Transfer successful");
        // Maybe update UI to show success
      }
    } catch (err) {
      console.error("Deposit error:", err);
      // Handle error, maybe show it to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="py-5">
        <div
          onClick={() => {
            setShowExternalWallet(false);
          }}
          className="mb-3.5 mr-auto text-gray-500 flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{" "}
          <span>Back</span>
        </div>
        <div className=" flex-col px-15 py-1">
          <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-gray-500 xs:text-[26px]">
            Deposit via connected wallet
          </h4>
          <p className="pb-3 text-sm text-left font-normal text-gray-500">
            Specify asset and amount:
          </p>
        </div>
        <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <div>
            <Combobox />
          </div>
          <div className="flex w-full items-center text-gray-500 justify-center text-left text-sm font-normal text-grey-700 xs:text-base">
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
              <CustomTextField amount={amount} setAmount={setAmount} />
            </div>
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => {
                  setShowExternalWallet(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={loading || isTransferring}
                onClick={handleDeposit}
              >
                {loading || isTransferring ? <BouncingDotsLoader /> : "Deposit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
