import {
  ChevronRight,
  RectangleEllipsis,
  TextCursorInput,
  Wallet2,
  Wallet2Icon,
} from "lucide-react";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";
type FundingOptionsProps = {
  setStep: (value: number) => void;
};
export default function WithdrawOptions({ setStep }: FundingOptionsProps) {
  const { wallet } = useWallet();
  console.log("wallet", wallet?.adapter.name, wallet?.adapter?.icon);
  return (
    <div>
      <div className=" flex-col px-25 py-10">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-grey-800 xs:text-[26px]">
          Withdraw
        </h4>
        <p className="mb-4 text-left text-sm font-normal text-grey-700 xs:text-base">
          Select destination for withdrawal:
        </p>
        <div className="flex w-full flex-col  justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <Button
            onClick={() => setStep(2)}
            className="flex  justify-between text-lg font-medium p-10 xs:w-full xs:text-base"
          >
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-3 rounded-full bg-grey-50  xs:p-3">
                {wallet?.adapter?.icon ? (
                  <img
                    src={wallet?.adapter?.icon}
                    alt="wallet icon"
                    className="w-6 h-6"
                  />
                ) : (
                  <Wallet2Icon />
                )}
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">To Connected Wallet</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Assets will be sent to the{" "}
                  <span className=" font-bold">{wallet?.adapter.name}</span>{" "}
                  wallet.
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button>
          <Button className="flex  justify-between text-lg font-medium p-10 xs:w-full xs:text-base">
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-3 rounded-full bg-grey-50  xs:p-3">
                <TextCursorInput />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">To Solana Wallet Address</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Assets will be sent to a Solana wallet address you specify.
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
