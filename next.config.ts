import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In dev, Next.js only serves its scripts to http://localhost:3000. If you open
  // the site as http://127.0.0.1:3000, the page shows but buttons do nothing
  // (the JavaScript is blocked), so we allow that hostname too.
  allowedDevOrigins: ["127.0.0.1"],

  experimental: {
    serverActions: {
      // Server Actions accept 1 MB by default, too small for photos. The admin
      // forms upload up to a few 5 MB images at once through an action.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
