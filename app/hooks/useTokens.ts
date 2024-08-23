import { TokenDetails } from "@/lib/tokens";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

export interface TokenWithBalance extends TokenDetails {
    address: string;
    balance: string;
    usdBalance: string;
}

export interface TokenBalances {
    totalBalance: number;
    tokens: TokenWithBalance[];
}

export function useTokens(address: string) {
    const [tokenBalances, setTokenBalances] = useState<TokenBalances | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTokenBalances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/tokens?address=${address}`);
            setTokenBalances(res.data);
        } catch (err) {
            setError("Failed to fetch token balances");
            console.error("Error fetching token balances:", err);
        } finally {
            setLoading(false);
        }
    }, [address]);

    useEffect(() => {
        fetchTokenBalances();
    }, [fetchTokenBalances]);

    const updateBalance = useCallback(async (tokenAddress: string, newBalance: string) => {
        if (!tokenBalances) return;

        const updatedTokens = tokenBalances.tokens.map(token =>
            token.address === tokenAddress ? { ...token, balance: newBalance } : token
        );

        // Recalculate total balance
        const newTotalBalance = updatedTokens.reduce((total, token) =>
            total + parseFloat(token.usdBalance), 0
        );

        setTokenBalances({
            totalBalance: newTotalBalance,
            tokens: updatedTokens,
        });

        // Optionally, you can update the backend here
        // await axios.post('/api/updateBalance', { address, tokenAddress, newBalance });
    }, [tokenBalances]);

    return {
        loading,
        error,
        tokenBalances,
        fetchTokenBalances,
        updateBalance,
    };
}