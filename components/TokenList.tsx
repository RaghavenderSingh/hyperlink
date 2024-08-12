import { TokenWithbalance } from "@/app/hooks/useTokens";

export function TokenList({ tokens }: { tokens: TokenWithbalance[] }) {
  return (
    <div>
      {tokens.map((t) => (
        <TokenRow key={t.name} token={t} />
      ))}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithbalance }) {
  return (
    <div className="flex justify-between pb-2">
      <div className="flex">
        <div className="flex justify-center items-center">
          <img
            src={token.image}
            className="h-[40px] w-[40px] object-cover mr-3"
          />
        </div>
        <div>
          <div className="font-bold">{token.name}</div>
          <div className="font-slim">
            1 {token.name} = ~${token.price}
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="font-bold flex justify-end">{token.usdBalance}</div>
          <div className="font-slim flex justify-end">{token.balance}</div>
        </div>
      </div>
    </div>
  );
}
