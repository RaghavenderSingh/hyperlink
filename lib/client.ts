import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { web3auth } from "./web3auth"; // Adjust the import path as needed

let connection: Connection | null = null;
let publicKey: PublicKey | null = null;

// Solana devnet RPC endpoint
const SOLANA_RPC_ENDPOINT = `https://rpc.ironforge.network/${process.env.NEXT_PUBLIC_SOLANA_ENVIRONMENT}?apiKey=${process.env.NEXT_PUBLIC_IRONFORGE_API_KEY}`;

export function initClients() {
  if (typeof window !== "undefined" && web3auth.provider) {
    connection = new Connection(SOLANA_RPC_ENDPOINT);

    // Updated to handle the unknown type and check if it's an array of strings
    web3auth.provider.request({ method: "getAccounts" }).then((accounts: unknown) => {
      if (Array.isArray(accounts) && accounts.length > 0 && typeof accounts[0] === 'string') {
        publicKey = new PublicKey(accounts[0]);
      } else {
        console.error("Unable to get a valid public key from Web3Auth");
      }
    }).catch(error => {
      console.error("Error getting accounts from Web3Auth:", error);
    });
  }
}

export function getConnection() {
  if (typeof window !== "undefined" && !connection) {
    initClients();
  }
  return connection;
}

export function getPublicKey() {
  if (typeof window !== "undefined" && !publicKey) {
    initClients();
  }
  return publicKey;
}

export function formatSOL(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(9);
}

export function parseSOL(sol: string): number {
  return Math.floor(parseFloat(sol) * LAMPORTS_PER_SOL);
}

export async function getBalance(address: PublicKey): Promise<string> {
  if (!connection) throw new Error("Connection not initialized");
  const balance = await connection.getBalance(address);
  return formatSOL(balance);
}

export async function sendTransaction(from: PublicKey, to: string, amount: number) {
  if (!connection || !web3auth.provider) throw new Error("Connection or provider not initialized");

  const transaction = await createTransferTransaction(from, to, amount);

  // Sign and send the transaction using Web3Auth provider
  const signedTransaction = await web3auth.provider.request({
    method: "signAndSendTransaction",
    params: {
      message: transaction.serializeMessage().toString('hex'),
    },
  });

  return signedTransaction;
}

async function createTransferTransaction(from: PublicKey, to: string, amount: number) {
  if (!connection) throw new Error("Connection not initialized");

  const { Transaction, SystemProgram } = await import("@solana/web3.js");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: new PublicKey(to),
      lamports: amount,
    })
  );

  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = from;

  return transaction;
}