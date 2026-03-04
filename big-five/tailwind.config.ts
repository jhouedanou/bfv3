import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
    content: [
        './app/components/**/*.{vue,js,ts}',
        './app/layouts/**/*.vue',
        './app/pages/**/*.vue',
        './app/app.vue',
    ],
    theme: {
        extend: {
            colors: {
                'primary-deep': 'var(--color-primary-deep)',
                'primary': 'var(--color-primary)',
                'primary-light': 'var(--color-primary-light)',
                'accent-magenta': 'var(--color-accent-magenta)',
                'accent-purple': 'var(--color-accent-purple)',
                'text-white': 'var(--color-text-white)',
                'text-light': 'var(--color-text-light)',
                'text-muted': 'var(--color-text-muted)',
                'footer-bg': 'var(--color-footer-bg)',
                'footer-text': 'var(--color-footer-text)',
            },
            fontFamily: {
                display: ['var(--font-display)'],
                heading: ['var(--font-heading)'],
                body: ['var(--font-body)'],
            },
            backgroundImage: {
                'gradient-hero': 'var(--gradient-hero)',
                'gradient-card': 'var(--gradient-card)',
                'gradient-button': 'var(--gradient-button)',
            }
        },
    },
    plugins: [],
}
