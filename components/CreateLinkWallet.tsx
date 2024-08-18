"use client";
import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { HyperLink } from "../../hyper-api/src"; // Replace with actual package name
import ConnectOptionsButton from "./ui/ConnectOptionsButton";
import { Card } from "./ui/card";
import CustomTextField from "./CustomTextField";
import { Button } from "./ui/button";

export default function CreateLinkWallet() {
  const [amount, setAmount] = useState("0");
  const [password, setPassword] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [error, setError] = useState("");
  const { connected, publicKey, sendTransaction } = useWallet();

  const handleSelection = (selectedOption: any) => {
    console.log("Selected option:", selectedOption);
    // Here you can handle the selected option, e.g., navigate to a login page,
    // open a wallet connection dialog, etc.
  };

  const createLinkAndTransfer = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first.");
      return;
    }

    try {
      // Create HyperLink
      const hyperlink = await HyperLink.create(0, password);
      const hyperlinkUrl = hyperlink.url.toString();
      setGeneratedLink(hyperlinkUrl);

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
      console.log(transaction);
      console.log(
        "private key",
        Buffer.from(hyperlink.keypair.secretKey).toString("hex")
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
      <div className="inline-flex w-full flex-wrap items-center justify-center gap-y-1 py-2 text-xs text-grey-700 css-0">
        Supported assets:
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full css-0"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
        />
        SOL,
        <img
          className="mx-1 mt-[-2px] inline h-4 min-h-4 w-4 min-w-4 flex-shrink-0 rounded-full css-0"
          src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
        />
        <span className="chakra-text flex w-max items-center justify-start css-0">
          <span className="chakra-text shrink-0 css-0">
            {"USDC, and  all Solana tokens + NFTs"}
          </span>
        </span>
      </div>

      <CustomTextField setAmount={setAmount} />

      <input
        type="password"
        placeholder="Password for HyperLink"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

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
