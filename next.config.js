/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.ENV_MODE,
    },
}

module.exports = nextConfig
