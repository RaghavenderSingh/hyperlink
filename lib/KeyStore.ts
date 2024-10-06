"use client";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";



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
export async function convertSolToUsd(solAmount: string): Promise<string> {
    try {
        // Fetch the current SOL/USD exchange rate
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
        const solUsdRate = response.data.solana.usd;

        // Convert the SOL amount to a number
        const solValue = parseFloat(solAmount);

        if (isNaN(solValue)) {
            throw new Error('Invalid SOL amount');
        }

        // Calculate the USD value
        const usdValue = solValue * solUsdRate;

        // Return the USD value as a string, rounded to 2 decimal places
        return usdValue.toFixed(2);
    } catch (error) {
        console.error('Error converting SOL to USD:', error);
        throw error;
    }
}