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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          {localSelectedToken?.name}
        </Button>
      </DialogTrigger>
      <DialogContent className="width-full">
        <div className="my-4">
          {SUPPORTED_TOKENS.map((token) => (
            <Button
              key={token.name}
              onClick={() => {
                setLocalSelectedToken(token);
                onSelect(token);
                setOpen(false);
              }}
              className=" w-full text-left mb-2 flex items-start gap-2"
            >
              <img src={token.image} alt={token.name} className="w-6 h-6" />
              {token.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
