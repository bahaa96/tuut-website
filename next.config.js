/** @type {import('next').NextConfig} */
const { paraglideWebpackPlugin } = require("@inlang/paraglide-js");

const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: "my-value",
  },
  turbopack: {},
  webpack: (config) => {
    config.plugins.push(
      paraglideWebpackPlugin({
        outdir: "./src/paraglide",
        project: "./project.inlang",
        strategy: ["url", "cookie", "baseLocale"],
      })
    );
    return config;
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
