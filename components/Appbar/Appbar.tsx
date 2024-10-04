import Link from "next/link";
import Logo from "../icons/Logo";
import { auth } from "@/auth";
import SignIn from "../auth/signin-button";
import { Menu } from "lucide-react";

export default async function Appbar() {
  return (
    <header className="w-full py-4 border-b fixed top-0 left-0 right-0 bg-white z-50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between md:justify-start md:border md:p-2.5 rounded-xl max-w-2xl lg:max-w-4xl mx-auto md:bg-white/90 md:backdrop-blur-sm">
          <div className="flex items-center">
            <div className="border h-10 w-10 rounded-lg inline-flex items-center justify-center mr-4">
              <Logo className="h-8 w-8" fill="#000000" />
            </div>
          </div>
          <nav className="hidden md:flex gap-4 lg:gap-8 text-sm flex-grow justify-center">
            <Link
              className="text-black/70 hover:text-black transition"
              href="#"
            >
              Products
            </Link>
            <Link
              className="text-black/70 hover:text-black transition"
              href="#"
            >
              API & Docs
            </Link>
            <Link
              className="text-black/70 hover:text-black transition"
              href="#"
            >
              FAQ
            </Link>
            <Link
              className="text-black/70 hover:text-black transition"
              href="#"
            >
              Company
            </Link>
            <Link
              className="hidden lg:block text-black/70 hover:text-black transition"
              href="#"
            >
              Blogs
            </Link>
          </nav>
          <div className="flex items-center">
            <SignIn />
          </div>
        </div>
      </div>
    </header>
  );
}
