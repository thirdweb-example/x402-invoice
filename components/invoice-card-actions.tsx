"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Invoice } from "@/lib/invoices";

interface InvoiceCardActionsProps {
  invoice: Invoice;
}

export function InvoiceCardActions({ invoice }: InvoiceCardActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/invoices?id=${invoice.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete invoice");
      }

      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete invoice");
    } finally {
      setDeleting(false);
    }
  };

  if (invoice.paid) {
    return null; // Don't show delete for paid invoices
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="h-8 text-red-600 hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-600 transition-all duration-200"
      title="Delete invoice"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

