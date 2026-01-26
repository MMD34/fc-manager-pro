import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import AppBackground from '@/components/layout/AppBackground'

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
    <AppBackground>
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-indigo-300">
              <User className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-100">Create your account</h1>
            <p className="mt-2 text-sm text-slate-300">Join FC Manager Pro and track every season.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Display Name"
              placeholder="John Doe"
              icon={<User className="h-4 w-4" />}
              error={errors.displayName?.message}
              {...register('displayName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(event) => setShowPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-indigo-400 focus:ring-indigo-400/40"
                />
                Show password
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConfirmPassword}
                  onChange={(event) => setShowConfirmPassword(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-indigo-400 focus:ring-indigo-400/40"
                />
                Show confirm password
              </label>
            </div>
            {authError && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {authError}
              </div>
            )}
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-slate-300">Already have an account? </span>
            <Link to="/login" className="text-indigo-300 hover:text-indigo-200">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </AppBackground>
  )
}
