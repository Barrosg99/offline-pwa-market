// next.config.mjs
import withPWAinit from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // CUIDADO: Permite qualquer hostname
      },
      {
        protocol: "http",
        hostname: "**", // CUIDADO: Permite qualquer hostname
      },
    ],
  },
};

const withPWA = withPWAinit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWA(nextConfig);
