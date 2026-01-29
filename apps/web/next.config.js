/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@laurel/api", "@laurel/db", "@laurel/shared", "@laurel/opik"],
};

module.exports = nextConfig;
