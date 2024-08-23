import { useTokens } from "@/app/hooks/useTokens";
import React, { use, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import WalletModal from "./WalletModal";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";

export default function Assets({
  publicKey,
  tokenBalances,
}: {
  publicKey: string;
  tokenBalances: any;
  loading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [walletbalance, setWalletbalance] = useState(0);

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
  useEffect(() => {
    if (tokenBalances) {
      setWalletbalance(tokenBalances.totalBalance);
    }
  }, [tokenBalances]);
  console.log("tokenBalances", tokenBalances);
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
              {tokenBalances?.totalBalance ? (
                walletbalance
              ) : (
                <Skeleton className="h-50 w-[250px]" />
              )}
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
                setShowModal(true);
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
