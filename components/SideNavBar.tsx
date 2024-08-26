"use client";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlignJustify,
  Receipt,
  ScanText,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import LoginButton from "./LoginButton";
import { useAuth } from "@/context/AuthContext";

export function SideNavBar() {
  const { state } = useAuth();
  function getFirstWords(input: string) {
    console.log("input", input);
    const words = input?.split(" ");
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    if (words?.length >= 2) {
      return `${capitalize(words[0])} ${capitalize(words[1])}`;
    } else {
      return capitalize(words[0]);
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <img
            className="rounded-full"
            alt=""
            src={state.user?.profileImage}
            width={30}
            height={30}
          />
          <AlignJustify className="ml-2" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <div className="grid gap-4 py-4">
          <div className="grid  items-center gap-4">
            <div className="flex w-full items-center justify-start gap-3">
              <div>
                <Avatar className="h-[60px] w-[60px]">
                  <AvatarImage
                    height={"60px"}
                    width={"60px"}
                    src={state.user?.profileImage}
                    alt=""
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className=" text-left font-bold text-gray-600">
                  {state.user?.name ?? getFirstWords(state.user?.name)}
                </div>
                <div className="break-all text-left text-gray-600">
                  {state.user?.email}
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-start gap-1 text-left mt-4">
              <Button>
                <span>
                  <ScanText />
                </span>
                <span>Wallet Address</span>
              </Button>
              <Button>
                <span>
                  <Receipt />
                </span>
                <span>Crowdfund Link</span>
              </Button>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-bold text-gray-500">Products</p>
            </div>
            <div className="flex flex-col w-full items-center justify-start gap-4 text-left mt-4">
              <Button className="w-full p-4 h-auto" variant={"outline"}>
                <div className="flex w-full items-center justify-start gap-2 text-left">
                  <div>
                    {" "}
                    <Wallet />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Hyperlink wallet</p>
                    <p>{"The world's simplest wallet"}</p>
                  </div>
                </div>
              </Button>
              <Button className="w-full p-4 h-auto" variant={"outline"}>
                <div className="flex w-full items-center justify-start gap-2 text-left">
                  <div>
                    {" "}
                    <Sparkles />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Create a HyperLink</p>
                    <p>{"Send crypto even if they don't have a wallet."}</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <LoginButton />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
