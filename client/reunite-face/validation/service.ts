import { z } from 'zod'
import {
  DESCRIPTION_LENGTH,
  INPUT_REQUIRED,
  INVALID_PRICE,
  NAME_SERVICE_LENGTH,
} from './messageCode/service'
import { FACULTY_REQUIRED } from './messageCode/doctor'

export const ServiceFormValidation = z.object({
  name: z.string().min(2, INPUT_REQUIRED).max(50, NAME_SERVICE_LENGTH),
  description: z.string().max(500, DESCRIPTION_LENGTH),
  price: z
    .string()
    .refine((price) => /^\d{1,10}(\.\d{1,2})?$/.test(price), INVALID_PRICE),
  facultyId: z.string().refine((value) => value !== '', { message: FACULTY_REQUIRED }),
})
