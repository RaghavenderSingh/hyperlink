import React from "react";
import Assets from "./Assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Swap } from "./swap";
import { useTokens } from "@/app/hooks/useTokens";
import { TokenList } from "./TokenList";
import AddFunds from "./AddFunds";

export default function Wallet({
  name,
  profileImage,
  publicKey,
}: {
  name: string;
  profileImage: string;
  publicKey: string;
}) {
  return (
    <div>
      <div className="flex justify-center pt-8">
        <div className="max-w-4xl bg-white rounded shadow w-full p-12">
          <Greeting image={profileImage} name={name ?? ""} />
          <Assets publicKey={publicKey} />
          <Tab publicKey={publicKey} />
        </div>
      </div>
    </div>
  );
}

function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex p-12">
      <img src={image} className="rounded-full w-16 h-16 mr-4" />
      <div className="text-2xl font-semibold flex flex-col justify-center">
        Welcome back, {name}
      </div>
    </div>
  );
}
function Tab({ publicKey }: { publicKey: string }) {
  const { tokenBalances, loading } = useTokens(publicKey);
  return (
    <Tabs defaultValue="account" className="w-full mt-5">
      <TabsList className="w-full justify-evenly p-6">
        <TabsTrigger className="text-xl  " value="account">
          Send
        </TabsTrigger>
        <TabsTrigger className="text-xl " value="addFunds">
          Add funds
        </TabsTrigger>
        <TabsTrigger disabled className="text-xl " value="withdraw">
          Withdraw
        </TabsTrigger>
        <TabsTrigger className="text-xl " value="swap">
          Swap
        </TabsTrigger>
      </TabsList>
      <div className="pt-0 bg-slate-50 p-12 mt-4">
        <TabsContent value="account">
          <TokenList tokens={tokenBalances?.tokens || []} />
        </TabsContent>
        <TabsContent value="addFunds">
          <AddFunds />
        </TabsContent>
        <TabsContent value="withdraw">Change your password here.</TabsContent>
        <TabsContent value="swap">
          <Swap tokenBalances={tokenBalances} publicKey={publicKey} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
