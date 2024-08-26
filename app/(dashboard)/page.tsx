"use client";
import Hero from "@/components/Hero";
import Wallet from "@/components/wallet/Wallet";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!state.isAuthenticated) {
    return (
      <div>
        <section className="h-[100vh] flex flex-col items-center justify-center">
          <Hero loading={loading} />
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
