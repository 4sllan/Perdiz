import { expect, test } from '@playwright/test'

test('renders the foundation and simulation notice with SSR', async ({ page, request }) => {
  const response = await request.get('/')

  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('sem dinheiro real')

  await page.goto('/br')
  await expect(page.getByRole('heading', { level: 1, name: /O futuro começa/ })).toBeVisible()
  await expect(
    page.getByText('Modo demonstração — sem dinheiro real', { exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Mercados, contas e negociação ainda não estão disponíveis.'),
  ).toBeVisible()
})
