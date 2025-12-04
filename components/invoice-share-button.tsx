"use client";

import { CopyInvoiceLink } from "@/components/copy-invoice-link";

interface InvoiceShareButtonProps {
  invoiceId: string;
}

export function InvoiceShareButton({ invoiceId }: InvoiceShareButtonProps) {
  // Get the base URL from window.location in the client
  const baseUrl = typeof window !== "undefined" 
    ? `${window.location.protocol}//${window.location.host}`
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const invoiceUrl = `${baseUrl}/invoice/${invoiceId}`;

  return (
    <CopyInvoiceLink 
      url={invoiceUrl}
      variant="ghost"
      size="sm"
    />
  );
}

