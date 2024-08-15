import { useTokens } from "@/app/hooks/useTokens";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import WalletModal from "./WalletModal";

export default function Assets({ publicKey }: { publicKey: string }) {
  const [copied, setCopied] = useState(false);
  const { tokenBalances, loading } = useTokens(publicKey);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);
  console.log("122", tokenBalances);
  if (loading) {
    return "Loading...";
  }
  return (

    <>
      <div className="text-slate-500 mt-4 ">
        <div className="flex items-center gap-2">
          <span>
            <Wallet />
          </span>{" "}
          <span>Acccount Assets</span>
        </div>
        <br />
        <div className="flex justify-between">
          <div className="flex">
            <div className="text-5xl font-bold text-black">
              ${tokenBalances?.totalBalance}
            </div>
            <div className="font-slate-500 font-bold text-3xl flex flex-col justify-end pb-0 pl-2">
              USD
            </div>
          </div>
          <div>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(publicKey);
                setCopied(true);
                setShowModal(true)
              }}
            >
              {copied ? "Copied" : "Wallet Address"}
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <WalletModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          publicKey={publicKey}
        />
      )}
    </>
  );
}
