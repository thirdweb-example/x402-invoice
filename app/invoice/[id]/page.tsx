import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/invoices";
import { InvoicePayment } from "@/components/invoice-payment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, User, Mail, DollarSign, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        <Card className="mb-6 shadow-xl border-2" id="invoice-content">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-white text-2xl">Invoice #{invoice.id.slice(0, 8)}</CardTitle>
                  <CardDescription className="text-blue-100">x402 Invoice</CardDescription>
                </div>
              </div>
              {invoice.paid && (
                <div className="px-4 py-2 bg-green-500 rounded-full text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Paid
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  Customer
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{invoice.customerName}</p>
              </div>
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  Email
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{invoice.customerEmail}</p>
              </div>
            </div>

            {invoice.description && (
              <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  Description
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{invoice.description}</p>
              </div>
            )}

            {invoice.lineItems && invoice.lineItems.length > 0 ? (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Line Items</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Description
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Price (USDC)
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Total (USDC)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {invoice.lineItems.map((item: any, index: number) => {
                        const itemTotal = (item.quantity || 0) * (parseFloat(item.price) || 0);
                        return (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{item.description}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{item.quantity}</td>
                            <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{parseFloat(item.price).toFixed(4)}</td>
                            <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{itemTotal.toFixed(4)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700">
                      <tr>
                        <td colSpan={3} className="py-4 px-4 text-right font-semibold text-gray-900 dark:text-white">
                          Total Amount:
                        </td>
                        <td className="py-4 px-4 text-right text-xl font-bold text-gray-900 dark:text-white">
                          {invoice.amount} USDC
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border-t pt-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-5 w-5" />
                    Total Amount
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                    {invoice.amount} USDC
                  </p>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Seller
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{invoice.seller}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {invoice.paid ? (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 bg-green-500 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <p className="text-xl font-bold text-green-800 dark:text-green-200">
                  Invoice Paid Successfully!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <InvoicePayment invoiceId={invoice.id} />
        )}
      </div>
    </div>
  );
}

