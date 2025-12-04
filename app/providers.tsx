"use client";

import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider as ThirdwebProviderClient } from "thirdweb/react";
import { arbitrum } from "thirdweb/chains";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id";

const client = createThirdwebClient({
  clientId: clientId,
});

export function ThirdwebProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProviderClient client={client} activeChain={arbitrum}>
      {children}
    </ThirdwebProviderClient>
  );
}

