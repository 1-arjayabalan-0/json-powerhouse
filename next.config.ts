import type { NextConfig } from "next";
import { toolRedirects } from "./src/app/config/tool-redirects";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Short tool URLs (/tools/json-formatter) were reported as 404 in Search Console.
  // Send them permanently to the real page (/tools/json/formatter).
  async redirects() {
    return toolRedirects();
  },
};

export default nextConfig;
