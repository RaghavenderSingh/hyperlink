import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { convertUsdToSol } from "@/lib/KeyStore";
import { useSolanaTransfer } from "@/app/hooks/useSolanaTransfer";
import { useTransferSOL } from "@/app/hooks/useTransferSOL";

import Assets from "../Assets";
import Tab from "./Tabs";
import { Skeleton } from "../ui/skeleton";

export default function Wallet({
  name,
  profileImage,
  hyperPublicKey,
}: {
  name: string;
  profileImage: string;
  hyperPublicKey: string;
}) {
  if (!name || !profileImage || !hyperPublicKey) return <>...Loading</>;

  const [tokenBalances, setTokenBalances] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Number>(0);
  const [amount, setAmount] = useState("0");
  const [addAmount, setAddAmount] = useState("0");
  const [recipentPublicKey, setRecipentPublicKey] = useState<string>("");

  const { transferAsset } = useSolanaTransfer();
  const { publicKey } = useWallet();
  const [recipientAddress, setRecipientAddress] = useState(
    publicKey?.toBase58()
  );
  const { transferSOL } = useTransferSOL();

  const fetchTokenBalances = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/tokens?address=${hyperPublicKey}`);
      setTokenBalances(response.data);
      console.log("Updated token balances:", response.data);
    } catch (err) {
      toast.error("Failed to fetch token balances");
      console.error("Error fetching token balances:", err);
    } finally {
      setIsLoading(false);
    }
  }, [hyperPublicKey]);

  useEffect(() => {
    fetchTokenBalances();

    // Set up an interval to fetch balances every 30 seconds
    const intervalId = setInterval(fetchTokenBalances, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchTokenBalances]);

  const handleTransfer = async () => {
    if (!recipientAddress || !amount) {
      toast.error("Something went wrong. Please try again later");
      return;
    }
    setLoading(true);
    const amt = Number(await convertUsdToSol(amount));
    await transferAsset(recipientAddress, amt * LAMPORTS_PER_SOL);
    toast.success("Transfer successful");
    setAmount("0");
    fetchTokenBalances(); // Update balances after transfer
    setLoading(false);
    setStep(0);
  };

  const handleDeposit = async () => {
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }
      if (addAmount === "0") {
        toast.error("No amount specified");
        return;
      }

      setLoading(true);

      const amt = Number(await convertUsdToSol(addAmount));
      console.log("amt", amt);

      await transferSOL(hyperPublicKey, amt * LAMPORTS_PER_SOL);

      setStep(3);
      toast.success(`Transfer successful $${amt} added`);
      setAddAmount("0");
      await fetchTokenBalances(); // Update balances after deposit
    } catch (error) {
      console.error("Error during deposit:", error);
      toast.error("An error occurred during the deposit");
      await fetchTokenBalances();
    } finally {
      setLoading(false);
      await fetchTokenBalances();
    }
  };
  const handleTransferToPublickkey = async () => {
    console.log(recipentPublicKey, amount);
    if (!recipentPublicKey || amount === "") {
      toast.error("Missing required information for transfer.");
      return;
    }
    try {
      setIsLoading(true);
      const publicKey = new PublicKey(recipentPublicKey);
      publicKey.toBytes().length === 32;
      const amt = await convertUsdToSol(amount);
      const transferAmount = Number(amt) * LAMPORTS_PER_SOL;
      console.log(publicKey, amount, transferAmount);
      await transferAsset(recipentPublicKey, transferAmount);
      toast.success("Transfer successful");
      setAmount("0");
      setRecipentPublicKey("");
      fetchTokenBalances(); // Update balances after transfer
      setLoading(false);
    } catch (error) {
      toast.error("Invalid public key");
      return false;
    }
  };

  return (
    <div>
      <div className="flex justify-center pt-8">
        <div className="max-w-4xl bg-white rounded shadow w-full p-12">
          <Greeting image={profileImage} name={name} />
          <Assets
            publicKey={hyperPublicKey}
            tokenBalances={tokenBalances}
            loading={isLoading}
          />
          <Tab
            publicKey={hyperPublicKey}
            setUpdateBalance={fetchTokenBalances}
            updateBalance={isLoading}
            balance={tokenBalances?.tokens[0]?.balance}
            handleTransfer={handleTransfer}
            setAmount={setAmount}
            amount={amount}
            setStep={setStep}
            step={step}
            loading={loading}
            handleDeposit={handleDeposit}
            setAddAmount={setAddAmount}
            setRecipentPublicKey={setRecipentPublicKey}
            handleTransferToPublickkey={handleTransferToPublickkey}
            recipentPublicKey={recipentPublicKey}
          />
        </div>
      </div>
    </div>
  );
}

function Greeting({ image, name }: { image: string; name: string }) {
  if (!name || !image)
    return (
      <div className="flex p-12">
        <Skeleton className="rounded-full w-16 h-16 mr-4" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    );
  return (
    <div className="flex p-12">
      <img src={image} alt={name} className="rounded-full w-16 h-16 mr-4" />
      <div className="text-2xl font-semibold flex flex-col justify-center">
        Welcome back, {name}
      </div>
    </div>
  );
}
