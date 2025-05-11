/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_ZEGO_APP_ID: 530563876,
    NEXT_PUBLIC_ZEGO_SERVER_SECRET: "0c50887862f521c6df95289884bbce2e",
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMAGES_DOMAIN],
  },
};

module.exports = nextConfig;
