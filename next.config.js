/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["jirox-bucket.s3.eu-north-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
