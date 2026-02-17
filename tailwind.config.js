/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'app-bg': '#0B1220',
                'app-bg-light': '#1a2332',
                'app-card': '#1E293B',
                'app-accent': '#34D399', // Softer emerald
                'app-accent-dim': '#10B981',
                'app-text': '#F1F5F9',
                'app-text-dim': '#94A3B8',
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Montserrat', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                'glass': '12px',
            },
            boxShadow: {
                'glow': '0 0 40px rgba(52, 211, 153, 0.15)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            dropShadow: {
                'glow': '0 0 20px rgba(52, 211, 153, 0.3)',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
