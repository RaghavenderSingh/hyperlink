import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TokenWithBalance } from "@/lib/types";
import TokenList from "./TokenList";
import ActivityTab from "./ActivityTab";

interface AssetTabsProps {
  tokenBalances: TokenWithBalance[];
  publicKey: string | null;
}

const AssetTabs: React.FC<AssetTabsProps> = ({ tokenBalances, publicKey }) => (
  <div className="rounded-b-lg px-5 pb-5 sm:px-8 sm:pb-8">
    <Tabs defaultValue="tokens" className="w-full">
      <TabsList>
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="nfts" disabled>
          NFTs
        </TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="activity">
        <div className="w-full pt-5">
          <ActivityTab publicKey={publicKey} />
        </div>
      </TabsContent>
      <TabsContent value="tokens">
        <div className="w-full pt-5">
          <TokenList tokenBalances={tokenBalances} />
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default AssetTabs;
