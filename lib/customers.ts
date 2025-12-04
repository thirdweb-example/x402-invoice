import { v4 as uuidv4 } from "uuid";
import clientPromise from "./mongodb";

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

const DB_NAME = "basepay-invoice";
const COLLECTION_NAME = "customers";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection<Customer>(COLLECTION_NAME);
}

export async function getCustomers(): Promise<Customer[]> {
  const collection = await getCollection();
  const customers = await collection.find({}).sort({ name: 1 }).toArray();
  return customers.map((cust: any) => {
    const { _id, ...rest } = cust;
    return rest as Customer;
  });
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const collection = await getCollection();
  const customer = await collection.findOne({ id });
  if (!customer) return null;
  const { _id, ...rest } = customer as any;
  return rest as Customer;
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const collection = await getCollection();
  const customer = await collection.findOne({ email: email.toLowerCase() });
  if (!customer) return null;
  const { _id, ...rest } = customer as any;
  return rest as Customer;
}

export async function createCustomer(
  name: string,
  email: string
): Promise<Customer> {
  const collection = await getCollection();
  
  // Check if customer with this email already exists
  const existing = await getCustomerByEmail(email);
  if (existing) {
    return existing;
  }
  
  const customer: Customer = {
    id: uuidv4(),
    name,
    email: email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  await collection.insertOne(customer);
  return customer;
}

export async function updateCustomer(
  id: string,
  name: string,
  email: string
): Promise<Customer | null> {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        name,
        email: email.toLowerCase(),
      },
    },
    { returnDocument: "after" }
  );
  if (!result) return null;
  const { _id, ...rest } = result as any;
  return rest as Customer;
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const collection = await getCollection();
  const result = await collection.deleteOne({ id });
  return result.deletedCount === 1;
}

