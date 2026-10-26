import { expect, test } from '@playwright/test'

const email = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@perdiz.test`
const password = 'demo-password-1'

async function waitHydration(page: import('@playwright/test').Page) {
  // Aguarda a hidratação vincular o vnode ao input — antes disso, o Vue
  // re-renderiza e apaga valores preenchidos no DOM.
  await page.waitForFunction(
    () => (document.querySelector('input#email') as any)?.__vueParentComponent !== undefined,
    null,
    { timeout: 15_000 },
  )
}

test.describe('auth flows (local supabase)', () => {
  test('register, session, /api/me and admin guard', async ({ page }) => {
    // Admin guard: usuário não autenticado vai para login
    await page.goto('/br/admin')
    await expect(page).toHaveURL(/\/br\/auth\/login/)

    // Cadastro local (confirmations off) cria sessão
    await page.goto('/br/auth/register')
    await waitHydration(page)
    await page.getByLabel('E-mail').fill(email)
    await page.getByLabel('Senha').fill(password)
    await page.getByRole('button', { name: 'Criar conta' }).click()

    // O e-mail fica oculto em viewport mobile (hidden sm:inline);
    // presença no DOM já comprova a sessão + navegação.
    await expect(page.getByText(email)).toBeAttached({ timeout: 15_000 })
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible()

    // /api/me via fetch no contexto da página (compartilha cookies)
    const me = await page.evaluate(() => fetch('/api/me').then((r) => r.json()))
    expect(me.user?.email).toBe(email)
    expect(me.roles).toContain('user')
    expect(me.profile).not.toBeNull()

    // Usuário comum não acessa admin (guard redireciona para home)
    await page.goto('/br/admin')
    await expect(page).toHaveURL(/\/br\/?$/)

    // Guest middleware: logado não volta a /auth/login
    await page.goto('/br/auth/login')
    await expect(page).toHaveURL(/\/br\/?$/)
  })
})
