import React from "react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";
// import eth from "@/assets/eth.svg";
// import sol from "@/assets/solana.svg";
import Image from "next/image";
import logo from "../public/assets/images/logo.png";
import { CardDemo } from "./AnimatedCard";
import BouncingDotsLoader from "./BouncingDotsLoader";

interface IHeader {
  signIn: () => Promise<void>;
  loading: boolean;
}

const Hero = (props: IHeader) => {
  const { signIn, loading } = props;
  return (
    <section className="items-center  mt-18">
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
          <Button onClick={signIn} className="pl-2 py-6 text-sm md:text-base">
            {loading ? (
              <div>
                <BouncingDotsLoader />
              </div>
            ) : (
              <span className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-lg border bg-white text-black">
                  <FaGoogle />
                </div>
                Sign up with Google
              </span>
            )}
          </Button>
          <Button className="pl-2 py-6 text-sm md:text-base">
            <span className="flex items-center gap-2">
              <div className="px-[6px] py-[7px] rounded-lg border bg-white text-black">
                <Image src={logo} alt="logo" width={32} height={32} />
              </div>
              Create Hyper Link
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
