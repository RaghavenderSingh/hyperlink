"use client";
import React, { useState } from "react";
import { Ban, ArrowDown } from "lucide-react";

const IntegratedSigningHero = () => {
  const [activeDemo, setActiveDemo] = useState("demo-trading");

  const demos = [
    { id: "demo-siws", title: "Sign in With Wallet" },
    { id: "demo-trading", title: "Trading" },
    { id: "demo-lending", title: "Lending" },
    { id: "demo-purchasing", title: "Purchasing" },
  ];

  return (
    <div className=" px-3">
      <div className="flex flex-col items-center rounded-t-[20px] px-3 py-[60px] bg-gradient-to-b from-black via-gray-900/20 to-transparent">
        {/* Hero Text Section */}
        <div className="mx-auto inline-flex w-full max-w-[452px] flex-wrap items-center justify-center gap-y-3 text-center text-[24px] font-bold leading-tight text-white md:max-w-[890px] lg:text-[40px]">
          Ditch the
          <div className="mx-3 flex h-[56px] items-center justify-center gap-2.5 rounded-full bg-white/10 px-5 text-white lg:h-[72px]">
            <Ban className="h-6 w-6" />
            <p>browser extension</p>
          </div>
          <div className="mx-3 flex h-[56px] items-center justify-center gap-2.5 rounded-full bg-white/10 px-5 text-white lg:h-[72px]">
            <Ban className="h-6 w-6" />
            <p>seed phrase</p>
          </div>
          and
          <div className="mx-3 flex h-[56px] items-center justify-center gap-2.5 rounded-full bg-white/10 px-5 text-white lg:h-[72px]">
            <Ban className="h-6 w-6" />
            <p>clunky popups</p>
          </div>
        </div>

        {/* Arrow Section */}
        <div className="my-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <ArrowDown className="h-8 w-8 text-white/60 animate-bounce" />
            <ArrowDown className="h-8 w-8 text-white/40 animate-bounce" />
            <ArrowDown className="h-8 w-8 text-white/20 animate-bounce" />
          </div>
        </div>

        {/* Feature Text */}
        <p className="mx-auto w-full max-w-[890px] text-center text-[24px] font-bold leading-tight text-white/90 lg:text-[40px]">
          Say hello to embedded signing, wallet UX that
          <span className="text-[#e82523]">
            {" "}
            feels like Apple Pay on mobile
          </span>
        </p>

        <p className="mb-6 mt-5 text-xs font-bold text-white/60 md:text-sm">
          MOBILE IS NO LONGER A SECOND-CLASS CITIZEN
        </p>

        <p className="mx-auto w-full max-w-[452px] text-center text-base font-medium text-white/70 md:max-w-[890px] md:text-[24px]">
          Its time to reach mass adoption. Say goodbye to popups. Signing is
          smooth, integrated, and hassle-free. Signing on mobile and desktop
          completely redefines wallet UX.
        </p>

        <div className="mx-auto mt-[46px] max-w-[1200px] md:mt-[120px]">
          <div className="flex w-full flex-wrap items-start justify-center gap-11">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="flex flex-col items-center justify-center gap-3"
                onMouseEnter={() => setActiveDemo(demo.id)}
                onTouchStart={() => setActiveDemo(demo.id)}
              >
                <div
                  className={`w-[231.606px] h-[480px] flex-shrink-0 cursor-pointer rounded-[46px] border-[10px] border-white bg-gray-900 transition-all duration-150 ease-out ${
                    activeDemo === demo.id
                      ? "scale-[1.04]"
                      : "scale-[0.95] opacity-70"
                  }`}
                  style={{
                    boxShadow: "0px 1px 25px 0px rgba(0, 0, 0, 0.15)",
                  }}
                />
                <p
                  className={`font-semibold ${
                    activeDemo === demo.id ? "text-black" : "text-gray-500"
                  }`}
                >
                  {demo.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedSigningHero;
