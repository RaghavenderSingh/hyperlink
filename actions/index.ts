// File: lib/authActions.ts

"use client";

import { signIn, signOut } from "next-auth/react";
import { web3auth } from "@/lib/web3auth";

export async function handleSignIn() {
  try {
    await signIn("google", { redirect: false });
    // After successful sign-in, you might want to update some client-side state
    // or trigger a re-render of your component
  } catch (error) {
    console.error("Error during sign in:", error);
  }
}

export async function handleSignOut() {
  try {
    if (web3auth.status === "connected") {
      await web3auth.logout();
    }
    await signOut({ redirect: false });
    // After successful sign-out, you might want to update some client-side state
    // or trigger a re-render of your component
  } catch (error) {
    console.error("Error during sign out:", error);
  }
}

export function checkWeb3AuthStatus() {
  if (web3auth) {
    return web3auth.status;
  }
  return "disconnected";
}