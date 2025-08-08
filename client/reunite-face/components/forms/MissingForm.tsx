import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import SubmitButton from '../SubmitButton'
import CustomFormField, { FormFieldType } from '../CustomFormField'
import { useState } from 'react'
import { LoginSchema } from '@/validation/login'
import z from 'zod'
const MissingForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    
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
           
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                email: values.email,
               
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
        
        <SubmitButton isLoading={isLoading}>Đăng nhập</SubmitButton>
      </form>
        </Form>
    )
}