import React, { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  {
    value: "SOL",
    label: "SOL",
    Symbol:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
];

export function Combobox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(frameworks[0].value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-[50px] justify-between"
        >
          <div className="flex items-center justify-center flex-1">
            {value ? (
              <div className="flex items-center gap-2">
                <img
                  className="rounded-full"
                  src={
                    frameworks.find((framework) => framework.value === value)
                      ?.Symbol
                  }
                  alt="Token"
                  width={20}
                  height={20}
                />
                <span>
                  {
                    frameworks.find((framework) => framework.value === value)
                      ?.label
                  }
                </span>
              </div>
            ) : (
              "Select Token..."
            )}
          </div>
          <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search Token..." className="h-9" />
          <CommandList>
            <CommandEmpty>No Token found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      className="rounded-full"
                      src={framework.Symbol}
                      alt="Token"
                      width={20}
                      height={20}
                    />
                    <span>{framework.label}</span>
                  </div>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
