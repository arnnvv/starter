import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
