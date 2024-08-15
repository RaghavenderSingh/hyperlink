import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";

export const transferSOL = async (destinationAddress: string, amount: number) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    if (!publicKey) {
        console.log("Wallet not connected");
        return;
    }

    try {
        const recipient = new PublicKey(destinationAddress);
        const lamports = amount * 1e9; // Convert SOL to lamports (1 SOL = 1e9 lamports)

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
    }
};
