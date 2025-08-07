'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import {LoginSchema } from '@/validation/login'
import 'react-phone-number-input/style.css'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { PasswordInput } from '../PasswordInput'
import { Label } from '../ui/label'
import React from 'react'
import { serialize } from 'cookie'
export const LoginForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: ''
    },
  })
  
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    console.log(form.formState.errors)
    console.log('IS LOADING', isLoading)
    setIsLoading(true)
    try {
      console.log('VALUES FROM REGISTER', values)
      if (!currentPassword) {
        throw new Error('Password is required')
      }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email,
          password: currentPassword,
        }),
      })
      const responseData = await res.json()
      if (!res.ok) {
        throw new Error(responseData.error)
      }
      // Redirect to home if login successfully
      router.push('/')

    } catch (error) {
      console.log(error)
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
          name="email"
          label="Email"
          placeholder="ngothiduyencute@gmail.com"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="space-y-2 flex-1 mt-2 ">
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
         {/* <CustomFormField
          fieldType={FormFieldType.PASSWORD} // Create a new field type for password
          control={form.control}
          name="password"
          label="Mật khẩu"
          placeholder="Mật khẩu"
        /> */}

        <SubmitButton isLoading={isLoading}>Đăng nhập</SubmitButton>
      </form>
    </Form>
  )
}
