"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleSignOut } from "@/actions";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export default function SignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOutClick = async () => {
    setIsSigningOut(true);
    try {
      await handleSignOut();
      // Optionally, you can redirect the user or update the UI here
      router.refresh();
      // If you're using a global state management solution like Redux or Context API,
      // you might want to update the auth state here as well
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally, display an error message to the user
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      onClick={() => handleSignOutClick()}
      variant="ghost"
      className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-5 py-6"
    >
      <LogOut className="h-5 w-5 mr-2" />
      Log out
    </Button>
  );
}
