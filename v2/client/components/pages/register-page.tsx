"use client"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export function RegisterPage() {
  return (
    <AuthLayout title="Create an Account" subtitle="Join our platform and get started today">
      <RegisterForm />
    </AuthLayout>
  )
}
