import React from "react";

import { QRCode } from "react-qrcode-logo";

interface QRCodeGeneratorProps {
  text: string;
}

const WalletQR: React.FC<QRCodeGeneratorProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <QRCode qrStyle="dots" value={text} size={256} />
    </div>
  );
};

export default WalletQR;
