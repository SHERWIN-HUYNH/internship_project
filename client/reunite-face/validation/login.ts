import { z } from 'zod'
import {
  INCORRECT_PASSWORD,
  INPUT_REQUIRED,
  INVALID_EMAIL,
  MAX_lENGTH_PHONE,
  MIN_LENGTH_PHONE,
  NAME_LENGTH,
  PASSWORD_LENGTH,
} from './messageCode/authentication'

export const LoginSchema = z
  .object({
    username: z.string().min(2, NAME_LENGTH),
    email: z.string().email(INVALID_EMAIL),
    password: z.string().min(6, PASSWORD_LENGTH),
    phoneNumber: z.string().min(10, MIN_LENGTH_PHONE).max(11, MAX_lENGTH_PHONE),
    passwordConfirm: z.string().min(6, {}),
    role: z.enum(['ADMIN', 'DOCTOR'], {
      required_error: INPUT_REQUIRED,
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: INCORRECT_PASSWORD,
    path: ['passwordConfirm'],
  })
