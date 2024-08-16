import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    text: string;
}

const WalletQR: React.FC<QRCodeGeneratorProps> = ({ text }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <QRCode value={text} size={256} />
        </div>
    );
};

export default WalletQR;