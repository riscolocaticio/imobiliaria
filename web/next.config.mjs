/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        HOST: process.env.HOST
    }
}

export default nextConfig
