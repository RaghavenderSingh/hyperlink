"use client";
import Header from "@/components/header/page";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { useConnectModal } from "@rainbow-me/rainbowkit";
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
import { serializeError } from "eth-rpc-errors";
import React, { use, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import {
  oauthClientId,
  productName,
  web3AuthClientId,
  web3AuthLoginType,
  web3AuthVerifier,
} from "../constants";
import { ACTIONS, GlobalContext } from "../context/GlobalContext";
import { useWagmi } from "../utils/wagmi/WagmiContext";
import Hero from "@/components/Hero";
import Wallet from "@/components/Wallet";
import WalletNav from "@/components/WalletNav";
import { setPrivateKey } from "@/lib/KeyStore";

export type THandleStep = {
  handleSteps: (step: number) => void;
};
export enum ESTEPS {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}
export enum LOGGED_IN {
  GOOGLE = "google",
  EXTERNAL_WALLET = "external_wallet",
}

export default function Home() {
  const {
    dispatch,
    state: { loggedInVia },
  } = useContext(GlobalContext);
  const [loader, setLoader] = useState(true);
  const { openConnectModal } = useConnectModal();

  const [walletAddress, setWalletAddress] = useState<string>("");
  const [step, setStep] = useState<number>(ESTEPS.ONE);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { getAccount, disconnect } = useWagmi();
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
        dispatch({
          type: ACTIONS.LOGGED_IN_VIA,
          payload: LOGGED_IN.GOOGLE,
        });
        dispatch({
          type: ACTIONS.SET_ADDRESS,
          payload: res,
        });
        setWalletAddress(res);
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
    dispatch({
      type: ACTIONS.LOGGED_IN_VIA,
      payload: LOGGED_IN.GOOGLE,
    });
    dispatch({
      type: ACTIONS.SET_ADDRESS,
      payload: acc,
    });

    const user = await web3auth?.getUserInfo();
    setUser(user);
    setWalletAddress(acc);
  };

  const getAccounts = async () => {
    if (!provider) {
      return;
    }
    try {
      //@ts-ignore
      const accounts = await solanaWallet.requestAccounts();

      console.log("121", accounts);
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
    setStep(ESTEPS.ONE);

    dispatch({
      type: ACTIONS.LOGGED_IN_VIA,
      payload: "",
    });
    dispatch({
      type: ACTIONS.LOGOUT,
      payload: "",
    });
    dispatch({
      type: ACTIONS.SET_ADDRESS,
      payload: "",
    });
    if (isConnected) {
      await disconnect();
    }
    setWalletAddress("");
    setOpenBottomSheet(false);
    setUser(null);
  };

  const handleSteps = (step: number) => {
    setStep(step);
  };

  const getUIComponent = (step: number) => {
    // switch (step) {
    //   case ESTEPS.ONE:
    //     return <HomePage handleSetupChest={handleSetupChest} />;
    //   case ESTEPS.TWO:
    //     return (
    //       <ConnectWallet
    //         signIn={signIn}
    //         handleSteps={handleSteps}
    //         connecting={connecting}
    //         connectWallet={connectWallet}
    //       />
    //     );
    //   case ESTEPS.THREE:
    //     return <LoadChestComponent provider={provider} />;
    //   default:
    //     return <HomePage handleSetupChest={handleSetupChest} />;
    // }
  };

  const handleSetupChest = async () => {
    if (walletAddress) {
      handleSteps(ESTEPS.THREE);
    } else {
      handleSteps(ESTEPS.TWO);
    }
  };
  const onHamburgerClick = () => {
    setOpenBottomSheet(true);
  };

  const connectWallet = async () => {
    setConnecting(true);
    try {
      await openConnectModal?.();
    } catch (e: any) {
      const err = serializeError(e);
      setConnecting(false);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (address && !isConnecting && connecting) {
      localStorage.setItem("isConnected", "true");
      localStorage.setItem("isGoogleLogin", "false");
      dispatch({
        type: ACTIONS.SET_ADDRESS,
        payload: address,
      });
      dispatch({
        type: ACTIONS.LOGGED_IN_VIA,
        payload: LOGGED_IN.EXTERNAL_WALLET,
      });
      setConnecting(false);
      setWalletAddress(address);
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
            handleSteps={handleSteps}
            onHamburgerClick={onHamburgerClick}
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
