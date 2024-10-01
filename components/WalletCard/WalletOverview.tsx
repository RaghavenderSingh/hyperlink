import React from "react";
import { Wallet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface WalletOverviewProps {
  totalBalanceUSD: number;
  publicKey: string | null;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  totalBalanceUSD,
  publicKey,
}) => (
  <div>
    <div className="flex w-full items-start justify-between">
      <p className="mb-0 inline-flex items-center justify-start text-left text-xs font-semibold text-gray-400 mobile:mb-3 mobile:text-sm">
        <Wallet className="mr-1 h-4 w-4" />
        TipLink Account Assets
      </p>
    </div>
    <div className="flex w-full items-center justify-between">
      <div>
        <h1 className="text-[40px] font-bold text-gray-900 mobile:text-6xl">
          ${totalBalanceUSD?.toFixed(2)}
          <span className="ml-2 text-2xl text-gray-600 mobile:text-4xl">
            USD
          </span>
        </h1>
      </div>
      <Button
        variant="outline"
        className="flex items-center justify-center bg-gray-50 px-2.5 py-2.5 text-gray-600 hover:bg-gray-100 active:bg-gray-200 mobile:px-3 rounded-2xl"
        onClick={() => {
          if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            toast.success("Public key copied to clipboard!");
          }
        }}
      >
        <Search className="h-5 w-5" />
        <span className="ml-1 hidden text-xs font-semibold text-gray-600 sm:inline">
          {publicKey ? "Copy Public Key" : "Loading Public Key..."}
        </span>
      </Button>
    </div>
    <div className="mt-5 flex w-full items-start justify-between overflow-hidden mobile:mt-6 mobile:gap-2 sm:items-center">
      <Button className="h-11 flex-1 mx-1">Send</Button>
      <Button variant="outline" className="h-11 flex-1 mx-1">
        Add Funds
      </Button>
      <Button variant="outline" className="h-11 flex-1 mx-1">
        Withdraw
      </Button>
      <Button variant="outline" className="h-11 flex-1 mx-1">
        Swap
      </Button>
    </div>
  </div>
);

export default WalletOverview;
