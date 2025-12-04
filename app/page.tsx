import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getInvoices } from "@/lib/invoices";
import { FileText, Plus, CheckCircle2, Clock, Eye } from "lucide-react";
import { InvoiceCardActions } from "@/components/invoice-card-actions";
import { InvoiceShareButton } from "@/components/invoice-share-button";

export default async function HomePage() {
  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              x402 Invoice
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage invoices on Arbitrum network
            </p>
          </div>
          <Link href="/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create Invoice
            </Button>
          </Link>
        </div>

        {invoices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No invoices yet. Create your first invoice!
              </p>
              <Link href="/new" className="mt-4">
                <Button>Create Invoice</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50 dark:bg-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Description
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Date
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {invoice.customerName}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {invoice.customerEmail}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-xs">
                            {invoice.description || "—"}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {invoice.amount} USDC
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {invoice.paid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                              <Clock className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link href={`/invoice/${invoice.id}`}>
                              <Button variant="ghost" size="sm" className="h-8" title="View invoice">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <InvoiceShareButton invoiceId={invoice.id} />
                            <InvoiceCardActions invoice={invoice} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
