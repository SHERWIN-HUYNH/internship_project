'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { UserLogin } from '@/lib/validation'
import 'react-phone-number-input/style.css'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { toast } from 'sonner'
import { PasswordInput } from '../PasswordInput'
import { Label } from '../ui/label'
import { signIn, useSession } from 'next-auth/react'
import React from 'react'
export const LoginForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof UserLogin>>({
    resolver: zodResolver(UserLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  useEffect(() => {
    if (session?.user.roleName === 'USER') {
      router.push('/')
    }
    if (session?.user.roleName === 'ADMIN') {
      router.push('/admin')
    }
  }, [session, router])
  const onSubmit = async (values: z.infer<typeof UserLogin>) => {
    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        email: values.email,
        password: currentPassword,
        redirect: false,
      })
      if (res?.error) {
        toast.error(res.error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Xin chào 👋</h1>
          <p className="text-dark-700">
            Bước đầu của sức khỏe tốt hơn – Đặt lịch hẹn ngay hôm nay!
          </p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="ngothiduyencute@gmail.com"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="space-y-2 flex-1 mt-2">
          <Label htmlFor="current_password" className="shad-input-label ">
            Mật khẩu
          </Label>
          <PasswordInput
            id="current_password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <SubmitButton isLoading={isLoading}>Đăng nhập</SubmitButton>
      </form>
    </Form>
  )
}
