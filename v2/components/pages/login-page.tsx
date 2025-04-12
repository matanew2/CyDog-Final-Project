"use client"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to your account to continue">
      <LoginForm />
    </AuthLayout>
  )
}
