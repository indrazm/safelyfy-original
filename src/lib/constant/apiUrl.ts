const apiUrlServer = process.env.ENV_MODE === "development" ? "http://localhost:3000/api" : "https://app.safelyfy.com/api"
const apiUrlClient = process.env.NEXT_PUBLIC_ENV_MODE === "development" ? "http://localhost:3000/api" : "https://app.safelyfy.com/api"

export { apiUrlClient, apiUrlServer }
