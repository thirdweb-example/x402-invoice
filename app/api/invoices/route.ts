import { NextRequest, NextResponse } from "next/server";
import { createInvoice, deleteInvoice, getInvoice } from "@/lib/invoices";
import { createCustomer, getCustomer } from "@/lib/customers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing invoice ID" },
        { status: 400 }
      );
    }

    const invoice = await getInvoice(id);
    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing invoice ID" },
        { status: 400 }
      );
    }

    // Check if invoice exists and is not paid
    const invoice = await getInvoice(id);
    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (invoice.paid) {
      return NextResponse.json(
        { error: "Cannot delete paid invoices" },
        { status: 400 }
      );
    }

    const deleted = await deleteInvoice(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete invoice. Invoice may have already been deleted." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete invoice" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seller, sellerWalletAddress, customerId, customerName, customerEmail, description, lineItems, amount, saveCustomer } = body;

    if (!seller || !sellerWalletAddress || !customerName || !customerEmail || !lineItems || !Array.isArray(lineItems) || lineItems.length === 0 || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save customer if requested
    let finalCustomerId = customerId;
    if (saveCustomer && !customerId) {
      const customer = await createCustomer(customerName, customerEmail);
      finalCustomerId = customer.id;
    }

    const invoice = await createInvoice(
      seller,
      sellerWalletAddress,
      customerName,
      customerEmail,
      description || "",
      lineItems,
      amount
    );

    return NextResponse.json({ ...invoice, customerId: finalCustomerId });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

