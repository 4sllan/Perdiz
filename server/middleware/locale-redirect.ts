import { getCookie, getHeader, getRequestURL, sendRedirect } from 'h3'

const LOCALES = ['br', 'us', 'pt', 'es'] as const
type Locale = (typeof LOCALES)[number]
const DEFAULT_LOCALE: Locale = 'br'

// En | es mantêm região única; pt-PT vai para /pt, demais pt-* para /br.
function detectLocale(acceptLanguage: string): Locale | undefined {
  for (const part of acceptLanguage.split(',')) {
    const tag = part.trim().split(';')[0]?.toLowerCase()
    if (!tag) {
      continue
    }
    if (tag === 'pt-pt') {
      return 'pt'
    }
    const lang = tag.split('-')[0]
    if (lang === 'pt') {
      return 'br'
    }
    if (lang === 'en') {
      return 'us'
    }
    if (lang === 'es') {
      return 'es'
    }
  }
  return undefined
}

/**
 * Redireciona rotas sem prefixo de locale, preservando caminho e query.
 * A raiz '/' é tratada pela detecção do próprio @nuxtjs/i18n
 * (redirectOn: 'root'); rotas já prefixadas nunca são redirecionadas.
 */
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  const isAsset = path.startsWith('/_nuxt') || path.includes('.')
  const isInternal = path.startsWith('/api/') || path.startsWith('/__')
  if (path === '/' || isAsset || isInternal) {
    return
  }

  const first = path.split('/')[1]
  if (LOCALES.includes(first as Locale)) {
    return
  }

  const cookie = getCookie(event, 'perdiz_locale')
  const locale = LOCALES.includes(cookie as Locale)
    ? (cookie as Locale)
    : (detectLocale(getHeader(event, 'accept-language') ?? '') ?? DEFAULT_LOCALE)

  return sendRedirect(event, `/${locale}${path}${url.search}`, 302)
})
