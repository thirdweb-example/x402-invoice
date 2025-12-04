"use client";

import Link from "next/link";
import { WalletConnect } from "./wallet-connect";
import { FileText, Github } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">x402 Invoice</span>
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/thirdweb-example/x402-invoice"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="View on GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">GitHub</span>
            </a>
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  );
}

