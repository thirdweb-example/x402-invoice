import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CopyInvoiceLink } from "@/components/copy-invoice-link";

export default async function InvoiceCreatedPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invoice/${invoice.id}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-800 dark:text-green-200">
              Invoice Created Successfully!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Share this link with your customer to collect payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Invoice Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={invoiceUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <CopyInvoiceLink url={invoiceUrl} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                  <p className="font-semibold">{invoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                  <p className="font-semibold text-lg">{invoice.amount} USDC</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href={invoiceUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full gap-2" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                  View Invoice
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full gap-2" variant="ghost">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

