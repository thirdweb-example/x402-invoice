import { NextRequest, NextResponse } from "next/server";
import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { arbitrum } from "thirdweb/chains";
import { updateInvoicePayment, getInvoice } from "@/lib/invoices";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY || "",
});

// Yash's wallet address (should be set in environment variable)
const serverWalletAddress =
  process.env.SERVER_WALLET_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: serverWalletAddress,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Missing invoiceId" },
        { status: 400 }
      );
    }

    // Fetch invoice from database to get the actual amount (prevents tampering)
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.paid) {
      return NextResponse.json(
        { error: "Invoice already paid" },
        { status: 400 }
      );
    }

    const paymentData = request.headers.get("x-payment");

    // Use amount from database, not from query params (security)
    const amount = invoice.amount;
    // Convert USDC amount to smallest unit (1 USDC = 10^6)
    const amountInSmallestUnit = (parseFloat(amount) * 1e6).toString();

    // Use seller's wallet address from invoice (the person who created the invoice)
    const sellerWalletAddress = (invoice as any).sellerWalletAddress || serverWalletAddress;
    
    if (!sellerWalletAddress || sellerWalletAddress === "0x0000000000000000000000000000000000000000") {
      return NextResponse.json(
        { error: "Invalid seller wallet address" },
        { status: 400 }
      );
    }

    // Verify and process the payment
    const result = await settlePayment({
      resourceUrl: request.url,
      method: "GET",
      paymentData: paymentData || undefined,
      payTo: sellerWalletAddress,
      network: arbitrum,
      price: {
        amount: amountInSmallestUnit,
        asset: {
          address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC on Arbitrum
          decimals: 6,
        },
      },
      facilitator: thirdwebFacilitator,
      routeConfig: {
        description: `Payment for invoice ${invoiceId}`,
        mimeType: "application/json",
      },
    });

    if (result.status === 200) {
      // Payment verified and settled successfully
      // Mark invoice as paid
      await updateInvoicePayment(invoiceId);

      return NextResponse.json({
        success: true,
        invoiceId,
        amount: invoice.amount,
        message: "Payment successful",
      });
    } else {
      // Payment required - return the payment request
      return NextResponse.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders,
      });
    }
  } catch (error: any) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: error.message || "Payment processing failed" },
      { status: 500 }
    );
  }
}

