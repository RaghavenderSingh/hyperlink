import LoginButton from "@/components/LoginButton";
import { getPrivateKey, getPublicKey } from "@/lib/KeyStore";
import { get } from "http";
import React from "react";

export default function page() {
  return (
    <div>
      {getPrivateKey()}
      {getPublicKey()}
      <LoginButton />
    </div>
  );
}
