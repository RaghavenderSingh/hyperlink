import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { decodeToken, Web3Auth } from "@web3auth/single-factor-auth";

// Get this from .env file
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3", // This is for Solana Devnet. Use "0x1" for Mainnet
  rpcTarget: "https://api.devnet.solana.com", // Use "https://api.mainnet-beta.solana.com" for Mainnet
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET, // Changed from SAPPHIRE_MAINNET to SAPPHIRE_DEVNET
  privateKeyProvider,
});

export { decodeToken };