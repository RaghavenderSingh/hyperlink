"use client";
import { useAuth } from "@/context/AuthContext";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
function useAuthState() {
    const state = useAuth();
    return state.state;
}

// Utility function to get private key
export function usePrivateKey() {
    const authState = useAuthState();
    return authState.privateKey as string;
}

// Utility function to get public key
export function usePublicKey() {
    const authState = useAuthState();
    return authState.publicKey as string;
}
export async function convertUsdToSol(usdAmount: string): Promise<string> {
    if (usdAmount === "" || parseFloat(usdAmount) === 0) {
        return "0";
    }

    const inputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const outputMint = "So11111111111111111111111111111111111111112"; // SOL
    const quoteApiUrl = "https://quote-api.jup.ag/v6/quote";

    // Convert USD amount to USDC smallest unit (6 decimal places)
    const amount = (Number(usdAmount) * 1e6).toString();

    try {
        const url = `${quoteApiUrl}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;

        const response = await fetch(url);
        const data = await response.json();

        // Convert output amount from lamports to SOL
        const solAmount = (data.outAmount / LAMPORTS_PER_SOL).toFixed(4);
        return solAmount;
    } catch (error) {
        console.error("Error fetching SOL value:", error);
        return "Error";
    }
}
