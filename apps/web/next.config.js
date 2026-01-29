/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@laurel/api", "@laurel/db", "@laurel/shared", "@laurel/opik"],

  // Experimental features for Next.js 14
  experimental: {
    // Mark Opik SDK and its Node.js dependencies as server-only external packages
    serverComponentsExternalPackages: ["opik", "nunjucks", "chokidar"],
  },

  webpack: (config, { isServer }) => {
    // Ignore native .node modules
    config.module.rules.push({
      test: /\.node$/,
      use: "ignore-loader",
    });

    // For client-side bundle, replace problematic packages with empty modules
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        opik: false,
        nunjucks: false,
        chokidar: false,
        fsevents: false,
      };

      // Also fallback certain Node.js modules to false
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
