"use client";
import React, { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { FaPhone } from "react-icons/fa6";
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from "@web3auth/base";

const web3AuthClientId =
  "BHQMa4DE2EnG4qb66kotFkN1fzA4S-ZRhVOr9TzaWIqeCHPp1mVWgNM0lyfjA-K1E4dErw6xoCC7spCeMylxmIs"; // Your Web3Auth Client ID

export default function SolanaMobileLoginButton() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useAuth();

  useEffect(() => {
    async function initializeWeb3Auth() {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.SOLANA,
          chainId: "0x3", // Solana Devnet
          rpcTarget: "https://api.devnet.solana.com",
          displayName: "Solana Devnet",
          blockExplorerUrl: "https://explorer.solana.com",
          ticker: "SOL",
          tickerName: "Solana Token",
        };

        const web3auth = new Web3AuthNoModal({
          clientId: web3AuthClientId,
          web3AuthNetwork: "sapphire_devnet",
          chainConfig,
        });

        const privateKeyProvider = new SolanaPrivateKeyProvider({
          config: { chainConfig },
        });

        const openloginAdapter = new OpenloginAdapter({
          privateKeyProvider,
          adapterSettings: {
            uxMode: "popup",
            loginConfig: {
              jwt: {
                verifier: "hyperlink-oauth", // Replace with your Auth0 verifier name
                typeOfLogin: "jwt",
                clientId: "wbPJKjSwsmTwFMYGZIWnGPyp3Jmk5wLV", // Replace with your Auth0 client ID
              },
            },
          },
        });

        web3auth.configureAdapter(openloginAdapter);
        setWeb3auth(web3auth);

        await web3auth.init();

        if (web3auth.provider) {
          const solanaWallet = new SolanaWallet(web3auth.provider);
          setSolanaWallet(solanaWallet);

          if (web3auth.connected) {
            const accounts = await solanaWallet.requestAccounts();
            setWalletAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Web3Auth", error);
        setError("Failed to initialize Web3Auth. Please try again later.");
      } finally {
        setInitializing(false);
      }
    }

    initializeWeb3Auth();
  }, []);

  const signIn = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "jwt",
          extraLoginOptions: {
            domain: "https://hypelink.us.auth0.com", // Replace with your Auth0 domain
            verifierIdField: "sub",
            connection: "sms", // This specifies we want to use SMS (mobile number) login
          },
        }
      );

      if (web3authProvider) {
        const solanaWallet = new SolanaWallet(web3authProvider);
        setSolanaWallet(solanaWallet);

        const accounts = await solanaWallet.requestAccounts();
        setWalletAddress(accounts[0]);

        const user = await web3auth.getUserInfo();
        const privateKey = await solanaWallet.request({
          method: "solanaPrivateKey",
        });

        dispatch({
          type: "LOGIN",
          payload: { user, publicKey: accounts[0], privateKey },
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!web3auth) {
      setError("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.logout();
      setWalletAddress("");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout failed", error);
      setError("Logout failed. Please try again.");
    }
  };

  if (initializing) {
    return <div>Initializing...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {state.isAuthenticated ? (
        <Button onClick={signOut} type="submit">
          Logout
        </Button>
      ) : (
        <Button
          onClick={signIn}
          className="pl-2 py-6 text-sm md:text-base"
          disabled={loading}
        >
          <span className="flex items-center gap-2">
            <span className="px-3 py-2 rounded-lg border bg-white text-black">
              <FaPhone />
            </span>
            {loading ? "Signing in..." : "Sign in with Mobile"}
          </span>
        </Button>
      )}
    </div>
  );
}
