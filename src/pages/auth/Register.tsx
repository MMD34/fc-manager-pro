import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card'

const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const { signUp, authError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true)
    try {
      await signUp(data.email, data.password, data.displayName)
      navigate('/dashboard')
    } catch (error) {
      // authError is set in the store
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Get started with FC Manager Pro</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Display Name"
              placeholder="John Doe"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                Show password
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={(event) => setShowConfirmPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                Show confirm password
              </label>
            </div>
            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                {authError}
              </div>
            )}
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
