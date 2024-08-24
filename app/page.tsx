"use client";
import Header from "@/components/header/page";
import Hero from "@/components/Hero";
import Wallet from "@/components/wallet/Wallet";
import WalletNav from "@/components/WalletNav";
import { useState, useEffect, useRef } from "react";
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  SafeEventEmitterProvider,
} from "@web3auth/base";
import {
  SolanaWallet,
  SolanaPrivateKeyProvider,
} from "@web3auth/solana-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import {
  oauthClientId,
  productName,
  web3AuthClientId,
  web3AuthLoginType,
  web3AuthVerifier,
} from "../constants";
import { setPrivateKey, setPublicKey } from "@/lib/KeyStore";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import { useAccount } from "wagmi";
import LinkWallet from "@/components/LinkWallet";

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
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollElement = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    async function initializeOpenLogin() {
      const web3auth = new Web3AuthNoModal({
        clientId: web3AuthClientId, // get it from Web3Auth Dashboard
        web3AuthNetwork: "sapphire_devnet",
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        },
      });

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.SOLANA,
        chainId: "0x3", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
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
    setLoading(true);
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
      setPrivateKey(priv);

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
  if (!walletAddress) {
    return (
      <div>
        <section className="h-[100vh] flex flex-col items-center justify-center">
          <Header signIn={signIn} loading={loading} />
          <Hero
            signIn={signIn}
            loading={loading}
            scrollElement={scrollElement}
          />
        </section>
        <section
          ref={ref}
          className="h-[100vh] flex flex-col items-center justify-center"
        >
          <LinkWallet />
        </section>
      </div>
    );
  }
  return (
    <div>
      <div>
        <WalletNav
          profileImage={user?.profileImage}
          name={user?.name}
          mail={user?.email}
          signOut={signOut}
        />
        <Wallet
          name={user?.name}
          profileImage={user?.profileImage}
          hyperPublicKey={walletAddress}
        />
      </div>
    </div>
  );
}
