import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SUPPORTED_TOKENS, TokenDetails } from "@/lib/tokens";
import { useFetchTokens, TokenApiList } from "@/app/hooks/useFetchTokens";
import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function TokenListDialog({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) {
  const [localSelectedToken, setLocalSelectedToken] =
    useState<TokenDetails>(selectedToken);
  useEffect(() => {
    setLocalSelectedToken(selectedToken);
  }, [selectedToken]);
  const [open, setOpen] = useState(false);
  const { tokens, loading, error } = useFetchTokens()
  return (
    <Dialog open={open} onOpenChange={setOpen} >
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
        {tokens && <AllTokensComponent tokens={tokens} />}
      </DialogContent>
    </Dialog >
  );
}


const AllTokensComponent = ({ tokens }: { tokens: TokenApiList[] }) => {
  const tokenRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTokens, setCurrentTokens] = useState(20);
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [debouncedTokenInput, setDebouncedTokenInput] = useState<string>('');
  const [searchedTokens, setSearchedTokens] = useState<TokenApiList[] | null>(null);


  useEffect(() => {
    if (searchQuery === "") {
      setSearchedTokens(tokens)
    }
    const handler = setTimeout(() => {
      searchQuery && setDebouncedTokenInput(searchQuery);
    }, 1000);

    // Cleanup function to clear the timeout if inputValue changes before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedTokenInput) {
      const searchedTokens = tokens.filter(token =>
        token.name.toLowerCase().includes(debouncedTokenInput.toLowerCase())
      );
      setSearchedTokens(searchedTokens)
    }
    console.log("debouncedTokenInput: " + debouncedTokenInput)
  }, [debouncedTokenInput]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        setCurrentPage(prevPage => prevPage + 1)
      }
    })

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [])

  useEffect(() => {
    setCurrentTokens(20 * currentPage);
  }, [currentPage])

  return (
    <Command>
      <div className="mb-1 mt-4 border shadow-md">
        <input className="w-full rounded-lg p-2" onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type a command or search..." />
      </div>
      <div ref={tokenRef} className="" >
        <CommandList className="border shadow-md">
          {searchedTokens ? searchedTokens.slice(0, currentTokens).map((token) => (
            <CommandItem key={token.address}>
              <img src={token.logoURI} alt={token.name} className="w-6 h-6 mr-2" />
              {token.name}
            </CommandItem>

          )) : tokens && tokens.slice(0, currentTokens).map((token) => (
            <CommandItem key={token.address}>
              <img src={token.logoURI} alt={token.name} className="w-6 h-6 mr-2" />
              {token.name}
            </CommandItem>

          ))}
          <div ref={sentinelRef} />
        </CommandList>
      </div>
    </Command>)
}
