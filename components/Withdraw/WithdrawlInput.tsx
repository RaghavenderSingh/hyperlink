import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

type setAmountProps = {
  setAmount: (value: string) => void;
};

const CustomTextField = ({ setAmount }: setAmountProps) => {
  const [value, setValue] = useState<string>("");
  const [solValue, setSolValue] = useState<string>("0");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const formatValue = (val: string): string => {
    const numericValue = parseFloat(val.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue) || numericValue === 0) {
      return "";
    }
    return numericValue.toString();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    setValue(newValue);
    setCursorPosition(e.target.selectionStart || 0);
    updateSolValue(newValue);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const formattedValue = formatValue(value);
    setValue(formattedValue);
    if (formattedValue === "") {
      setAmount("0");
      setSolValue("0");
    }
  };

  const handleToggle = () => {
    setIsFlipped(!isFlipped);
  };

  const updateSolValue = async (usdValue: string) => {
    if (usdValue === "" || parseFloat(usdValue) === 0) {
      setSolValue("0");
      setAmount("0");
      return;
    }
    const outputMint = "So11111111111111111111111111111111111111112";
    const inputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    // Convert amount to smallest unit (USDC is 6 decimals, so multiply by 1e6)
    const amount = (Number(usdValue) * 1e6).toString();

    try {
      const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;

      const response = await fetch(url);
      const data = await response.json();
      setAmount(data.outAmount);
      setSolValue((data.outAmount / LAMPORTS_PER_SOL).toFixed(4));
    } catch (error) {
      console.error("Error fetching SOL value:", error);
      setSolValue("Error");
    }
  };

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, isEditing]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth}px`;
    }
  }, [value]);

  const isZeroValue = value === "";

  return (
    <div className="relative mx-auto my-0 w-full">
      <div className="relative flex min-h-[80px] items-center justify-center space-x-1 border border-gray-200 bg-white py-1 pb-5 rounded-lg">
        <div className="flex items-center justify-center text-3xl w-full py-2 text-center font-light">
          <span
            className={`transition-opacity duration-200 ${
              isZeroValue ? "opacity-30" : "opacity-100"
            }`}
          >
            $
          </span>
          <div className="relative inline-block">
            <span ref={spanRef} className="invisible absolute whitespace-pre">
              {isEditing ? value : formatValue(value) || "0"}
            </span>
            <input
              ref={inputRef}
              inputMode="decimal"
              className="text-center border-none outline-none disabled:opacity-100 min-w-[2ch]"
              placeholder="0"
              type="text"
              value={isEditing ? value : formatValue(value)}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
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
        <div className="absolute bottom-2 text-xs text-gray-400">
          <span>~{solValue} SOL</span>
        </div>
        <button
          className={`absolute right-2 top-1/2 -translate-y-1/2 flex cursor-pointer select-none items-center justify-center rounded-full bg-gray-100 p-2 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-800 active:bg-gray-300 h-8 w-8 transition duration-200 ease-out ${
            isFlipped ? "rotate-180" : ""
          }`}
          onClick={handleToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21 16-4 4-4-4" />
            <path d="M17 20V4" />
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomTextField;
