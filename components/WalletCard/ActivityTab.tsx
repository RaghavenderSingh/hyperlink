"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronUp, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  date: Date;
  type: "received" | "sent";
  token: string;
  amount: number;
  from?: string;
  to?: string;
  logoUrl: string;
}

const ActivityTab = ({ publicKey }: { publicKey: string | null }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `/api/transactions?publicKey=${publicKey}`
        ); // Pass your user's public key here
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        // Fetch and parse the response
        const data = await response.json();

        // Assuming the backend API returns transactions in the correct format
        // we map the date to a Date object for proper formatting.
        setTransactions(
          data.map((tx: any) => ({
            ...tx,
            date: new Date(tx.date), // Ensure the date is a Date object
          }))
        );
      } catch (err) {
        setError("Failed to load transactions. Please try again later.");
        console.error("Error fetching transactions:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  console.log(transactions);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    setShowScrollTop(!bottom);
  };

  const scrollToTop = () => {
    document
      .getElementById("activity-container")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 leading-6 bottom-1 bg-gray-100 p-6 rounded-xl">
        <p className="font-bold text-gray-700 mobile:pb-1 mobile:text-[20px]">
          Oops! Something went wrong.
        </p>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  console.log("transactions", transactions);
  return (
    <div className="w-full pt-5">
      <div
        id="activity-container"
        className="max-h-[500px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {transactions.map((transaction, index) => (
          <React.Fragment key={transaction.id}>
            {index === 0 ||
            transaction.date.toDateString() !==
              transactions[index - 1].date.toDateString() ? (
              <div className="flex">
                <p className="my-1 mb-2 text-xs font-semibold text-grey-500">
                  {format(transaction.date, "MMM dd, yyyy")}
                </p>
              </div>
            ) : null}
            <div className="group mb-2 cursor-pointer rounded-lg border bg-white transition duration-150 ease-in-out hover:border-blue-200 hover:bg-blue-25 active:bg-blue-50">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center px-4 pb-4 pt-3">
                  <div className="relative">
                    <div
                      className="aspect-square rounded-full"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <Image
                        src={transaction.logoUrl}
                        alt={`${transaction.token} logo`}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center bg-black text-white rounded-full border-2 border-white bg-grey-900 p-1 hover:border-blue-25">
                      {transaction.type === "received" ? <Send /> : <Plus />}
                    </div>
                  </div>
                  <div className="ml-3 text-left">
                    <p className="font-semibold">
                      {transaction.type === "received" ? "Received" : "Sent"}{" "}
                      {transaction.token}
                    </p>
                    <p className="line-clamp-1 max-w-full break-all text-xs text-grey-500">
                      {transaction.type === "received"
                        ? `From ${transaction.from}`
                        : `To ${transaction.to}`}
                    </p>
                  </div>
                </div>
                <div className="pr-3 text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === "received"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "received" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  <div>
                    <p className="text-xs text-grey-500">
                      ≈ ${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        {transactions.length === 0 && (
          <div className="text-center py-4">
            <p>No transactions found.</p>
          </div>
        )}
        <div className="css-0">
          <i className="text-xs opacity-50">End of transactions</i>
        </div>
      </div>
      {showScrollTop && (
        <Button
          className="fixed bottom-3 right-3 z-10 h-[56px] w-[56px] rounded-full bg-white p-2 shadow-lg sm:h-[44px] sm:w-[44px]"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default ActivityTab;
