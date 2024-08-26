import { ArrowLeft } from "lucide-react";
import { Combobox } from "../Select";
import { Button } from "../ui/button";
import WithdrawlInput from "./WithdrawlInput";
import BouncingDotsLoader from "../BouncingDotsLoader";
type FundingOptionsProps = {
  setStep: (value: number) => void;
  balance: number;
  setAmount: (value: string) => void;
  handleTransfer: () => void;
  loading: boolean;
};
export default function WalletWithdraw({
  setStep,
  balance,
  setAmount,
  handleTransfer,
  loading,
}: FundingOptionsProps) {
  return (
    <div>
      <div>
        <div className="py-5">
          <div
            onClick={() => setStep(0)}
            className="mb-3.5 mr-auto flex w-max cursor-pointer items-center justify-start gap-1 text-sm font-semibold text-grey-700 hover:opacity-70"
          >
            <span>
              <ArrowLeft className="w-4 h-4" />
            </span>{" "}
            <span>Back</span>
          </div>
          <div className=" flex-col px-15 py-3">
            <h4 className="mb-3 flex w-full items-center justify-start text-left text-2xl font-bold font-sans  text-grey-800 xs:text-[26px]">
              Withdraw to wallet
            </h4>
            <p className="pb-3 text-sm font-normal text-grey-700">
              Specify asset and amount:
            </p>
          </div>
          <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
            <div>
              <Combobox />
            </div>
            <div className="flex w-full items-center justify-center text-left text-sm font-normal text-grey-700 xs:text-base">
              <span className="text-sm font-semibold text-grey-700 ">
                {"TipLink's available SOL:"}{" "}
              </span>
              <span className="text-sm font-bold text-grey-700">
                {balance ? balance : "0.00"}
                {" SOL"}
              </span>
            </div>
            <div>
              <div>
                <WithdrawlInput setAmount={setAmount} />
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={() => setStep(0)} variant={"outline"}>
                  Cancel
                </Button>
                <Button onClick={handleTransfer}>
                  {loading ? <BouncingDotsLoader /> : "Withdraw"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
