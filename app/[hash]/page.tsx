// app/[hash]/page.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import HyperLinkCard from "./(components)/HyperLinkCard";

export default function HashPage() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if the current path is a valid hash format
    const isValidHashFormat = pathname.startsWith("/i/");

    if (!isValidHashFormat) {
      // Redirect to home page or show error if hash format is invalid
      router.push("/");
      return;
    }
  }, [pathname, router]);

  return <HyperLinkCard />;
}
