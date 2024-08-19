"use client";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { HyperLink } from "@/utils/url";
import ConnectOptionsButton from "./ui/ConnectOptionsButton";
import { Card } from "./ui/card";
import CustomTextField from "./CustomTextField";
import { Button } from "./ui/button";

export default function CreateLinkWallet() {
  const [amount, setAmount] = useState("0");
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const { connected, publicKey, sendTransaction } = useWallet();

  const handleSelection = (selectedOption: any) => {
    console.log("Selected option:", selectedOption);
    // Handle the selected option here
  };

  const createLinkAndTransfer = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      // Create HyperLink
      const hyperlink = await HyperLink.create(0);
      const hyperlinkUrl = hyperlink.url.toString();
      setGeneratedLink(hyperlinkUrl);
      console.log(Buffer.from(hyperlink.keypair.secretKey).toString("hex"));
      // Transfer funds
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const amountLamports = parseInt(amount); // amount is already in lamports from CustomTextField

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(hyperlink.keypair.publicKey),
          lamports: amountLamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      console.log("Transfer successful. Signature:", signature);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Error creating HyperLink or transferring funds.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Create HyperLink</h2>
      <p className="text-center text-sm text-gray-600">
        Send crypto & NFTs to anyone, even if they don't have a wallet. No app
        needed!
      </p>
      <ConnectOptionsButton onSelect={handleSelection} />
      <div className="inline-flex w-full flex-wrap items-center justify-center gap-y-1 py-2 text-xs text-grey-700">
        Supported assets:
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
          alt="SOL"
        />
        SOL,
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
          alt="USDC"
        />
        <span className="flex w-max items-center justify-start">
          <span className="shrink-0">USDC, and all Solana tokens + NFTs</span>
        </span>
      </div>

      <CustomTextField setAmount={setAmount} />

      <Button
        disabled={!connected}
        onClick={createLinkAndTransfer}
        className="w-full"
      >
        Create Hyperlink and Transfer
      </Button>

      {generatedLink && (
        <div className="mt-4">
          <p className="font-semibold">Generated HyperLink:</p>
          <p className="break-all text-sm">{generatedLink}</p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </Card>
  );
}
