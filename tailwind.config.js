/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            borderWidth: {
                1: "1px",
            },
            borderRadius: {
                md: "0.55em",
            },
        },
    },
    plugins: [],
}
