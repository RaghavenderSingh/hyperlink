"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Wallet, Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { decodeToken, web3auth } from "@/lib/web3auth";
import { initClients } from "@/lib/client";
import { handleSignOut } from "@/actions";
import { Toaster, toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface UserWalletDashboardProps {
  session: Session | null;
}

const verifier = process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER ?? "";

const UserWalletDashboard: React.FC<UserWalletDashboardProps> = ({
  session,
}) => {
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0.00");

  useEffect(() => {
    let loadingToast: string | undefined;

    const initWeb3Auth = async () => {
      if (!session) {
        router.push("/");
        return;
      }

      loadingToast = toast.loading("Preparing your HyperLink account", {
        position: "top-center",
      });

      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.status === "connected") {
          setProvider(web3auth.provider);
        } else if (session?.idToken) {
          const { payload } = decodeToken(session.idToken);
          const w3aProvider = await web3auth.connect({
            verifier,
            verifierId: (payload as any).email,
            idToken: session.idToken,
          });
          setProvider(w3aProvider);
          initClients();
        }
      } catch (e) {
        console.error("Error initializing & connecting to web3auth:", e);
        if (
          e instanceof Error &&
          (e.message.includes("Duplicate token found") ||
            e.message.includes("Wallet is not connected"))
        ) {
          setError(
            "Session expired or wallet disconnected. Please sign in again."
          );
          await handleSignOut();
          router.push("/");
        } else {
          setError("An error occurred. Please try again.");
        }
        setProvider(null);
        setPublicKey(null);
      } finally {
        setIsLoading(false);
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }
      }
    };

    initWeb3Auth();

    return () => {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    };
  }, [session, router]);

  useEffect(() => {
    const getPublicKey = async () => {
      if (provider) {
        try {
          const accounts = await provider.request({ method: "getAccounts" });
          if (Array.isArray(accounts) && accounts.length > 0) {
            setPublicKey(accounts[0]);
          }
        } catch (error) {
          console.error("Error fetching public key:", error);
          setError("Failed to retrieve public key.");
        }
      }
    };

    getPublicKey();
  }, [provider]);

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Toaster />
        <Card className="rounded-xl bg-white p-5 sm:p-8">
          <CardContent className="p-0">
            <Skeleton className="h-16 w-full mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-1/5" />
              <Skeleton className="h-10 w-1/5" />
              <Skeleton className="h-10 w-1/5" />
              <Skeleton className="h-10 w-1/5" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div
        className="flex-col items-center space-y-2 rounded-xl border border-white bg-white/40 text-center sm:my-4 backdrop-blur-[1px]"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.06) 0px 4px 40px, rgba(255, 255, 255, 0.8) 0px 0px 40px inset",
        }}
      >
        <Card className="rounded-xl bg-white p-5 sm:p-8">
          <CardContent className="p-0">
            <h3 className="mb-6 w-full text-left text-base font-bold text-gray-800 mobile:text-[26px]">
              <div className="flex items-center justify-start gap-2 mobile:gap-4">
                <Image
                  alt="user avatar"
                  className="rounded-full border border-gray-200 h-[68px] w-[68px] mobile:h-[68px] mobile:w-[68px]"
                  src={session?.user?.image ? session?.user?.image : ""}
                  width={68}
                  height={68}
                />
                <p className=" text-xl font-bold text-gray-800 mobile:text-[26px]">
                  Welcome back, {session?.user?.name}!
                </p>
              </div>
            </h3>
            <div>
              <div className="flex w-full items-start justify-between">
                <p className="mb-0 inline-flex items-center justify-start text-left text-xs font-semibold text-gray-400 mobile:mb-3 mobile:text-sm">
                  <Wallet className="mr-1 h-4 w-4" />
                  TipLink Account Assets
                </p>
              </div>
              <div className="flex w-full items-center justify-between">
                <h1 className="text-[40px] font-bold text-gray-900 mobile:text-6xl">
                  ${balance}
                  <span className="ml-2 text-2xl text-gray-600 mobile:text-4xl">
                    USD
                  </span>
                </h1>
                <Button
                  variant="outline"
                  className="flex items-center justify-center bg-gray-50 px-2.5 py-2.5 text-gray-600 hover:bg-gray-100 active:bg-gray-200 mobile:px-3 rounded-2xl"
                  onClick={() => {
                    if (publicKey) {
                      navigator.clipboard.writeText(publicKey);
                      toast.success("Public key copied to clipboard!");
                    }
                  }}
                >
                  <Search className="h-5 w-5" />
                  <span className="ml-1 hidden text-xs font-semibold text-gray-600 sm:inline">
                    {publicKey ? "Copy Public Key" : "Loading Public Key..."}
                  </span>
                </Button>
              </div>
              <div className="mt-5 flex w-full items-start justify-between overflow-hidden mobile:mt-6 mobile:gap-2 sm:items-center">
                <Button className="h-11 flex-1 mx-1">Send</Button>
                <Button variant="outline" className="h-11 flex-1 mx-1">
                  Add Funds
                </Button>
                <Button variant="outline" className="h-11 flex-1 mx-1">
                  Withdraw
                </Button>
                <Button variant="outline" className="h-11 flex-1 mx-1">
                  Swap
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="rounded-b-lg px-5 pb-5 sm:px-8 sm:pb-8">
          <Tabs defaultValue="tokens" className="w-full">
            <TabsList>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="nfts" disabled>
                NFTs
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="tokens">
              <div className="w-full pt-5">
                <div className="flex flex-col items-center justify-center py-10 leading-6">
                  <p className="font-bold text-gray-700 mobile:pb-1 mobile:text-[20px]">
                    You don't have any assets yet!
                  </p>
                  <p className="mb-3 text-sm text-gray-500 mobile:text-base">
                    Start by buying or depositing funds:
                  </p>
                  <Button>
                    <Plus className="h-5 w-5 mr-1" />
                    Add Funds
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="nfts">
              <div className="w-full">
                <div className="relative mt-5 flex w-full items-center justify-center">
                  <h3 className="margin-auto absolute bottom-0 left-0 right-0 top-0 z-[1] flex h-full w-full items-center justify-center text-gray-500">
                    You don't have any NFTs.
                  </h3>
                  <div
                    style={{
                      position: "relative",
                      width: "126.67px",
                      height: "139.31px",
                    }}
                  >
                    <Image
                      alt="Empty NFT Icon"
                      src="/_next/static/media/nft-empty.2f73a6dc.png"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="activity">
              <div className="w-full pt-5">
                <p>No transactions</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDashboard;
