import tailwindcss from '@tailwindcss/vite'
import PerdizPreset from './app/assets/theme/perdiz.preset'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-24',
  modules: ['@nuxt/fonts', '@nuxt/icon', '@primevue/nuxt-module', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  primevue: {
    options: {
      ripple: false,
      theme: {
        preset: PerdizPreset,
        options: {
          cssLayer: {
            name: 'primevue',
            order: 'theme, base, primevue, components, utilities',
          },
        },
      },
    },
  },
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'br',
    locales: [
      { code: 'br', language: 'pt-BR', name: 'Português (Brasil)', file: 'br.json' },
      { code: 'us', language: 'en-US', name: 'English (US)', file: 'us.json' },
      { code: 'pt', language: 'pt-PT', name: 'Português (Portugal)', file: 'pt.json' },
      { code: 'es', language: 'es-ES', name: 'Español', file: 'es.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'perdiz_locale',
      redirectOn: 'root',
      fallbackLocale: 'br',
      alwaysRedirect: false,
    },
    vueI18n: './i18n.config.ts',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: false },
  typescript: { strict: true },
  runtimeConfig: {
    // Somente servidor (Nitro). Nunca usar prefixo NUXT_PUBLIC_* aqui.
    supabaseServiceRoleKey: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Perdiz | Protótipo de mercados de previsão',
      meta: [
        {
          name: 'description',
          content:
            'Fundação da Perdiz: um protótipo independente de mercados de previsão, exclusivamente com operações fictícias.',
        },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    },
  },
})
