import { NextRequest, NextResponse } from "next/server";
import { MoonPay } from "@moonpay/moonpay-node"

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body from the request
        const data: { walletAddress: string } = await req.json();
        const moonPay = new MoonPay('sk_test_...');
        const signature = moonPay.url.generateSignature(
            `https://buy.moonpay.com/?apiKey=pk_test_123&walletAddress=${data.walletAddress}`
        );

        // Check if the name is provided
        if (!data.walletAddress) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Respond with the user's name
        return NextResponse.json({ name: data.walletAddress }, { status: 200 });

    } catch (error) {
        // Handle any errors that might occur during parsing
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
