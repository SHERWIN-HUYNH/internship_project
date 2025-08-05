'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import 'react-phone-number-input/style.css'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import { PasswordInput } from '../PasswordInput'
import React from 'react'
import { RegisterUser2 } from '@/validation/register'
export const RegisterForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const form = useForm<z.infer<typeof RegisterUser2>>({
    resolver: zodResolver(RegisterUser2),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof RegisterUser2>) => {
    console.log(form.formState.errors)
    console.log('IS LOADING', isLoading)
    setIsLoading(true)
    try {
      console.log('VALUES FROM REGISTER', values)
      if (!currentPassword) {
        throw new Error('Password is required')
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: currentPassword,
          username: values.username,
          phone: values.phone,
        }),
      })
      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error)
      }

      toast.success('Registered successfully')
      router.push('/login')
    } catch (error) {
      if (error instanceof Error) {
        console.log('ERROR HAPPEN')
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }
  console.log(form.formState.errors)
  console.log(isLoading)
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
          name="username"
          label="Họ và tên"
          placeholder="Ngô Thị Duyên"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="ngothiduyencute@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="phone"
          label="Số điện thoại"
          placeholder="(555) 123-4567"
          type="number"
        />
        <div className="space-y-2 flex-1 mt-2">
          <Label htmlFor="password" className="shad-input-label ">
            Mật khẩu
          </Label>
          <PasswordInput
            id="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="password"
          />
        </div>

        <SubmitButton isLoading={isLoading}>Đăng ký tài khoản </SubmitButton>
      </form>
    </Form>
  )
}
