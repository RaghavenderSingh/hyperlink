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
import { AlignJustify } from "lucide-react";

export function SheetDemo({
  profileImage,
  signOut,
}: {
  profileImage: string;
  signOut: () => Promise<void>;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <img
            className=" rounded-full"
            alt=""
            src={profileImage}
            width={30}
            height={30}
          />
          <AlignJustify className="ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4"></div>
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
