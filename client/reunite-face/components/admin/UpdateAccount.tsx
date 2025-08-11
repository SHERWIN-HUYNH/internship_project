'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../ui/input'
import { PasswordInput } from '../PasswordInput'
import SubmitButton from '../SubmitButton'
import { UserUpdate } from '@/repositories/user'
import { useSession } from 'next-auth/react'
import { UpdateAccountValidation } from '@/validation/updateAccount'
import { uploadFileToCloudinary } from '@/helpers/upload-image'
import { toast } from 'sonner'
import { CldImage } from 'next-cloudinary'

const UpdateAccount = () => {
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<UserUpdate>()
  const { data: session } = useSession()
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    session?.user.image ?? null,
  )

  const form = useForm<z.infer<typeof UpdateAccountValidation>>({
    resolver: zodResolver(UpdateAccountValidation),
    defaultValues: {
      username: session?.user.name ?? '',
      email: session?.user.email ?? '',
      oldPassword: '',
      phone: session?.user.phone?.slice(0) ?? '',
      image: session?.user.image ?? '',
    },
  })

  const { reset } = form

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const temporaryUrl = URL.createObjectURL(file)
    setUploadedImage(temporaryUrl)

    try {
      const result = await uploadFileToCloudinary(file)
      if (!result) {
        toast.error('Tải ảnh lên thất bại. Vui lòng thử lại!')
        return
      }
      setUploadedImage(result)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải ảnh.')
    }
  }

  useEffect(() => {
    const fetchDate = async () => {
      const res = await fetch(`/api/account/${session?.user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const responseData = await res.json()
      if (res.ok) {
        setData(responseData)
        reset({
          username: responseData.name ?? '',
          email: responseData.email ?? '',
          oldPassword: '',
          phone: responseData.phone ?? '',
          image: responseData.image ?? '',
        })
        if (responseData.image) {
          setUploadedImage(responseData.image)
        }
      }
    }
    fetchDate()
  }, [session?.user.id, reset])

  const onSubmit = async (values: z.infer<typeof UpdateAccountValidation>) => {
    try {
      setIsLoading(true)
      const update = await fetch(`/api/account/${session?.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      if (!update.ok) {
        toast.error('Cập nhật thông tinkhông thành công.')
      }
      toast.success('Cập nhật thông tin thành công!')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!uploadedImage) {
      toast.error('Vui lòng tải lên một hình ảnh!')
      return
    }
    try {
      const response = await fetch(`/api/account/${session?.user.id}/updateImage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: uploadedImage }),
      })
      if (!response.ok) {
        toast.error('Cập nhật ảnh đại diện không thành công!')
        return
      }
      toast.success('Cập nhật ảnh thành công!')
    } catch (error) {
      toast.error('Đã xảy ra lỗi trong quá trình cập nhật.')
      console.error(error)
    }
  }
  return (
    <div className="grid grid-cols-5 gap-8 mt-5">
      <div className="col-span-5 xl:col-span-3">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Thông tin cá nhân</h3>
          </div>
          <div className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="mb-4 w-full sm:w-1/2">
                        <FormLabel className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Họ và tên
                        </FormLabel>
                        <FormControl>
                          <Input
                            customProp={''}
                            placeholder="Nguyễn văn A"
                            {...field}
                            type="text"
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage className="shad-error" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="mb-4 w-full sm:w-1/2">
                        <FormLabel className="mb-3 block text-sm font-medium text-black dark:text-white">
                          Số điện thoại
                        </FormLabel>
                        <FormControl>
                          <Input
                            customProp={''}
                            placeholder="Nguyễn văn A"
                            {...field}
                            type="text"
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage className="shad-error" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-5.5">
                      <FormLabel className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Email
                      </FormLabel>

                      <Input
                        customProp={''}
                        placeholder="Nguyễn văn A"
                        {...field}
                        type="email"
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />

                      <FormMessage className="shad-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="mb-5.5">
                      <FormLabel className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Password
                      </FormLabel>

                      <PasswordInput
                        placeholder="Mật khẩu cũ"
                        {...field}
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                      <FormMessage className="shad-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="mb-5.5">
                      <FormLabel className="mb-3 block text-sm font-medium text-black dark:text-white">
                        Password
                      </FormLabel>
                      <PasswordInput
                        placeholder="Mật khẩu mới"
                        {...field}
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-6 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                      <FormMessage className="shad-error" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4.5">
                  <SubmitButton
                    isLoading={isLoading}
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Lưu{' '}
                  </SubmitButton>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="col-span-5 xl:col-span-2">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Your Photo</h3>
          </div>
          <div className="p-7">
            <form onSubmit={handleSubmit}>
              <div
                id="FileUpload"
                className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray px-4 py-4 dark:bg-meta-4 sm:py-7.5"
                style={{
                  height: '400px',
                }}
              >
                <Input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                  onChange={handleImageUpload}
                  customProp={''}
                />
                {!uploadedImage && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <span className="flex h-50 w-50 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark"></span>
                    <p>
                      <span className="text-primary">Click to upload</span> or drag and
                      drop
                    </p>
                    <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                    <p>(max, 800 X 800px)</p>
                  </div>
                )}

                {uploadedImage && (
                  <div className="w-full h-full">
                    <CldImage
                      src={uploadedImage}
                      alt="User avatar"
                      width={800}
                      height={800}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4.5">
                <SubmitButton
                  isLoading={isLoading}
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                >
                  Save
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateAccount
