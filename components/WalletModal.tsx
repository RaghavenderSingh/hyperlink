import WalletQR from "@/components/WalletQR";
import solcan from "@/public/assets/images/solscan.webp";
import Image from "next/image";
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";

interface WalletModalProps {
  isVisible: boolean;
  onClose: () => void;
  publicKey: string;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isVisible,
  onClose,
  publicKey,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const shortenedKey = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
      <div className="bg-white rounded-lg shadow-lg p-6 w-200">
        <h2 className="text-2xl font-bold mb-4 flex justify-center">
          Your Wallet Address
        </h2>
        <p className="mb-2 flex justify-center">
          You can deposit crypto or NFTs into your account via this
        </p>
        <p className="mb-4 flex justify-center"> Solana wallet address:</p>
        <div className="flex flex-col justify-center items-center rounded-lg bg-gray-100 pt-4 pb-4">
          <div className="mb-8 mt-8">
            <WalletQR text={publicKey} />
          </div>
          <div className="relative box-border flex h-12 w-[95%] cursor-pointer items-center justify-between rounded-full border border-gray-100 bg-white px-5">
            <div className="inline-flex w-full text-center text-foreground">
              <div className="w-full text-center text-foreground">
                {shortenedKey}
              </div>
            </div>
            <input
              id="publickey-input"
              readOnly
              className="sr-only"
              value={publicKey}
            />
            <span className="absolute right-[2px] top-1/2 -translate-y-1/2">
              <Button
                onClick={handleCopy}
                className="flex h-[42px] min-h-[42px] w-[42px] min-w-[42px] items-center justify-center rounded-full "
              >
                <Copy size={16} color="#FFF" />
              </Button>
            </span>
            {isCopied && (
              <div className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                Copied!
              </div>
            )}
          </div>
          <div className="text-gray-500 text-sm pt-2">
            Only send crypto to this address via the Solana network.
          </div>
        </div>
        <div className="flex flex-row mt-4 justify-center">
          <button
            onClick={() =>
              window.open(`https://solscan.io/account/${publicKey}`, "_blank")
            }
            className="flex flex-row mt-2 mr-4 w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Image className="h-5 w-5 mr-2" src={solcan} alt="Solscan" />
            View on SolScan
          </button>
          <button
            onClick={onClose}
            className="mt-2 w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
