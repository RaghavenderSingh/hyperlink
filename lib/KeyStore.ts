import { LAMPORTS_PER_SOL } from "@solana/web3.js";


let privateKey: string | null = null;
let publicKey: string | null = null;

export const setPublicKey = (key: string) => {
    publicKey = key;
};
export const setPrivateKey = (key: string) => {
    privateKey = key;
};

export const getPrivateKey = () => {

    if (privateKey === null) {
        throw new Error("Private key is not set");
    }
    else {
        return privateKey;
    }

};
export const getPublicKey = () => {

    if (publicKey === null) {
        return ("Public key is not set");
    }
    else {
        return publicKey;
    }

};
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
