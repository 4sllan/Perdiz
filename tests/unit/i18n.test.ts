import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const LOCALES = ['br', 'us', 'pt', 'es'] as const

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

function loadKeys(locale: string): string[] {
  const raw = readFileSync(join(__dirname, `../../i18n/locales/${locale}.json`), 'utf8')
  return flatten(JSON.parse(raw)).sort()
}

const keySets = Object.fromEntries(LOCALES.map((l) => [l, loadKeys(l)]))
const reference = keySets.br

describe('i18n locale files', () => {
  it.each(LOCALES)('%s.json has no missing or extra keys vs br', (locale) => {
    const missing = reference.filter((k) => !keySets[locale].includes(k))
    const extra = keySets[locale].filter((k) => !reference.includes(k))
    expect(missing, `missing in ${locale}`).toEqual([])
    expect(extra, `extra in ${locale}`).toEqual([])
  })

  it.each(LOCALES)('%s.json has no empty translations', (locale) => {
    const raw = JSON.parse(
      readFileSync(join(__dirname, `../../i18n/locales/${locale}.json`), 'utf8'),
    )
    const empties = flatten(raw).filter((key) => {
      const value = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], raw)
      return typeof value !== 'string' || value.trim() === ''
    })
    expect(empties).toEqual([])
  })

  it('marks demo mode explicitly in every locale', () => {
    for (const locale of LOCALES) {
      const raw = JSON.parse(
        readFileSync(join(__dirname, `../../i18n/locales/${locale}.json`), 'utf8'),
      )
      expect(raw.simulation.notice.length).toBeGreaterThan(10)
      expect(raw.simulation.badge.length).toBeGreaterThan(2)
    }
  })
})
