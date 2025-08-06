import { z } from 'zod'
import {
  INCORRECT_PASSWORD,
  INPUT_REQUIRED,
  INVALID_EMAIL,
  NAME_LENGTH,
  PASSWORD_LENGTH,
  MIN_LENGTH_PHONE,
  MAX_lENGTH_PHONE,
} from './messageCode/authentication'

export const RegisterSchema = z
  .object({
    username: z.string().min(2, NAME_LENGTH),
    email: z.string().email(INVALID_EMAIL),
    password: z.string().min(6, PASSWORD_LENGTH),
    phone: z.string().min(10, MIN_LENGTH_PHONE).max(11, MAX_lENGTH_PHONE),
    passwordConfirm: z.string().min(6, {}),
    role: z
      .enum(['ADMIN', 'DOCTOR'], {
        required_error: INPUT_REQUIRED,
      })
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: INCORRECT_PASSWORD,
    path: ['passwordConfirm'],
  })
export const RegisterUser = z.object({
  username: z.string().min(2, NAME_LENGTH),
  email: z.string().email(INVALID_EMAIL),
  password: z.string().min(6, PASSWORD_LENGTH).optional(),
  phone: z.string().min(10, MIN_LENGTH_PHONE).max(11, MAX_lENGTH_PHONE),
})
export const RegisterUser2 = z.object({
  username: z.string().min(2, NAME_LENGTH),
  email: z.string().email(INVALID_EMAIL),
  phone: z.string().min(10, MIN_LENGTH_PHONE).max(11, MAX_lENGTH_PHONE),
})
