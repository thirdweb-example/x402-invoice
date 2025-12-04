"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { ButtonProps } from "@/components/ui/button";

interface CopyInvoiceLinkProps {
  url: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function CopyInvoiceLink({ url, variant = "outline", size = "icon" }: CopyInvoiceLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={size === "icon" ? "shrink-0 h-8" : "shrink-0"}
      title={copied ? "Copied!" : "Copy invoice link"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  );
}

