import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight, Wallet } from "lucide-react";
import React from "react";
import coinbase from "/public/assets/images/coinbase.svg";
import Image from "next/image";
type FundingOptionsProps = {
  setStep: (value: number) => void;
};

export default function ExternalAccount({ setStep }: FundingOptionsProps) {
  return (
    <div className="py-5">
      <div
        onClick={() => setStep(0)}
        className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
      >
        <span>
          <ArrowLeft className="w-4 h-4" />
        </span>{" "}
        <span>Back</span>
      </div>
      <div className=" flex-col px-15 py-3">
        <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-grey-800 xs:text-[26px]">
          Deposit from External Account/Wallet
        </h4>
        <p className="pb-3 text-sm font-normal text-grey-700">
          Deposit assets from your connected wallet
        </p>
        <div className="flex w-full flex-col  justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <Button
            onClick={() => setStep(5)}
            className="flex  justify-between text-base font-medium p-10 xs:w-full xs:text-base"
          >
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50  xs:p-3">
                <Wallet />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">External Wallet</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Deposit assets from your connected wallet
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button>
          {/* <Button className="flex  justify-between text-base font-medium p-10 xs:w-full xs:text-base">
            <div className="flex items-start  justify-start gap-[10px] ">
              <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50  xs:p-3">
                <Image src={coinbase.src} alt="" width={25} height={25} />
              </div>
              <div className="flex-col items-start  justify-start rounded-full bg-grey-50  xs:p-3">
                <div className="text-left">Coinbase Account</div>

                <div className="text-left text-xs font-normal text-grey-500 ">
                  Deposit from your Coinbase account’s available assets.
                </div>
              </div>
            </div>
            <div>
              <ChevronRight />
            </div>
          </Button> */}
        </div>
      </div>
    </div>
  );
}
