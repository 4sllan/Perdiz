export default defineNuxtRouteMiddleware(() => {
  const user = useAuthUser()
  if (!user.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/auth/login'))
  }
})
