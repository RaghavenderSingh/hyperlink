"use client";
import React, { useState } from "react";
import Logo from "../icons/Logo";
import { LayoutGrid, Wallet } from "lucide-react";
import { Session } from "next-auth";
import UserWalletDashboard from "../WalletCard/UserWalletDashboard";

import UserActionPanel from "./UserActionPanel";

type UserInfoProps = {
  session: Session | null;
};

const LoginAppbar: React.FC<UserInfoProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<"wallet" | "apps">("wallet");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar for mobile */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2 shadow-[0_0_40px_rgba(0,0,0,0.06)] hover:bg-blue-25">
            <img
              alt="user avatar"
              className="rounded-full border border-[#E0E7EB] h-[30px] w-[30px]"
              src={
                session?.user?.image || "https://example.com/default-avatar.png"
              }
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center justify-between p-4 bg-white">
        <div className="flex items-center justify-center p-2 w-auto h-auto border rounded-xl bg-white/90 backdrop-blur-sm">
          <Logo />
        </div>
        <div className="flex-grow flex justify-center mx-4">
          <div className="w-full max-w-[400px]">
            <div className="w-full h-12 grid grid-cols-2 bg-gray-800 text-white rounded-md p-1">
              <TabButton
                value="wallet"
                icon={Wallet}
                label="Wallet"
                isActive={activeTab === "wallet"}
                onClick={() => setActiveTab("wallet")}
              />
              <TabButton
                value="apps"
                icon={LayoutGrid}
                label="Apps"
                isActive={activeTab === "apps"}
                onClick={() => setActiveTab("apps")}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-40 h-12">
          <UserActionPanel session={session} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow">
        {activeTab === "wallet" && (
          <div className="container mx-auto p-4">
            <UserWalletDashboard session={session} />
          </div>
        )}
        {activeTab === "apps" && <div>Apps content goes here</div>}
      </div>

      {/* Bottom tab bar for mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 z-10 flex h-[54px] w-full items-center border-t border-t-gray-200 bg-white">
        <div
          className="flex w-1/2 flex-col items-center justify-center"
          onClick={() => setActiveTab("wallet")}
        >
          <Wallet
            className={`h-5 w-5 ${
              activeTab === "wallet" ? "text-blue-500" : "text-gray-700"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              activeTab === "wallet" ? "text-blue-500" : "text-gray-700"
            }`}
          >
            Wallet
          </span>
        </div>
        <div
          className="flex w-1/2 flex-col items-center justify-center"
          onClick={() => setActiveTab("apps")}
        >
          <LayoutGrid
            className={`h-5 w-5 ${
              activeTab === "apps" ? "text-blue-500" : "text-gray-700"
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              activeTab === "apps" ? "text-blue-500" : "text-gray-700"
            }`}
          >
            Apps
          </span>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{
  value: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 h-full w-full rounded-sm transition-colors ${
      isActive ? "bg-white text-gray-800" : "text-white hover:bg-white/10"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export default LoginAppbar;
