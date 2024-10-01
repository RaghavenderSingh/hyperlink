import React from "react";
import Image from "next/image";
import { Session } from "next-auth";
import { Card, CardContent } from "@/components/ui/card";
import WalletOverview from "./WalletOverview";

interface DashboardHeaderProps {
  session: Session | null;
  totalBalanceUSD: number;
  publicKey: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  session,
  totalBalanceUSD,
  publicKey,
}) => (
  <Card className="rounded-xl bg-white p-5 sm:p-8">
    <CardContent className="p-0">
      <h3 className="mb-6 w-full text-left text-base font-bold text-gray-800 mobile:text-[26px]">
        <div className="flex items-center justify-start gap-2 mobile:gap-4">
          <Image
            alt="user avatar"
            className="rounded-full border border-gray-200 h-[68px] w-[68px] mobile:h-[68px] mobile:w-[68px]"
            src={session?.user?.image ? session?.user?.image : ""}
            width={68}
            height={68}
          />
          <p className="text-xl font-bold text-gray-800 mobile:text-[26px]">
            Welcome back, {session?.user?.name}!
          </p>
        </div>
      </h3>
      <div className="mt-6 pt-6 border-gray-200">
        <WalletOverview
          totalBalanceUSD={totalBalanceUSD}
          publicKey={publicKey}
        />
      </div>
    </CardContent>
  </Card>
);

export default DashboardHeader;
