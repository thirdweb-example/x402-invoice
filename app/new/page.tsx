"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface LineItem {
  description: string;
  quantity: number;
  price: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [saveCustomer, setSaveCustomer] = useState(false);
  const [formData, setFormData] = useState({
    seller: "",
    sellerWalletAddress: "",
    customerName: "",
    customerEmail: "",
    description: "",
  });

  // Auto-fill seller wallet address from connected wallet
  useEffect(() => {
    if (account?.address) {
      setFormData((prev) => ({
        ...prev,
        sellerWalletAddress: account.address,
      }));
    }
  }, [account?.address]);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, price: "" },
  ]);

  useEffect(() => {
    // Load customers
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error loading customers:", err));
  }, []);

  useEffect(() => {
    // When customer is selected, populate form
    if (selectedCustomerId) {
      const customer = customers.find((c) => c.id === selectedCustomerId);
      if (customer) {
        setFormData({
          ...formData,
          customerName: customer.name,
          customerEmail: customer.email,
        });
      }
    }
  }, [selectedCustomerId]);

  const calculateTotal = (): string => {
    const total = lineItems.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const price = parseFloat(item.price) || 0;
      return sum + quantity * price;
    }, 0);
    return total.toFixed(4);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, price: "" }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate line items
    const hasEmptyItems = lineItems.some(
      (item) => !item.description.trim() || !item.price || item.quantity <= 0
    );
    if (hasEmptyItems) {
      alert("Please fill in all line items with valid values");
      setLoading(false);
      return;
    }

    const totalAmount = calculateTotal();
    if (parseFloat(totalAmount) <= 0) {
      alert("Total amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        ...formData,
        lineItems,
        amount: totalAmount,
        saveCustomer: saveCustomer || !selectedCustomerId,
        customerId: selectedCustomerId || undefined,
      };

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      const invoice = await response.json();
      router.push(`/invoice/created/${invoice.id}`);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <CardTitle>Create New Invoice</CardTitle>
            </div>
            <CardDescription>
              Fill in the details to create a new invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="seller">Seller Name</Label>
                  <Input
                    id="seller"
                    placeholder="Yash"
                    value={formData.seller}
                    onChange={(e) =>
                      setFormData({ ...formData, seller: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerWalletAddress">Seller Wallet Address</Label>
                  <Input
                    id="sellerWalletAddress"
                    placeholder={account?.address || "Connect wallet to auto-fill"}
                    value={formData.sellerWalletAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, sellerWalletAddress: e.target.value })
                    }
                    required
                    disabled={!!account?.address}
                    className={account?.address ? "bg-gray-50 dark:bg-gray-800" : ""}
                  />
                  {account?.address && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Using connected wallet address: {account.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select
                    value={selectedCustomerId || "new"}
                    onValueChange={(value) => setSelectedCustomerId(value === "new" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer or enter new" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Customer</SelectItem>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Sarah"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="sarah@example.com"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveCustomer"
                  checked={saveCustomer}
                  onCheckedChange={(checked: boolean) => setSaveCustomer(checked)}
                />
                <Label htmlFor="saveCustomer" className="cursor-pointer">
                  Save this customer for future invoices
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Invoice Description/Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes or description for this invoice..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Line Items</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addLineItem}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 md:grid-cols-12 items-end p-4 border rounded-lg bg-white dark:bg-gray-800"
                    >
                      <div className="md:col-span-4 space-y-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(index, "description", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          required
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <Label className="text-xs">Price (USDC)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          placeholder="0.0001"
                          value={item.price}
                          onChange={(e) =>
                            updateLineItem(index, "price", e.target.value)
                          }
                          required
                          className="text-sm"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-xs">Total</Label>
                        <div className="h-10 px-3 flex items-center text-xs font-medium border rounded-md bg-gray-50 dark:bg-gray-900 overflow-hidden">
                          <span className="truncate">
                            {(
                              (item.quantity || 0) * (parseFloat(item.price) || 0)
                            ).toFixed(4)}
                          </span>
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLineItem(index)}
                          disabled={lineItems.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <div className="text-right space-y-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Amount
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {calculateTotal()} USDC
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
