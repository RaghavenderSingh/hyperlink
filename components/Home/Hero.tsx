"use client";
import React from "react";
import { Button } from "../ui/button";
import { CardDemo } from "../AnimatedCard";
import { FaGoogle } from "react-icons/fa6";
import { signInAction } from "@/lib/signInAction";

export default function Hero() {
  return (
    <section className="items-center  mt-40">
      <div className="container mx-auto px-4">
        <div className="max-w-[600px] lg:max-w-[900px] mx-auto">
          <div>
            <CardDemo />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center">
            Experience the future of crypto today
          </h1>

          <p className="text-lg tracking-tighter text-black/70 text-center mt-5">
            Effortlessly create a wallet using just your Google Account.
          </p>
        </div>
        <div className="flex gap-3 items-center justify-center mt-5">
          <form action={signInAction}>
            <Button className="flex items-center gap-2 px-[20px] py-[23px]">
              Login
              <FaGoogle />
            </Button>
          </form>
          {/* <Button
            onClick={() => router.push("/create")}
            className="pl-2 py-6 text-sm md:text-base"
          >
            <span className="flex items-center gap-2">
              <div className="px-[6px] py-[7px] rounded-lg border bg-white text-black">
                <Logo className="h-2 w-2" />
              </div>
              Create Hyper Link
            </span>
          </Button> */}
        </div>
      </div>
    </section>
  );
}
