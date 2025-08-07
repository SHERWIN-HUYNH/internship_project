import { z } from 'zod'
import { NAME_REQUIRED } from './messageCode'

export const AddRoleSchema = z.object({
  name: z.string().min(1, { message: NAME_REQUIRED }),
})

export const UpdateRoleWithPermissionsSchema = z.object({
  name: z.string().min(1, { message: NAME_REQUIRED }),
  permissionIds: z.array(z.string()),
})

export type AddRoleInputs = z.infer<typeof AddRoleSchema>
