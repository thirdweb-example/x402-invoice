# x402 Invoice

A simple Next.js application for creating and paying invoices on the Arb network using thirdweb's X402 payment system.

## Features

- 🧾 Create invoices with customer details
- 💰 Pay invoices directly on Arb network using thirdweb
- 📊 Dashboard to view all invoices
- ✅ Payment confirmation with transaction details
- 🔗 Direct links to ArbScan for transaction verification

## Tech Stack

- **Next.js 14** - React framework with App Router
- **thirdweb** - Web3 SDK for wallet connections and payments
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **MongoDB** - Database for invoice storage

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file:
```
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
THIRDWEB_SECRET_KEY=your-thirdweb-secret-key
SERVER_WALLET_ADDRESS=0xYourWalletAddress
MONGODB_URI=mongodb://localhost:27017/basepay-invoice
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create Invoice**: Navigate to `/new` and fill in the invoice details
2. **View Invoice**: Share the invoice link `/invoice/[id]` with the customer
3. **Pay Invoice**: Customer connects wallet and clicks "Pay with Arb"
4. **Success**: After payment, view transaction details on ArbScan

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── invoices/route.ts    # Create invoice endpoint
│   │   └── pay/route.ts          # Payment processing with X402
│   ├── invoice/[id]/page.tsx     # Invoice view page
│   ├── new/page.tsx              # Create invoice page
│   ├── success/[id]/page.tsx    # Payment success page
│   └── page.tsx                  # Dashboard
├── components/
│   ├── invoice-payment.tsx       # Payment component
│   └── ui/                       # shadcn components
└── lib/
    └── invoices.ts               # Invoice storage utilities
```

## Notes

- Invoices are stored in MongoDB database
- Payments use thirdweb's X402 payment system
- All transactions are on Arb network

