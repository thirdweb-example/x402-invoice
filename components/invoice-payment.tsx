"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetchWithPayment } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id",
});

interface InvoicePaymentProps {
  invoiceId: string;
}

export function InvoicePayment({ invoiceId }: InvoicePaymentProps) {
  const router = useRouter();
  const { fetchWithPayment, isPending } = useFetchWithPayment(client);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  // Fetch invoice amount from backend on mount
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        // Fetch invoice info from a separate endpoint or use the pay endpoint without payment header
        const response = await fetch(`/api/invoices?id=${invoiceId}`);
        if (response.ok) {
          const invoice = await response.json();
          if (invoice.amount) {
            setAmount(invoice.amount);
          }
          if (invoice.paid) {
            setError("This invoice has already been paid");
          }
        } else {
          const data = await response.json();
          setError(data.error || "Failed to load invoice");
        }
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
        setError("Failed to load invoice details");
      }
    };
    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    try {
      setError(null);
      // Amount is fetched from backend, not passed as prop (security)
      const apiUrl = `${window.location.origin}/api/pay?invoiceId=${invoiceId}`;
      const response = await fetchWithPayment(apiUrl);

      if (response && typeof response === "object") {
        if ("success" in response && response.success) {
          router.push(`/success/${invoiceId}`);
        } else if ("error" in response && typeof response.error === "string") {
          setError(response.error || "Payment failed");
        } else {
          // If response doesn't have success/error, assume success
          router.push(`/success/${invoiceId}`);
        }
      } else {
        // If response is not an object, assume success
        router.push(`/success/${invoiceId}`);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Pay Invoice
        </CardTitle>
        <CardDescription>
          {amount 
            ? `Connect your wallet and pay ${amount} USDC on Arbitrum network`
            : "Loading invoice details..."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        <Button
          onClick={handlePayment}
          disabled={isPending || !amount}
          className="w-full"
          size="lg"
        >
          {isPending ? "Processing Payment..." : amount ? "Pay with Arbitrum" : "Loading..."}
        </Button>
      </CardContent>
    </Card>
  );
}

