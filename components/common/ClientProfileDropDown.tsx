"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserImage from "@/components/Appbar/UserImage";
import { handleSignOut } from "@/actions";

interface ClientProfileDropDownProps {
  triggerContent: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

const ClientProfileDropDown = ({
  triggerContent,
  userName,
  userEmail,
  userImage,
}: ClientProfileDropDownProps) => {
  const router = useRouter();

  const dropDownData = [
    {
      name: "Profile",
      icon: <UserRound size={15} />,
      href: "/profile",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-[3rem] flex items-center p-[0.2rem] justify-center h-[2rem] transition outline-none">
        {triggerContent}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="translate-y-8 scale-110 -translate-x-10 shadow-lg bg-white">
        <DropdownMenuLabel className="flex gap-4 items-center">
          <div className="!w-[2rem] flex items-center p-[0.2rem] justify-center !h-[2rem]">
            {!userImage ? (
              <div className="p-1 border-2 rounded-full border-[#1a1a1a]">
                <UserRound />
              </div>
            ) : (
              <UserImage image={userImage} />
            )}
          </div>

          <div className="flex flex-col">
            <span className="max-w-[200px]">{userName}</span>
            <span className="text-[0.8rem] max-w-[200px] text-gray-400 break-all">
              {userEmail}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {dropDownData.map((item, index) => (
          <DropdownMenuItem
            key={index}
            className="flex gap-2 cursor-pointer text-black/70 hover:text-black transition"
            onClick={() => router.push(item.href)}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await handleSignOut();
            router.refresh();
          }}
          className="flex gap-2 cursor-pointer text-black/70 hover:text-black transition"
        >
          <LogOut size={15} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientProfileDropDown;
