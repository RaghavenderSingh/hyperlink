"use client";
import React, { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import background from "../../public/assets/images/background.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Copy,
  Loader,
  QrCodeIcon,
  Wallet,
} from "lucide-react";
import { HyperLink } from "@/utils/url";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Spinner, Tooltip } from "flowbite-react";
import WalletModal from "@/components/WalletModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolanaTransfer } from "@/app/hooks/useSolanaTransfer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Send from "@/components/linkAsWallet/Send";
import SendHyperlink from "@/components/linkAsWallet/SendHyperlink";
import { convertUsdToSol } from "@/lib/KeyStore";
import { Input } from "@/components/ui/input";
import { LinkPreview } from "@/components/ui/link-preview";
import preview from "../../public/assets/images/preview.png";

interface HyperLinkData {
  keypair: {
    publicKey: PublicKey;
    secretKey: Uint8Array;
  };
  url: URL;
}

const HyperLinkCard: React.FC = () => {
  const [hyperlink, setHyperlink] = useState<HyperLinkData | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [usdBalance, setUsdBalance] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [url, setUrl] = useState<URL>(new URL(window.location.href));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [step, setStep] = useState<Number>(0);
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [recipentPublicKey, setRecipentPublicKey] = useState<string>("");

  const { publicKey, connected } = useWallet();

  useEffect(() => {
    loadHyperLink();
  }, [isLoading]);

  const loadHyperLink = async () => {
    const hash = window.location.hash.slice(1);
    setUrl(new URL(window.location.href));
    if (hash) {
      const url = `${process.env.NEXT_PUBLIC_HYPERLINK_ORIGIN}#${hash}`;
      try {
        const hyperlinkInstance = await HyperLink.fromLink(url);
        setHyperlink(hyperlinkInstance);
        await fetchBalance(hyperlinkInstance);
      } catch (err) {
        setError("Invalid HyperLink");
      }
    }
  };
  const fetchBalance = async (
    hyperlinkInstance: HyperLinkData
  ): Promise<void> => {
    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const balance = await connection.getBalance(
        hyperlinkInstance.keypair.publicKey
      );
      const solBalance = balance / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      const data: { solana: { usd: number } } = await response.json();
      setUsdBalance(solBalance * data.solana.usd);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Error fetching balance.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url.href);
    toast("Copied to clipboard");
  };

  const handleBookmark = () => {
    if ((window as any).external && (window as any).external.AddFavorite) {
      (window as any).external.AddFavorite(window.location.href, "HyperLink");
    } else {
      toast(
        `Press ${
          navigator.userAgent.toLowerCase().includes("mac") ? "Cmd" : "Ctrl"
        } + D to bookmark this page.`
      );
    }
  };
  const completeAmount = async () => {
    if (!hyperlink) {
      setError("No HyperLink available to transfer from.");
      return;
    }
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
    const currentBalance = await connection.getBalance(
      hyperlink.keypair.publicKey
    );
    createLinkAndTransfer({ amount: currentBalance });
  };
  const handleTransferAmount = async () => {
    if (!hyperlink) {
      setError("No HyperLink available to transfer from.");
      return;
    }
    const amt = await convertUsdToSol(transferAmount);
    const amount = Number(amt) * LAMPORTS_PER_SOL;
    createLinkAndTransfer({ amount: amount });
  };

  const createLinkAndTransfer = async ({ amount }: { amount: number }) => {
    if (!hyperlink) {
      setError("No HyperLink available to transfer from.");
      return;
    }

    try {
      setIsLoading(true);
      const newHyperlink = await HyperLink.create();
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const currentBalance = amount;
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: hyperlink.keypair.publicKey,
          toPubkey: newHyperlink.keypair.publicKey,
          lamports: currentBalance - 5000,
        })
      );

      transaction.feePayer = hyperlink.keypair.publicKey;
      transaction.recentBlockhash = blockhash;

      const hyperlinkInstance = await HyperLink.fromLink(window.location.href);
      if (!hyperlinkInstance || !hyperlinkInstance.keypair) {
        throw new Error("Invalid HyperLink or missing keypair");
      }
      transaction.sign(hyperlinkInstance.keypair);

      const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error(
          `Transaction failed: ${confirmation.value.err.toString()}`
        );
      }

      setHyperlink(newHyperlink);
      await fetchBalance(hyperlink);
      await fetchBalance(newHyperlink);
      setUrl(new URL(newHyperlink.url));
      window.open(newHyperlink.url.toString(), "_blank");
      console.log("newHyperlink", newHyperlink);
      setIsLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(`Error creating new HyperLink or transferring funds: ${err}`);
    }
  };
  const handleTransferToPublickkey = async () => {
    console.log(recipentPublicKey, transferAmount);
    if (!recipentPublicKey || transferAmount === "") {
      toast.error("Missing required information for transfer.");
      return;
    }
    try {
      const publicKey = new PublicKey(recipentPublicKey);
      publicKey.toBytes().length === 32;
      const amt = await convertUsdToSol(transferAmount);
      const amount = Number(amt) * LAMPORTS_PER_SOL;
      console.log(publicKey, amount, transferAmount);
      handleTransfer(publicKey, amount);
    } catch (error) {
      toast.error("Invalid public key");
      return false;
    }
  };
  const handleTransferToPersonalWallet = async () => {
    if (!publicKey || !balance || !hyperlink) {
      toast.error("Missing required information for transfer.");
      return;
    }
    const amount = balance * LAMPORTS_PER_SOL;
    handleTransfer(publicKey, amount);
  };
  const handleTransfer = async (publicKey: PublicKey, amount: number) => {
    if (!publicKey || !balance || !hyperlink) {
      toast.error("Missing required information for transfer.");
      return;
    }
    console.log("balance", balance);
    setIsLoading(true);

    try {
      const connection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: hyperlink.keypair.publicKey,
          toPubkey: publicKey,
          lamports: amount - 5000,
        })
      );
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = hyperlink.keypair.publicKey;
      transaction.sign(hyperlink.keypair);
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [hyperlink.keypair]
      );

      console.log(`Transfer successful! Signature: ${signature}`);
      toast.success(`Transfer successful! Signature: ${signature}`);

      await fetchBalance(hyperlink);
      setRecipentPublicKey("");
      setTransferAmount("");
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error(
        `Transfer failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSteps = (step: Number) => {
    switch (step) {
      case 0:
        return (
          <div className="flex w-full flex-col justify-start space-y-5 xs:space-y-0 xs:flex-row xs:space-x-10">
            <Button
              onClick={completeAmount}
              className="flex justify-between text-base font-medium p-10 xs:w-full xs:text-base"
            >
              <div className="flex items-start justify-start gap-[10px]">
                <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50 xs:p-3">
                  <Wallet />
                </div>
                <div className="flex-col items-start justify-start rounded-full bg-grey-50 xs:p-3">
                  <div className="text-left">Recreate this Hyperlink</div>
                  <div className="text-left text-xs font-normal text-grey-500">
                    Move the entire value to a new Hyperlink so only you have
                    the link.
                  </div>
                </div>
              </div>
              {isLoading ? <Spinner /> : <ChevronRight />}
            </Button>
            <Button //TODO
              onClick={handleTransferToPersonalWallet}
              className="flex justify-between text-base font-medium p-10 xs:w-full xs:text-base"
            >
              <div className="flex items-start justify-start gap-[10px]">
                <div className="flex items-center justify-center align-middle mt-2 rounded-full bg-grey-50 xs:p-3">
                  <Wallet />
                </div>
                <div className="flex-col items-start justify-start rounded-full bg-grey-50 xs:p-3">
                  <div className="text-left">Withdraw to your wallet</div>
                  <div className="text-left text-xs font-normal text-grey-500">
                    Withdraw the entire value to your connected wallet.
                  </div>
                </div>
              </div>
              <ChevronRight />
            </Button>
          </div>
        );
      case 1:
        return <Send setStep={setStep} />;
      case 2:
        return (
          <div>
            <SendHyperlink
              setStep={setStep}
              setTransferAmount={setTransferAmount}
            />
            <Button
              className="mt-1 w-full"
              disabled={transferAmount === "" ? true : false}
              onClick={() => handleTransferAmount()}
            >
              Send
            </Button>
          </div>
        );

      case 3:
        return (
          <div>
            <SendHyperlink
              setStep={setStep}
              setTransferAmount={setTransferAmount}
            />
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
        );
    }
  };

  // if (error) {
  //   return (
  //     <Card className="w-full max-w-md mx-auto my-auto">
  //       <CardContent className="pt-6">
  //         <p className="text-red-500 text-center">{error}</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  // if (!hyperlink) {
  //   return (
  //     <Card className="w-full max-w-md mx-auto">
  //       <CardContent className="pt-6">
  //         <p className="text-center">Loading HyperLink...</p>
  //       </CardContent>
  //     </Card>
  //   );
  // }
  const truncateUrl = (urlString: string, length: number = 16) => {
    if (urlString.length <= length) return urlString;
    return urlString.substring(0, length) + "...";
  };
  return (
    <div className="flex flex-col  m-1">
      <div className="fixed top-4 right-4 flex items-end justify-end z-10">
        <WalletMultiButton style={{ backgroundColor: "black", height: "40px" }}>
          {!connected && <Wallet />}
        </WalletMultiButton>
      </div>
      <div>
        <Card className="w-full h-full max-w-xl mx-auto my-10">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-center">
              This is ${usdBalance?.toFixed(2)} in crypto
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-lg font-thin text-center">
              The link to this page contains this value. Make sure you don't
              lose it!
            </p>
            <div className="flex justify-center items-center">
              <LinkPreview
                isStatic
                imageSrc="/assets/images/preview.png"
                url={url.href}
              >
                <Badge
                  onClick={handleCopy}
                  className="text-lg p-2 px-4 cursor-pointer"
                >
                  {truncateUrl(url.href, 32)}
                </Badge>
              </LinkPreview>
            </div>
            <div className="flex justify-center items-center gap-3">
              <Button onClick={handleCopy} className="h-[80px]">
                <div className="flex flex-col items-center px-10 p-15">
                  <Copy />
                  <span>Copy</span>
                </div>
              </Button>
              <Button onClick={handleBookmark} className="h-[80px]">
                <div className="flex flex-col items-center px-10 p-15">
                  <Bookmark />
                  <span>Bookmark</span>
                </div>
              </Button>
              <Button className="h-[80px]">
                <div className="flex flex-col items-center px-10 p-15">
                  <QrCodeIcon />
                  <span>QR code</span>
                </div>
              </Button>
            </div>
            {balance !== null && (
              <div
                className="rounded-xl shadow-lg p-6 flex flex-row justify-between"
                style={{ backgroundImage: `url(${background.src})` }}
              >
                <div className="flex flex-col items-start">
                  <div className="mt-10">
                    <h1 className="text-[4rem] leading-none font-bold">Your</h1>
                    <h1 className="text-[4rem] leading-none font-bold">
                      Balance
                    </h1>
                  </div>
                  <div className="mt-10">
                    <Tooltip
                      className="bg-black text-white rounded-full"
                      content={url.hash}
                    >
                      <Badge onClick={handleCopy} className="text-lg">
                        {truncateUrl(url.hash)}
                      </Badge>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <div className="text-center mt-[5rem]">
                    <p className="text-pink-400">{balance.toFixed(4)} SOL</p>
                    {usdBalance !== null && (
                      <h1 className="text-4xl">${usdBalance.toFixed(2)}</h1>
                    )}
                  </div>
                  <div className="flex justify-end mt-[5rem]">
                    <p className="text-gray-400 text-xs">
                      POWERED BY Hyperlink
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-center items-center gap-3">
              <Button onClick={() => setStep(1)} className="w-full">
                Send
              </Button>
              <Button onClick={() => setShowQrModal(true)} className="w-full">
                Receive
              </Button>

              {showQrModal && hyperlink?.keypair?.publicKey && (
                <WalletModal
                  isVisible={showQrModal}
                  onClose={() => setShowQrModal(false)}
                  publicKey={hyperlink?.keypair?.publicKey
                    .toBase58()
                    .toString()}
                />
              )}
            </div>
            <Separator className="my-10" />
            <div>{handleSteps(step)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HyperLinkCard;
