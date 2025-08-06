import { z } from 'zod'
export const UserLogin = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
})