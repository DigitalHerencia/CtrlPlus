import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './features/**/*.{ts,tsx}',
        './lib/**/*.{ts,tsx}',
    ],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        color: 'var(--foreground)',
                        h1: { color: 'var(--foreground)' },
                        h2: { color: 'var(--foreground)' },
                        h3: { color: 'var(--foreground)' },
                        h4: { color: 'var(--foreground)' },
                        strong: { color: 'var(--foreground)' },
                        a: { color: 'var(--primary)' },
                        code: { color: 'var(--foreground)' },
                        blockquote: {
                            color: 'var(--foreground)',
                            borderLeftColor: 'var(--border)',
                        },
                    },
                },
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInUp: {
                    '0%': { opacity: '0', transform: 'translateY(0.5rem)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-in-up': 'slideInUp 0.2s ease-out',
            },
        },
    },
    plugins: [typography],
}

export default config
