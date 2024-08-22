import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Image from "next/image";
import solcan from "@/public/assets/images/solscan.webp";
import { ShieldCheck } from "lucide-react";

export default function LinkPopup({
  linkPopupOpen,
  link,
  signature,
}: {
  linkPopupOpen: boolean;
  link: string;
  signature: string;
}) {
  console.log("link", link);
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast("Copied to clipboard");
  };
  return (
    <div>
      <Dialog open={linkPopupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center text-2xl">
              Your Hyperlink
            </DialogTitle>
            <DialogDescription className="flex justify-center">
              <div>
                <div className="flex justify-center mt-5">
                  <Badge className="text-xl p-2" variant="outline">
                    {link}
                  </Badge>
                </div>

                <div className="flex justify-center mt-5 gap-1">
                  <Button className="w-full" onClick={handleCopy}>
                    Copy
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        `https://solscan.io/tx/${signature}`,
                        "_blank"
                      )
                    }
                  >
                    <Image
                      className="h-5 w-5 mr-2"
                      src={solcan}
                      alt="Solscan"
                    />
                    View on SolScan
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span>
                      <div>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <span>
                            <ShieldCheck />
                          </span>
                          <span>All Hyperlinks are non-custodial wallets.</span>
                        </p>
                      </div>
                    </span>
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
