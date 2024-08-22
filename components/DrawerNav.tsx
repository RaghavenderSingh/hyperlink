import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlignJustify,
  Receipt,
  ScanText,
  Sparkles,
  Star,
  Stars,
  Wallet,
} from "lucide-react";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export function SheetDemo({
  profileImage,
  signOut,
  name,
  email,
}: {
  profileImage: string;
  signOut: () => Promise<void>;
  name: string;
  email: string;
}) {
  console.log("info", name, email);
  function getFirstWords(input: string) {
    const words = input.split(" "); // Split the input into an array of words

    // Function to capitalize the first letter of a word
    const capitalize = (word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    // Check if the input starts with "Raghavender Singh"
    if (words.length >= 2) {
      return `${capitalize(words[0])} ${capitalize(words[1])}`; // Return "Raghavender Singh"
    } else {
      return capitalize(words[0]); // Return the first word capitalized
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <img
            className="rounded-full"
            alt=""
            src={profileImage}
            width={30}
            height={30}
          />
          <AlignJustify className="ml-2" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        {/* <SheetHeader>
          <div className="flex w-full items-center justify-start  text-left">
            <div>
              <Image src={logo} alt="logo" width={50} height={50} />
            </div>
            <div className="font-bold text-[22px] ">HyperLink</div>
          </div>
        </SheetHeader> */}
        <div className="grid gap-4 py-4">
          <div className="grid  items-center gap-4">
            <div className="flex w-full items-center justify-start gap-3">
              <div>
                <Avatar className="h-[60px] w-[60px]">
                  <AvatarImage
                    height={"60px"}
                    width={"60px"}
                    src={profileImage}
                    alt=""
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className=" text-left font-bold text-gray-600">
                  {getFirstWords(name)}
                </div>
                <div className="break-all text-left text-gray-600">{email}</div>
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
                    <p>The world's simplest wallet</p>
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
                    <p>Send crypto even if they don't have a wallet.</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={signOut} type="submit">
              Logout
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
