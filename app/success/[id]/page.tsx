import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  // If invoice is not paid, show waiting message
  if (!invoice.paid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Payment not yet confirmed. Please wait...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-800 dark:text-green-200">
              Invoice Paid!
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Payment successful on Arbitrum network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {invoice.amount} USDC
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/">
                <Button className="w-full gap-2" variant="outline">
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

