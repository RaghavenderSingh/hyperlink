import { useState } from "react";
import WalletWithdraw from "../Withdraw/WalletWithdraw";
import { useTokens } from "@/app/hooks/useTokens";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TokenList } from "../TokenList";
import { Swap } from "../swap";
import FundingOptions from "../AddFunds/FundingOptions";
import ExternalAccount from "../AddFunds/ExternalAccount";
import ConnectedWallet from "../AddFunds/ConnectedWallet";
import WithdrawOptions from "../Withdraw/WithdrawOptions";
import TransferToAddress from "../TransferToAddress";

export default function Tab({
  publicKey,
  balance,
  handleTransfer,
  setAmount,
  setStep,
  step,
  loading,
  handleDeposit,
  setAddAmount,

  setRecipentPublicKey,
  handleTransferToPublickkey,
  amount,
  recipentPublicKey,
}: {
  publicKey: string;
  setUpdateBalance: (value: boolean) => void;
  balance: number;
  updateBalance: boolean;
  handleTransfer: () => void;
  setAmount: (value: string) => void;
  amount: string;
  setStep: (value: number) => void;
  step: Number;
  loading: boolean;
  handleDeposit: () => void;
  setAddAmount: (value: string) => void;
  setRecipentPublicKey: (value: string) => void;

  recipentPublicKey: string;
  handleTransferToPublickkey: () => void;
}) {
  const { tokenBalances } = useTokens(publicKey);
  const [activeTab, setActiveTab] = useState("account");

  const handleSteps = (step: Number) => {
    switch (step) {
      case 0:
        return <WithdrawOptions setStep={setStep} />;
      case 2:
        return (
          <WalletWithdraw
            setAmount={setAmount}
            handleTransfer={handleTransfer}
            balance={balance}
            setStep={setStep}
            loading={loading}
          />
        );
      case 3:
        return <FundingOptions setStep={setStep} />;

      case 4:
        return <ExternalAccount setStep={setStep} />;

      case 5:
        return (
          <ConnectedWallet
            setAddAmount={setAddAmount}
            handleDeposit={handleDeposit}
            setStep={setStep}
            loading={loading}
          />
        );
      case 6:
        return (
          <TransferToAddress
            setStep={setStep}
            setTransferAmount={setAmount}
            setRecipentPublicKey={setRecipentPublicKey}
            handleTransferToPublickkey={handleTransferToPublickkey}
            transferAmount={amount}
            recipentPublicKey={recipentPublicKey}
          />
        );
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full mt-5"
    >
      <TabsList className="w-full justify-evenly p-6">
        <TabsTrigger className="text-xl  " value="account">
          Send
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setStep(3)}
          className="text-xl "
          value="addFunds"
        >
          Add funds
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setStep(0)}
          className="text-xl "
          value="withdraw"
        >
          Withdraw
        </TabsTrigger>
        <TabsTrigger className="text-xl " value="swap">
          Swap
        </TabsTrigger>
      </TabsList>
      <div className="pt-0 bg-slate-50 p-12 mt-4">
        <TabsContent value="account">
          <TokenList
            tokens={tokenBalances?.tokens || []}
            navigator={setActiveTab}
          />
        </TabsContent>
        <TabsContent value="addFunds">{handleSteps(step)}</TabsContent>
        <TabsContent value="withdraw">{handleSteps(step)}</TabsContent>
        <TabsContent value="swap">
          <Swap tokenBalances={tokenBalances} publicKey={publicKey} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
