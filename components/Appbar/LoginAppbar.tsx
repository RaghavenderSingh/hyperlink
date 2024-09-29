"use client";
import React, { useState } from "react";
import Logo from "../icons/Logo";
import OptionSheet from "./OptionSheet";
import { LayoutGrid, Wallet, LucideIcon } from "lucide-react";
import UserWalletDashboard from "../WalletCard/WalletCard";
import { Session } from "next-auth";

interface TabButtonProps {
  value: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}
type UserInfoProps = {
  session: Session | null;
};

const TabButton: React.FC<TabButtonProps> = ({
  value,
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 h-full rounded-sm transition-colors ${
      isActive ? "bg-white text-gray-800" : "text-white hover:bg-white/10"
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

const LoginAppbar: React.FC<UserInfoProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState<"wallet" | "apps">("wallet");

  return (
    <div>
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center justify-center w-40 h-12 border rounded-xl bg-white/90 backdrop-blur-sm">
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
          <OptionSheet />
        </div>
      </div>
      <div className="mt-4">
        {activeTab === "wallet" && (
          <div className="container mx-auto p-4">
            <UserWalletDashboard session={session} />
          </div>
        )}
        {activeTab === "apps" && <div>hii</div>}
      </div>
    </div>
  );
};

export default LoginAppbar;
