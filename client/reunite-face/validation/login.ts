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
    email: z.string().email(INVALID_EMAIL),
    password: z.string().min(6, PASSWORD_LENGTH),
  })
