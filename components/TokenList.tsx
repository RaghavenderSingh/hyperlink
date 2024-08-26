import { TokenWithBalance } from "@/app/hooks/useTokens";
import { Button } from "./ui/button";

export function TokenList({
  tokens,
  navigator,
}: {
  tokens: TokenWithBalance[];
  navigator: (tabName: string) => void;
}) {
  const validTokens = tokens.filter((t) => t.balance !== "0.00");
  return (
    <div>
      {validTokens.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <span className="font-bold text-2xl pt-4 pb-1">
            {"You don't have any assets yet!"}
          </span>
          <span className="text-medium pb-4">
            Start by buying or depositing funds:
          </span>
          <Button onClick={() => navigator("addFunds")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Funds
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {validTokens.map((t) => (
            <TokenRow key={t.name} token={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithBalance }) {
  return (
    <div className="flex justify-between pb-2 mt-2">
      <div className="flex">
        <div className="flex justify-center items-center">
          <img
            src={token.image}
            className="h-[40px] w-[40px] object-cover mr-3 rounded-full"
          />
        </div>
        <div>
          <div className="font-bold">
            {token.name === "SOL" ? "Solana" : token.name}
          </div>
          <div className="text-slate-500 pt-1 text-sm">
            1 {token.name} = ~${token.price}
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="font-slim flex justify-end">
            {token.balance} <span className="text-slate-500">{token.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
