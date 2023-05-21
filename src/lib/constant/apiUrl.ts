const apiUrlServer = process.env.ENV_MODE === "development" ? `${process.env.DEV_URL}/api` : `${process.env.APP_URL}/api`
const apiUrlClient = process.env.NEXT_PUBLIC_ENV_MODE === "development" ? `${process.env.NEXT_PUBLIC_DEV_URL}/api` : `${process.env.NEXT_PUBLIC_APP_URL}/api`

export { apiUrlClient, apiUrlServer }
