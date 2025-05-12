import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
<<<<<<< HEAD
    authInterrupts: true,
=======
>>>>>>> ff25a02 (Next canary.)
    inlineCss: true,
    reactCompiler: true,
    optimizePackageImports: ["react-icons", "lucide-react"],
  },
};

export default nextConfig;
