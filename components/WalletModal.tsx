import WalletQR from '@/components/WalletQR'
import { Clipboard } from "flowbite-react"
import solcan from '@/public/assets/images/solscan.webp'
import Image from 'next/image';


interface WalletModalProps {
    isVisible: boolean;
    onClose: () => void;
    publicKey: string;
}


const WalletModal: React.FC<WalletModalProps> = ({ isVisible, onClose, publicKey }) => {
    if (!isVisible) return null;
    const publicKeyHidden = `${publicKey.slice(0, 16)}....${publicKey.slice(-4)}`

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 bg-black">
            <div className="bg-white rounded-lg shadow-lg p-6 w-200">
                <h2 className="text-2xl font-bold mb-4 flex justify-center">Your Wallet Address</h2>
                <p className="mb-2 flex justify-center">You can deposit crypto or NFTs into your account via this</p>
                <p className='mb-4 flex justify-center'> Solana wallet address:</p>
                <div className='flex flex-col justify-center items-center rounded-lg bg-gray-200 pt-4 pb-4'>
                    <div className='mb-8 mt-8'>
                        <WalletQR text={publicKey} />
                    </div>
                    <div className="grid w-80 ">
                        <div className="relative">
                            <label htmlFor="wallet-address-copy" className="sr-only">
                                Label
                            </label>
                            <input
                                id="wallet-address-copy"
                                type="text"
                                className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                value={publicKeyHidden}
                                disabled
                                readOnly
                            />
                            <Clipboard.WithIconText valueToCopy={publicKey} />
                        </div>
                    </div>
                    <div className='text-gray-500 text-sm pt-2'>Only send crypto to this address via the Solana network.</div>
                </div>
                <div className='flex flex-row mt-4 justify-center'>
                    <button
                        onClick={() => window.open(`https://solscan.io/account/${publicKey}`, '_blank')}
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
