"use client";
import {
  oauthClientId,
  productName,
  web3AuthClientId,
  web3AuthLoginType,
  web3AuthVerifier,
} from "@/constants";
import {
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import React, { useEffect, useState } from "react";
import Header from "./header/page";
import WalletNav from "./WalletNav";
import { disconnect } from "wagmi/actions";
import { useAccount } from "wagmi";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );
  const { address, isConnecting, isConnected } = useAccount();
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const { state, dispatch } = useAuth();

  useEffect(() => {
    async function initializeOpenLogin() {
      const web3auth = new Web3AuthNoModal({
        clientId: web3AuthClientId,
        web3AuthNetwork: "sapphire_devnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3",
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        },
      });

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x3",
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
      const solanaWallet = new SolanaWallet(web3auth.provider);

      setSolanaWallet(solanaWallet);

      if (web3auth.connected) {
        const user = await web3auth.getUserInfo();

        const accounts = await solanaWallet.requestAccounts();
        setWalletAddress(accounts[0]);
      }
    }

    initializeOpenLogin();
  }, [dispatch]);

  useEffect(() => {
    if (web3auth && web3auth.connected && !state.isAuthenticated) {
      getAccounts().then((res: any) => {
        setWalletAddress(res);
        getUser(web3auth);
      });
    }
  }, [provider, state.isAuthenticated, web3auth]);

  async function getUser(web3auth: any) {
    if (!web3auth) {
      return;
    }
    const user = await web3auth?.getUserInfo();
    dispatch({ type: "LOGIN", payload: user });
  }

  const signIn = async () => {
    setLoading(true);
    if (!web3auth) {
      setLoading(false);
      return;
    }
    if (web3auth.connected) {
      setLoading(false);
      return;
    }
    try {
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
      setWalletAddress(acc);
    } catch (error) {
      console.error("Login failed", error);
    }
    setLoading(false);
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

      return await accounts[0];
    } catch (error) {
      return error;
    }
  };

  const signOut = async () => {
    await web3auth?.logout();
    localStorage.removeItem("isGoogleLogin");
    localStorage.removeItem("isConnected");
    if (isConnected) {
      await disconnect();
    }
    setWalletAddress("");
    dispatch({ type: "LOGOUT" });
  };

  console.log(state.user);
  if (state.isAuthenticated) {
    return (
      <WalletNav
        profileImage={state.user?.profileImage}
        name={state.user?.name}
        mail={state.user?.email}
        signOut={signOut}
      />
    );
  }
  return (
    <div>
      <Header signIn={signIn} loading={loading} />
    </div>
  );
}
