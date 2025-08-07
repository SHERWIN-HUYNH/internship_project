import { z } from 'zod'
import { INVALID_EMAIL } from './messageCode'

export const UpdateUserWithRolesSchema = z.object({
  email: z.string().email({
    message: INVALID_EMAIL,
  }),
  roleIds: z.array(z.string()).nonempty(),
})
