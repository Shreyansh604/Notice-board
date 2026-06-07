/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
};

export default nextConfig;