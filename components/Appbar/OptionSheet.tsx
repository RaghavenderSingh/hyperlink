import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { handleSignOut } from "@/actions";

export default function OptionSheet() {
  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="flex items-center justify-between gap-2 p-1 px-5 rounded-lg border border-black">
            <div className="flex items-center justify-center gap-2">
              <div className="relative flex select-none items-center justify-center">
                <Image
                  width={12}
                  height={12}
                  alt="user avatar"
                  className="rounded-full border border-[#E0E7EB] mr-1 h-9 w-9 mobile:mr-2 mobile:h-[30px] mobile:w-[30px] mobile:min-w-[30px] mobile:max-w-[30px]"
                  src="https://lh3.googleusercontent.com/a/ACg8ocJxD_8n8vDTMw5HmxW4BzvunTa6FWlwfOJ4pM-gwtM2SNTFcLcpWg=s96-c"
                  draggable="false"
                />
              </div>
              <div className="relative h-5 min-h-5 w-5 min-w-5">
                <Menu size={20} />
              </div>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}
