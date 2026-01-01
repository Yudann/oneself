import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}", // in case classes are there
    ],
    theme: {
        extend: {
            colors: {
                app: 'var(--app-bg)',
                sidebar: 'var(--sidebar-bg)',
                card: 'var(--card-bg)',
                border: 'var(--border-color)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Instrument Serif', 'serif'],
            },
        },
    },
    plugins: [],
};
export default config;
