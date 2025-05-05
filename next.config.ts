import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/index/:path*",
      destination: "/index-dashboard/:path*",
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  experimental: {
    ppr: true,
    authInterrupts: true,
    inlineCss: true,
    reactCompiler: true,
    optimizePackageImports: ["react-icons", "lucide-react"],
  },
};

export default nextConfig;
