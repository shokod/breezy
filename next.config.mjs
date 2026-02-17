/** @type {import('next').NextConfig} */
const nextConfig = {
    // Required for Dockerfile to copy .next/standalone output
    output: 'standalone',
};

export default nextConfig;
