import type { NextConfig } from "next";

// Public *.vercel.app aliases of the production deployment. Each one permanently redirects
// to the same path on www.frankjkim.com so search engines index only one domain.
// Preview deployments use other hostnames and are left alone.
const PRODUCTION_ALIASES = ["website-zrug.vercel.app", "website-dun-nu-47.vercel.app"];

const config: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return PRODUCTION_ALIASES.map((host) => ({
      source: "/:path*",
      // `value` is matched as a regex, so escape the dots
      has: [{ type: "host" as const, value: host.replace(/\./g, "\\.") }],
      destination: "https://www.frankjkim.com/:path*",
      permanent: true,
    }));
  },
};

export default config;
