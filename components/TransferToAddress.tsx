import CustomTextField from "./CustomTextField";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
type FundingOptionsProps = {
  setStep: (value: number) => void;
  setTransferAmount: (value: string) => void;
  setRecipentPublicKey: (value: string) => void;
  transferAmount: string;
  recipentPublicKey: string;
  handleTransferToPublickkey: () => void;
};

export default function TransferToAddress({
  setStep,
  setTransferAmount,
  setRecipentPublicKey,
  handleTransferToPublickkey,
  transferAmount,
  recipentPublicKey,
}: FundingOptionsProps) {
  return (
    <div>
      <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
        <div
          onClick={() => setStep(1)}
          className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{" "}
          <span>Back</span>
        </div>
        <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
          <CustomTextField
            setAmount={setTransferAmount}
            amount={transferAmount}
          />
        </div>
        <Input
          onChange={(e) => setRecipentPublicKey(e.target.value)}
          placeholder="Public Key"
          className="mt-10"
          value={recipentPublicKey}
        />
        <Button
          className="mt-1 w-full"
          disabled={transferAmount === "" ? true : false}
          onClick={() => handleTransferToPublickkey()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
