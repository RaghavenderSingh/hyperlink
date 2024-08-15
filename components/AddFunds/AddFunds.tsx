"use client";
import React, { useState } from "react";

import ExternalAccount from "./ExternalAccount";
import FundingOptions from "./FundingOptions";
import ConnectedWallet from "./ConnectedWallet";

export default function AddFunds() {
  const [step, setStep] = useState<Number>(0);
  const handleSteps = (step: Number) => {
    switch (step) {
      case 0:
        return <FundingOptions setStep={setStep} />;
      // case 1:
      //   return <BankCard />;
      case 2:
        return <ExternalAccount setStep={setStep} />;
      // case 3:
      //   return <ToAddress />;
      // default:
      //   return <BankCard />;
      case 4:
        return <ConnectedWallet setStep={setStep} />;
    }
  };
  return handleSteps(step);
}
