import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenWithBalance } from "@/lib/types";
import TokenLogo from "./TokenLogo";

interface TokenListProps {
  tokenBalances: TokenWithBalance[];
}

const TokenList: React.FC<TokenListProps> = ({ tokenBalances }) => (
  <>
    {tokenBalances.length > 0 ? (
      <div className="space-y-4">
        {tokenBalances.map((token, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <TokenLogo src={token?.logoURI ?? ""} alt={token.name} />
              <div>
                <p className="font-semibold text-gray-700">{token.symbol}</p>
                <p className="text-sm text-gray-500">{token.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">
                {parseFloat(token.balance).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                ${parseFloat(token.usdBalance).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-10 leading-6">
        <p className="font-bold text-gray-700 mobile:pb-1 mobile:text-[20px]">
          You don't have any assets yet!
        </p>
        <p className="mb-3 text-sm text-gray-500 mobile:text-base">
          Start by buying or depositing funds:
        </p>
        <Button>
          <Plus className="h-5 w-5 mr-1" />
          Add Funds
        </Button>
      </div>
    )}
  </>
);

export default TokenList;
