import React, { useState } from "react";
import { Wallet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import AssetTabs from "./AssetTabs";
import { TokenWithBalance } from "@/lib/types";
import { Session } from "next-auth";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import FundingOptions from "../AddFunds/FundingOptions";

interface WalletOverviewProps {
  totalBalanceUSD: number;
  publicKey: string | null;
  tokenBalances: TokenWithBalance[];
  session: Session | null;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  totalBalanceUSD,
  publicKey,
  tokenBalances,
  session,
}) => {
  const [activeTab, setActiveTab] = useState<string>("assets");

  const renderTabContent = () => {
    switch (activeTab) {
      case "assets":
        return (
          <AssetTabs tokenBalances={tokenBalances} publicKey={publicKey} />
        );
      case "add":
        return (
          <div>
            <FundingOptions publicKey={publicKey} />
          </div>
        );
      case "withdraw":
        return <div>Withdraw Content</div>;
      case "swap":
        return <div>Swap Content</div>;
      default:
        return null;
    }
  };

  const renderButton = (tabName: string, label: string) => (
    <Button
      variant={activeTab === tabName ? "default" : "outline"}
      className={`h-11 flex-1 mx-1 ${
        activeTab === tabName ? "bg-primary text-primary-foreground" : ""
      }`}
      onClick={() => setActiveTab(tabName)}
    >
      {label}
    </Button>
  );

  return (
    <div>
      <Card className="rounded-xl bg-white p-5 sm:p-8">
        <CardContent className="p-0">
          <h3 className="mb-6 w-full text-left text-base font-bold text-gray-800 mobile:text-[26px]">
            <div className="flex items-center justify-start gap-2 mobile:gap-4">
              <Image
                alt="user avatar"
                className="rounded-full border border-gray-200 h-[68px] w-[68px] mobile:h-[68px] mobile:w-[68px]"
                src={session?.user?.image ? session?.user?.image : ""}
                width={68}
                height={68}
              />
              <p className="text-xl font-bold text-gray-800 mobile:text-[26px]">
                Welcome back, {session?.user?.name}!
              </p>
            </div>
          </h3>
          <div className="flex w-full items-start justify-between">
            <p className="mb-0 inline-flex items-center justify-start text-left text-xs font-semibold text-gray-400 mobile:mb-3 mobile:text-sm">
              <Wallet className="mr-1 h-4 w-4" />
              HyperLink Account Assets
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
            {renderButton("assets", "Send")}
            {renderButton("add", "Add Funds")}
            {renderButton("withdraw", "Withdraw")}
            {renderButton("swap", "Swap")}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default WalletOverview;
