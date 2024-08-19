"use client";
import React, { useState } from "react";
import Options from "./options";
import WalletWithdraw from "./WalletWithdraw";

export default function Withdraw() {
  const [step, setStep] = useState<Number>(0);
  const handleSteps = (step: Number) => {
    switch (step) {
      case 0:
        return <Options setStep={setStep} />;
      // case 1:
      //   return <BankCard />;
      case 2:
        return <WalletWithdraw setStep={setStep} />;
      // case 3:
      //   return <ToAddress />;
      // default:
      //   return <BankCard />;
      case 4:
        return;
      case 5:
        return;
    }
  };
  return handleSteps(step);
}
