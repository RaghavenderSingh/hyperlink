"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronRight,
  CirclePlus,
  RectangleEllipsis,
  Wallet,
} from "lucide-react";
import WalletModal from "../WalletModal";
import { useAuth } from "@/context/AuthContext";

type FundingOptionsProps = {
  setStep: (value: number) => void;
};
export default function FundingOptions({ setStep }: FundingOptionsProps) {
  const [showModal, setShowModal] = useState(false);
  const { state } = useAuth();
  return (
    <div>
      <div className=" flex-col px-25 py-10">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-grey-800 xs:text-[26px]">
          Add funds
        </h4>
        <div className="flex w-full flex-col  justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          {/* <Button
            disabled
            className="flex  justify-between text-lg font-medium p-10 xs:w-full xs:text-base"
          >
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-3 rounded-full bg-grey-50  xs:p-3">
                <CirclePlus />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">With Bank/Card</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Buy more crypto via Coinbase, Meso Network, or Moonpay.
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button> */}
          <Button
            onClick={() => setStep(4)}
            className="flex  justify-between text-lg font-medium p-10 xs:w-full xs:text-base"
          >
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-3 rounded-full bg-grey-50  xs:p-3">
                <Wallet />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">From External Account/Wallet</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Deposit assets from your connected wallet .
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="flex  justify-between text-lg font-medium p-10 xs:w-full xs:text-base"
          >
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-3 rounded-full bg-grey-50  xs:p-3">
                <RectangleEllipsis />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">To This Solana Wallet Address</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Deposit assets via this Solana wallet address.
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button>
        </div>
      </div>
      {showModal && (
        <WalletModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          publicKey={state.publicKey}
        />
      )}
    </div>
  );
}
