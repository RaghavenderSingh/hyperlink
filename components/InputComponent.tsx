import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  IconButton,
  Button,
  HStack,
  chakra,
} from "@chakra-ui/react";
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
  const [value, setValue] = useState("");
  const [solValue, setSolValue] = useState<string>(amount || "0");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<QuickAmount | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const formatValue = (val: string): string => {
    const numericValue = parseFloat(val.replace(/[^0-9.-]+/g, ""));
    if (isNaN(numericValue) || numericValue === 0) {
      return "";
    }
    return numericValue.toString();
  };

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(newValue);
    setValue(newValue);
    setCursorPosition(e.target.selectionStart || 0);
    const sol = await convertUsdToSol(newValue);
    setSolValue(sol);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setValue(formatValue(value));
  };

  const handleToggle = () => {
    setIsFlipped(!isFlipped);
  };

  const handleQuickAmount = async (amount: QuickAmount) => {
    const newValue = formatValue(amount.toString());
    setValue(newValue);
    setActiveButton(amount);
    setAmount(newValue);

    const sol = await convertUsdToSol(newValue);
    setSolValue(sol);
  };

  useEffect(() => {
    if (inputRef.current && isEditing) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      const numericValue = parseFloat(value);
      if ([1, 2, 5].includes(numericValue)) {
        setActiveButton(numericValue as QuickAmount);
      } else {
        setActiveButton(null);
      }
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth}px`;
    }
  }, [value]);

  const isZeroValue = parseFloat(value) === 0 || value === "";

  return (
    <Box>
      <Flex
        position="relative"
        className="w-full border rounded-t-lg border-gray-200 bg-white p-4 border-b-0 border-b-transparent"
        minH="80px"
        alignItems="center"
        justifyContent="center"
        borderWidth={1}
        borderColor="gray.200"
        bg="white"
        py={1}
        pb={5}
        roundedTop="lg"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
          w="full"
          py={2}
          textAlign="center"
          fontWeight="light"
        >
          <Text transition="opacity 0.2s" opacity={isZeroValue ? 0.3 : 1}>
            $
          </Text>
          <Box position="relative" display="inline-block">
            <chakra.span
              ref={spanRef}
              visibility="hidden"
              position="absolute"
              whiteSpace="pre"
            >
              {isEditing ? value : formatValue(value) || "0"}
            </chakra.span>
            <Input
              ref={inputRef}
              className="text-3xl"
              inputMode="decimal"
              textAlign="center"
              border="none"
              outline="none"
              _disabled={{ opacity: 1 }}
              minW="2ch"
              placeholder="0"
              value={isEditing ? value : formatValue(value)}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </Box>
          <Text transition="opacity 0.2s" opacity={isZeroValue ? 0.3 : 1}>
            USD
          </Text>
        </Flex>
        <Text position="absolute" bottom={2} className="text-gray-400 text-xs">
          ~{solValue} SOL
        </Text>
        <IconButton
          icon={
            <div className="bg-gray-200 p-2 rounded-full ml-2">
              {" "}
              <ArrowUpDown size={14} />
            </div>
          }
          aria-label="Toggle"
          position="absolute"
          right={2}
          top="50%"
          transform={`translateY(-50%) ${isFlipped ? "rotate(180deg)" : ""}`}
          bg="gray.100"
          size="sm"
          color="gray.600"
          _hover={{ bg: "gray.200", color: "gray.800" }}
          _active={{ bg: "gray.300" }}
          onClick={handleToggle}
          transition="all 0.2s"
        />
      </Flex>
      <HStack spacing={0} w="full">
        {[1, 2, 5].map((amount) => (
          <Button
            key={amount}
            flex={1}
            roundedTop="none"
            roundedBottomLeft={amount === 1 ? "lg" : undefined}
            roundedBottomRight={amount === 5 ? "lg" : undefined}
            borderWidth={1}
            borderColor="gray.200"
            borderLeft={amount !== 1 ? 0 : undefined}
            py={2}
            bg={activeButton === amount ? "gray.200" : "white"}
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={() => handleQuickAmount(amount as QuickAmount)}
            transition="background-color 0.2s"
          >
            ${amount}
          </Button>
        ))}
      </HStack>
    </Box>
  );
};

export default CustomTextField;
