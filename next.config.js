/** @type {import('next').NextConfig} */
const { paraglideWebpackPlugin } = require("@inlang/paraglide-js");
const createMDX = require("@next/mdx");

const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

module.exports = withMDX(nextConfig);
