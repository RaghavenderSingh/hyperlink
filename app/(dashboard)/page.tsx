"use client";
import Hero from "@/components/Hero";
import Wallet from "@/components/wallet/Wallet";
import { useState, useRef } from "react";

import { getPrivateKey, getPublicKey } from "@/lib/KeyStore";

import LinkWallet from "@/components/LinkWallet";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const scrollElement = () => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!state.isAuthenticated) {
    return (
      <div>
        <section className="h-[100vh] flex flex-col items-center justify-center">
          <Hero loading={loading} scrollElement={scrollElement} />
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
        <Wallet
          name={state.user?.name}
          profileImage={state.user?.profileImage}
          hyperPublicKey={state.publicKey}
        />
      </div>
    </div>
  );
}
