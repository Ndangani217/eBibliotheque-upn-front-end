// src/features/auth/api.ts
import api from '@/services/api'
import type { User } from '@/types/user'

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    category: string
    role?: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    newPassword: string
    confirmPassword: string
}

export interface SetPasswordPayload {
    userId: string
    password: string
    confirmPassword: string
}

export interface AuthResponse {
    token: string
    user: User
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post('/auth/login', payload)
    return data.data
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
    const { data } = await api.post('/auth/register-subscriber', payload)
    return data
}

export async function logout(): Promise<void> {
    await api.delete('/auth/logout')
}

// Mot de passe oublié
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    const { data } = await api.post('/auth/forgot-password', payload)
    return data
}

// 2. Réinitialisation de mot de passe (avec token reçu par e-mail)
export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
    const { data } = await api.post(`/auth/reset-password/${payload.token}`, payload)
    return data
}

// 3. Définir le mot de passe (activation du compte)
export async function setPassword(payload: SetPasswordPayload): Promise<{ message: string }> {
    const { data } = await api.post('/auth/set-password', payload)
    return data
}
