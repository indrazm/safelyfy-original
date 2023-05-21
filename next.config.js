/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: process.env.ENV_MODE,
        APP_URL: process.env.APP_URL,
        DEV_URL: process.env.DEV_URL,
    },
}

module.exports = nextConfig
