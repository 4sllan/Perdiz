import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-24',
  modules: ['@nuxt/fonts', '@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: false },
  typescript: { strict: true },
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
