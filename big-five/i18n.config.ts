export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr: {
            welcome: 'Bienvenue',
            langSwitch: 'English'
        },
        en: {
            welcome: 'Welcome',
            langSwitch: 'Français'
        }
    }
}))
