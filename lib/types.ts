export interface TokenDetails {
    name: string;
    mint: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    price?: string;
    native?: boolean;
}

export interface TokenWithBalance extends TokenDetails {
    balance: string;
    usdBalance: string;
}