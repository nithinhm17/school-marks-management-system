// tailwind.config.js
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#6366f1',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f1f5f9',
                muted: '#94a3b8',
                success: '#22c55e',
                danger: '#ef4444',
                warning: '#f59e0b',
            },
        },
    },
    plugins: [],
}
