/**
 * Exports publics du module auth
 */
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'
export {
    useAuth,
    useLogin,
    useLogout,
    useAuthenticatedUser,
    useRegisterSubscriber,
    useForgotPassword,
    useResetPassword,
    useSetPassword,
    useCreateUserByAdmin,
} from './hooks/useAuth'
export { useAuthStore } from './stores/useAuthStore'
export type { ResetPasswordPayload, CreateAdminUserPayload } from './hooks/useAuth'
