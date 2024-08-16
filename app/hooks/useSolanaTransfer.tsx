import { useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from "@solana/web3.js";
import { getPrivateKey, getPublicKey } from "@/lib/KeyStore";

export const useSolanaTransfer = () => {
  const [transferStatus, setTransferStatus] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const transferAsset = async (recipientAddress: string, amount: number) => {
    setIsTransferring(true);
    setTransferStatus("Initiating transfer...");

    try {
      const connection = new Connection("https://api.devnet.solana.com");

      const privateKey = getPrivateKey();
      const publicKey = getPublicKey();

      const senderKeypair = Keypair.fromSecretKey(
        new Uint8Array(Buffer.from(privateKey, "hex"))
      );
      const sender = new PublicKey(publicKey);
      const recipient = new PublicKey(recipientAddress);
      const lamports = amount * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sender;

      // Sign the transaction
      transaction.sign(senderKeypair);

      // Serialize the signed transaction
      const serializedTransaction = transaction.serialize();

      // Send the serialized transaction
      const signature = await connection.sendRawTransaction(
        serializedTransaction
      );

      await connection.confirmTransaction(signature);

      setTransferStatus(`Transfer successful! Signature: ${signature}`);
    } catch (error) {
      console.error("Transfer failed:", error);
      setTransferStatus(`Transfer failed: ${error}`);
    } finally {
      setIsTransferring(false);
    }
  };

  return { transferAsset, transferStatus, isTransferring };
};
