import { v4 as uuidv4 } from "uuid";
import clientPromise from "./mongodb";

export interface LineItem {
  description: string;
  quantity: number;
  price: string; // in USDC
}

export interface Invoice {
  id: string;
  seller: string;
  sellerWalletAddress: string;
  customerName: string;
  customerEmail: string;
  description: string;
  lineItems?: LineItem[]; // Optional for backward compatibility
  amount: string; // in USDC (total calculated from line items)
  paid: boolean;
  txHash?: string | null; // Optional - kept for backward compatibility
  createdAt: string;
}

const DB_NAME = "basepay-invoice";
const COLLECTION_NAME = "invoices";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection<Invoice>(COLLECTION_NAME);
}

export async function getInvoices(): Promise<Invoice[]> {
  const collection = await getCollection();
  const invoices = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return invoices.map((inv: any) => {
    const { _id, ...rest } = inv;
    return rest as Invoice;
  });
}

export async function getInvoicesByWallet(walletAddress: string): Promise<Invoice[]> {
  const collection = await getCollection();
  const invoices = await collection.find({ sellerWalletAddress: walletAddress }).sort({ createdAt: -1 }).toArray();
  return invoices.map((inv: any) => {
    const { _id, ...rest } = inv;
    return rest as Invoice;
  });
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const collection = await getCollection();
  const invoice = await collection.findOne({ id });
  if (!invoice) return null;
  const { _id, ...rest } = invoice as any;
  return rest as Invoice;
}

export async function createInvoice(
  seller: string,
  sellerWalletAddress: string,
  customerName: string,
  customerEmail: string,
  description: string,
  lineItems: LineItem[],
  amount: string
): Promise<Invoice> {
  const collection = await getCollection();
  const invoice: Invoice = {
    id: uuidv4(),
    seller,
    sellerWalletAddress,
    customerName,
    customerEmail,
    description,
    lineItems,
    amount,
    paid: false,
    txHash: null,
    createdAt: new Date().toISOString(),
  };
  await collection.insertOne(invoice);
  return invoice;
}

export async function updateInvoicePayment(
  id: string,
  txHash?: string
): Promise<Invoice | null> {
  const collection = await getCollection();
  const updateData: any = {
    paid: true,
  };
  if (txHash) {
    updateData.txHash = txHash;
  }
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: updateData },
    { returnDocument: "after" }
  );
  if (!result) return null;
  const { _id, ...rest } = result as any;
  return rest as Invoice;
}

export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    const collection = await getCollection();
    // Only allow deletion if invoice is not paid
    const invoice = await collection.findOne({ id });
    if (!invoice) {
      console.log(`Invoice ${id} not found for deletion`);
      return false;
    }
    if (invoice.paid) {
      console.log(`Invoice ${id} is paid, cannot delete`);
      return false; // Cannot delete paid invoices
    }
    
    const result = await collection.deleteOne({ id });
    const deleted = result.deletedCount === 1;
    if (!deleted) {
      console.log(`Failed to delete invoice ${id}, deletedCount: ${result.deletedCount}`);
    }
    return deleted;
  } catch (error) {
    console.error(`Error in deleteInvoice for ${id}:`, error);
    throw error;
  }
}

