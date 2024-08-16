"use client";
import Header from "@/components/header/page";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import {
  SolanaWallet,
  SolanaPrivateKeyProvider,
} from "@web3auth/solana-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  oauthClientId,
  productName,
  web3AuthClientId,
  web3AuthLoginType,
  web3AuthVerifier,
} from "../constants";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import Hero from "@/components/Hero";
import Wallet from "@/components/Wallet";
import WalletNav from "@/components/WalletNav";
import { setPrivateKey, setPublicKey } from "@/lib/KeyStore";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const { disconnect } = useWagmi();
  const { address, isConnecting, isConnected } = useAccount();
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const [user, setUser] = useState<any>(null);
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);

  useEffect(() => {
    async function initializeOpenLogin() {
      const web3auth = new Web3AuthNoModal({
        clientId: web3AuthClientId, // get it from Web3Auth Dashboard
        web3AuthNetwork: "sapphire_devnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        },
      });

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
        rpcTarget: "https://api.devnet.solana.com",
        displayName: "Solana Devnet",
        blockExplorer: "https://explorer.solana.com",
        ticker: "SOL",
        tickerName: "Solana Token",
      };

      const privateKeyProvider = new SolanaPrivateKeyProvider({
        config: { chainConfig },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          uxMode: "popup",
          loginConfig: {
            google: {
              name: productName,
              verifier: web3AuthVerifier,
              typeOfLogin: web3AuthLoginType,
              clientId: oauthClientId,
            },
          },
        },
        loginSettings: {
          mfaLevel: "none",
        },
        privateKeyProvider,
      });
      web3auth.configureAdapter(openloginAdapter);
      setWeb3auth(web3auth);

      await web3auth.init();

      setProvider(web3auth.provider);
      //@ts-ignore
      const solanaWallet = new SolanaWallet(web3auth.provider); // web3auth.provider

      setSolanaWallet(solanaWallet);
    }

    initializeOpenLogin();
  }, []);

  useEffect(() => {
    if (web3auth && web3auth.connected) {
      getAccounts().then((res: any) => {
        setWalletAddress(res);
        setPublicKey(res);
        getUser(web3auth);
      });
    }
  }, [provider]);

  const signIn = async () => {
    if (!web3auth) {
      return;
    }
    if (web3auth.connected) {
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );
    setProvider(web3authProvider);
    const acc = (await getAccounts()) as any;
    localStorage.setItem("isConnected", "true");
    localStorage.setItem("isGoogleLogin", "true");
    const user = await web3auth?.getUserInfo();
    setUser(user);
    setWalletAddress(acc);
    setPublicKey(acc);
  };

  const getAccounts = async () => {
    if (!provider) {
      return;
    }
    try {
      //@ts-ignore
      const accounts = await solanaWallet.requestAccounts();
      const priv = (await provider.request({
        method: "private_key",
      })) as string;
      setPrivateKey(priv);

      return await accounts[0];
    } catch (error) {
      return error;
    }
  };

  const signOut = async () => {
    console.log("signOut");
    await web3auth?.logout();
    localStorage.removeItem("isGoogleLogin");
    localStorage.removeItem("isConnected");
    if (isConnected) {
      await disconnect();
    }
    setWalletAddress("");
    setUser(null);
  };

  useEffect(() => {
    if (address && !isConnecting && connecting) {
      localStorage.setItem("isConnected", "true");
      localStorage.setItem("isGoogleLogin", "false");
      setConnecting(false);
      setWalletAddress(address);
      setPublicKey(address);
    }
  }, [isConnecting]);
  async function getUser(web3auth: any) {
    if (!web3auth) {
      return;
    }
    const user = await web3auth?.getUserInfo();
    setUser(user);
  }

  return (
    <>
      {walletAddress ? (
        <>
          <WalletNav profileImage={user?.profileImage} signOut={signOut} />
          <Wallet
            name={user?.name}
            profileImage={user?.profileImage}
            publicKey={walletAddress}
          />
        </>
      ) : (
        <div>
          <Header
            walletAddress={walletAddress}
            signIn={signIn}
            signOut={signOut}
            setWalletAddress={setWalletAddress}
            user={user}
          />
          <Hero signIn={signIn} />
        </div>
      )}
    </>
  );
}
