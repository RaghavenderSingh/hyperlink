import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SUPPORTED_TOKENS, TokenDetails } from "@/lib/tokens";

export function TokenListDialog({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) {
  const [localSelectedToken, setLocalSelectedToken] =
    useState<TokenDetails>(selectedToken);
  const [open, setOpen] = useState(false);
  console.log(localSelectedToken)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <img src={localSelectedToken?.image} alt={localSelectedToken?.name} className="w-6 h-6 mr-2"></img>
          {localSelectedToken?.name}
          <div className="w-2 h-2 ml-2 text-white flex items-center">
            <svg
              className="w-2 h-2 text-white"  // Adjust size and margin as needed
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="width-full">
        <div className="my-4">
          {SUPPORTED_TOKENS.map((token) => (
            <div
              key={token.name}
              onClick={() => {
                setLocalSelectedToken(token);
                onSelect(token);
                setOpen(false);
              }}
              className="cursor-pointer hover:bg-gray-200 text-left pl-4 pb-4 pt-4 flex items-start gap-2"
            >
              <img src={token.image} alt={token.name} className="w-6 h-6" />
              {token.name}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
