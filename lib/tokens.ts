import axios from 'axios';
import { TokenDetails } from './types';
import { connection } from './solana';
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function getAllSolanaTokens(): Promise<TokenDetails[]> {
    try {
        const response = await axios.get('https://token.jup.ag/all');
        return response.data.map((token: any) => ({
            name: token.name,
            mint: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            logoURI: token.logoURI,
            native: token.symbol === 'SOL'
        }));
    } catch (error) {
        console.error('Error fetching Solana tokens:', error);
        return [];
    }
}

export async function getTokenPrices(symbols: string[]): Promise<{ [key: string]: string }> {
    const batchSize = 100; // Adjust this value based on API limitations
    const prices: { [key: string]: string } = {};

    for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        try {
            const symbolsParam = encodeURIComponent(batch.join(','));
            const response = await axios.get(`https://price.jup.ag/v4/price?ids=${symbolsParam}`);
            for (const [symbol, data] of Object.entries(response.data.data)) {
                prices[symbol] = (data as any).price.toString();
            }
        } catch (error) {
            console.error(`Error fetching token prices for batch ${i}:`, error);
        }
    }

    return prices;
}

export async function getSupportedTokens(): Promise<TokenDetails[]> {
    const allTokens = await getAllSolanaTokens();
    const tokenSymbols = allTokens.map(token => token.symbol);
    const prices = await getTokenPrices(tokenSymbols);

    return allTokens.map(token => ({
        ...token,
        price: prices[token.symbol] || '0',
    }));
}

export async function getAccountBalance(token: TokenDetails, address: string): Promise<number> {
    if (token.native) {
        const balance = await connection.getBalance(new PublicKey(address));
        return balance / LAMPORTS_PER_SOL;
    }
    const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
    try {
        const account = await getAccount(connection, ata);
        return Number(account.amount) / (10 ** token.decimals);
    } catch (e) {
        return 0;
    }
}