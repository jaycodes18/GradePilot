/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "three", "@react-three/drei"],
  },
  transpilePackages: ["three"],
};

export default nextConfig;
