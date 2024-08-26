import { NextRequest, NextResponse } from "next/server";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "@/lib/constants";
import { usePrivateKey } from "@/lib/KeyStore";
import { Wallet } from '@project-serum/anchor';

export async function POST(req: NextRequest) {
    console.log("123")
    const data: {
        quoteResponse: any
    } = await req.json();
    const privateKey = usePrivateKey();
    if (privateKey === null) {
        return NextResponse.json({
            message: "You are not logged in"
        }, {
            status: 401
        })
    }
    const privateKeyUint8Array = Uint8Array.from(Buffer.from(privateKey, 'hex'))

    const wallet = new Wallet(Keypair.fromSecretKey(privateKeyUint8Array));
    // get serialized transactions for the swap
    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // quoteResponse from /quote api
                quoteResponse: data.quoteResponse,
                // user public key to be used for the swap
                userPublicKey: wallet.publicKey.toBase58(),
                // auto wrap and unwrap SOL. default is true
                wrapAndUnwrapSol: true,
                // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
                // feeAccount: "fee_account_public_key"
            })
        })
    ).json();
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log(transaction);



    // sign the transaction
    transaction.sign([wallet.payer]);
    const latestBlockHash = await connection.getLatestBlockhash();

    // Execute the transaction
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid
    });
    console.log(`https://solscan.io/tx/${txid}`);
    return NextResponse.json({
        txid
    })


}

