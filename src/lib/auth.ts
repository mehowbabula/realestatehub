// Temporary stubs kept for compile-time while migrating to NextAuth
export const authenticateUser = async (_email: string, _password: string) => ({ success: false, error: 'NextAuth in progress' })
export const isAuthenticated = () => false
export const getCurrentUser = () => null
export const logout = () => {}