import { z } from 'zod'
export const UserLogin = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})

export const RegisterUser = z.object({
  username: z.string().min(2, NAME_LENGTH),
  email: z.string().email(INVALID_EMAIL),
  phone: z.string().min(10, MIN_LENGTH_PHONE).max(11, MAX_lENGTH_PHONE),
})
