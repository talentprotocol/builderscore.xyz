"use client";

import { frameConnector } from "@/app/lib/connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [frameConnector()],
});

const queryClient = new QueryClient();

// TODO: If we intend to interact with the user's Farcaster wallet, we need to
// add the Farcaster provider to our App.
function FarcasterProviderComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export const FarcasterProvider = dynamic(
  () => Promise.resolve(FarcasterProviderComponent),
  { ssr: false },
);
