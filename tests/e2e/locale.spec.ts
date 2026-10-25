import { expect, test } from '@playwright/test'

test.describe('locale detection and routes', () => {
  test('redirects / to /br when no language hint exists', async ({ request }) => {
    const response = await request.get('/', { maxRedirects: 0 })
    expect(response.status()).toBe(302)
    expect(response.headers()['location']).toBe('/br')
  })

  test('redirects / to /us for en-US Accept-Language', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'Accept-Language': 'en-US,en;q=0.9' },
    })
    expect(response.status()).toBe(302)
    expect(response.headers()['location']).toBe('/us')
  })

  test('redirects / to /es for es Accept-Language', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'Accept-Language': 'es-ES,es;q=0.9' },
    })
    expect(response.status()).toBe(302)
    expect(response.headers()['location']).toBe('/es')
  })

  test('falls back to /br for unsupported language', async ({ request }) => {
    const response = await request.get('/', {
      maxRedirects: 0,
      headers: { 'Accept-Language': 'fr-FR,fr;q=0.9' },
    })
    expect(response.status()).toBe(302)
    expect(response.headers()['location']).toBe('/br')
  })

  test('does not redirect an already prefixed route', async ({ request }) => {
    for (const path of ['/br', '/pt']) {
      const response = await request.get(path, {
        headers: { 'Accept-Language': 'en-US' },
      })
      expect(response.status()).toBe(200)
    }
  })

  test('redirects unprefixed paths preserving path and query', async ({
    request,
  }) => {
    const response = await request.get('/mercados?cat=x', {
      maxRedirects: 0,
      headers: { 'Accept-Language': 'en-US' },
    })
    expect(response.status()).toBe(302)
    expect(response.headers()['location']).toBe('/us/mercados?cat=x')
  })

  test('renders localized content per prefix', async ({ page }) => {
    await page.goto('/us')
    await expect(page.getByRole('heading', { level: 1, name: /The future begins/ })).toBeVisible()
    await expect(page.getByText('Demo mode — no real money')).toBeVisible()

    await page.goto('/es')
    await expect(page.getByRole('heading', { level: 1, name: /El futuro empieza/ })).toBeVisible()
    await expect(page.getByText('Modo demostración — sin dinero real')).toBeVisible()

    await page.goto('/pt')
    await expect(page.getByRole('heading', { level: 1, name: /O futuro começa/ })).toBeVisible()
    await expect(page.getByText('Modo de demonstração — sem dinheiro real')).toBeVisible()
  })
})
