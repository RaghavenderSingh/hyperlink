import { useState, useCallback } from "react";
import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

export const useTransferSOL = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [isTransferring, setIsTransferring] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const transferSOL = useCallback(async (destinationAddress: string, amount: number) => {
        console.log("Transferring SOL...", destinationAddress);
        if (!publicKey) {
            console.log("Wallet not connected");
            return;
        }

        try {
            setIsTransferring(true);
            setError(null);

            const recipient = new PublicKey(destinationAddress);
            const lamports = amount; // Convert SOL to lamports (1 SOL = 1e9 lamports)

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipient,
                    lamports,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            console.log("Transaction successful", signature);
        } catch (error) {
            console.error("Transaction failed", error);
            setError(error instanceof Error ? error.message : "Unknown error");
        } finally {
            setIsTransferring(false);
        }
    }, [publicKey, connection, sendTransaction]);

    return { transferSOL, isTransferring, error };
};
