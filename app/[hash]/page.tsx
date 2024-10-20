"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HyperLinkCard from "./(components)/HyperLinkCard";

export default function HashPage() {
  const router = useRouter();
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const extractHash = () => {
      // Check if we're in the browser environment
      if (typeof window === "undefined") return null;

      // Check if the pathname starts with /i
      if (!window.location.pathname.startsWith("/i")) {
        router.push("/");
        return null;
      }

      // Get the hash part (including the # symbol)
      const fullHash = window.location.hash;

      // Check if hash exists and has content
      if (!fullHash || fullHash.length <= 1) {
        router.push("/");
        return null;
      }

      // Return the hash content (everything after #)
      return fullHash.slice(1);
    };

    const hashValue = extractHash();
    if (hashValue) {
      setHash(hashValue);
    }
  }, [router]);

  // Show loading state while hash is being processed
  if (hash === null) {
    return <div>Loading...</div>;
  }

  // Pass the hash to HyperLinkCard component
  return <HyperLinkCard />;
}
