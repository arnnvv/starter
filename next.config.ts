import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  serverExternalPackages: ["@node-rs/argon2"],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
