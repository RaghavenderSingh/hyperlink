import React from "react";
import { Wallet, TextCursorInput, ArrowRight, LucideIcon } from "lucide-react";

interface TransferOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

const TransferOption = ({
  icon: Icon,
  title,
  description,
  onClick,
}: TransferOptionProps) => (
  <button className="group w-full overflow-hidden text-left" onClick={onClick}>
    <div className="flex w-full items-center justify-start whitespace-normal break-words p-4">
      <div className="flex w-full justify-start gap-3 items-start">
        <div className="flex w-5 items-center justify-center text-grey-800 pt-1">
          <Icon size={22} />
        </div>
        <div className="flex flex-col items-start w-full">
          <h3 className="text-left text-sm font-semibold text-grey-800 xs:text-base">
            {title}
          </h3>
          <div className="text-left text-xs font-normal text-grey-500">
            {description}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <ArrowRight className="h-5 w-5 text-grey-800" />
      </div>
    </div>
  </button>
);

interface TransferOptionsProps {
  options: Array<
    Omit<TransferOptionProps, "onClick"> & { onClick: () => void }
  >;
}

const TransferOptions = ({ options }: TransferOptionsProps) => (
  <div className="mt-5 overflow-hidden rounded-lg border border-grey-100 bg-white">
    {options.map((option, index) => (
      <React.Fragment key={index}>
        <TransferOption {...option} />
        {index < options.length - 1 && (
          <hr className="border-t border-grey-100" />
        )}
      </React.Fragment>
    ))}
  </div>
);

export { TransferOptions };
