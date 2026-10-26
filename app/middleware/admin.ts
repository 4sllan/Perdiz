export default defineNuxtRouteMiddleware(async () => {
  const user = useAuthUser()
  const localePath = useLocalePath()
  if (!user.value) {
    return navigateTo(localePath('/auth/login'))
  }

  const roles = useAuthRoles()
  if (roles.value.length === 0) {
    await refreshAuthState()
  }
  if (!roles.value.includes('admin')) {
    return navigateTo(localePath('/'))
  }
})
