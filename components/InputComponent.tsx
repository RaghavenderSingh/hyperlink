import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { ArrowUpDown } from "lucide-react";
import { convertUsdToSol } from "@/lib/KeyStore";

type QuickAmount = 1 | 2 | 5;

interface CustomTextFieldProps {
  setAmount: (value: string) => void;
  amount: string;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  setAmount,
  amount,
}) => {
  const [value, setValue] = useState(amount || "");
  const [solValue, setSolValue] = useState("0");
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeButton, setActiveButton] = useState<QuickAmount | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const formatValue = (val: string): string => {
    const numericValue = parseFloat(val.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue) || numericValue === 0) {
      return "";
    }
    return numericValue.toFixed(2);
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(newValue);
    setAmount(newValue);
    if (newValue === "") {
      setSolValue("0");
    } else {
      const sol = await convertUsdToSol(newValue);
      setSolValue(sol);
    }
  };

  const handleToggle = () => {
    setIsFlipped(!isFlipped);
  };

  const handleQuickAmount = async (amount: QuickAmount) => {
    const newValue = amount.toString();
    setValue(newValue);
    setAmount(newValue);
    setActiveButton(amount);
    const sol = await convertUsdToSol(newValue);
    setSolValue(sol);
  };
  //fix this
  useEffect(() => {
    const updateSolValue = async () => {
      if (value) {
        const sol = await convertUsdToSol(value);
        setSolValue(sol);
      } else {
        setSolValue("0");
      }
    };
    updateSolValue();
  }, [value]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const width = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${Math.max(width + 2, 20)}px`;
    }
  }, [value]);

  const isZeroValue = parseFloat(value) === 0 || value === "";

  return (
    <div className="w-full">
      <div className="relative w-full border rounded-t-lg border-gray-200 bg-white p-4 border-b-0 min-h-[80px] flex items-center justify-center">
        <div className="flex items-center justify-center text-3xl w-full py-2 text-center font-light">
          <span
            className={`transition-opacity duration-200 ${
              isZeroValue ? "opacity-30" : "opacity-100"
            }`}
          >
            $
          </span>
          <div className="relative inline-block">
            <span
              ref={spanRef}
              className="invisible absolute left-0 top-0 text-3xl font-light"
              aria-hidden="true"
            >
              {value || "0"}
            </span>
            <input
              ref={inputRef}
              className="text-3xl text-center border-none outline-none"
              style={{ minWidth: "20px" }}
              inputMode="decimal"
              placeholder="0"
              value={value}
              onChange={handleInputChange}
            />
          </div>
          <span
            className={`transition-opacity duration-200 ${
              isZeroValue ? "opacity-30" : "opacity-100"
            }`}
          >
            USD
          </span>
        </div>
        <div className="absolute bottom-2 text-gray-400 text-xs">
          ~{solValue} SOL
        </div>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-200"
          onClick={handleToggle}
        >
          <ArrowUpDown
            size={14}
            className={`transform ${
              isFlipped ? "rotate-180" : ""
            } transition-transform duration-200`}
          />
        </button>
      </div>
      <div className="flex w-full">
        {[1, 2, 5].map((amount) => (
          <button
            key={amount}
            className={`
              flex-1 py-2 border border-gray-200
              ${amount === 1 ? "rounded-bl-lg" : ""}
              ${amount === 5 ? "rounded-br-lg" : ""}
              ${amount !== 1 ? "border-l-0" : ""}
              ${
                activeButton === amount
                  ? "bg-gray-200"
                  : "bg-white hover:bg-gray-100 active:bg-gray-200"
              }
              transition-colors duration-200
            `}
            onClick={() => handleQuickAmount(amount as QuickAmount)}
          >
            ${amount}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomTextField;
