import { z } from 'zod'
import {
  ACADEMICTITLE_REQUIRED,
  DESCRIPTION_LENGTH,
  FACULTY_REQUIRED,
  IMAGE_DOCTOR_REQUIRED,
  INPUT_REQUIRED,
  INVALID_SPECIAL_CHARACTER,
  NAME_DOCTOR_LENGTH,
} from './messageCode/doctor'

export const DoctorFormValidation = z.object({
  name: z
    .string()
    .min(2, INPUT_REQUIRED)
    .max(50, NAME_DOCTOR_LENGTH)
    .refine((name) => /^[\p{L}\s]+$/u.test(name), INVALID_SPECIAL_CHARACTER),
  image: z.string().min(1, IMAGE_DOCTOR_REQUIRED),
  academicTitle: z.string().min(1, ACADEMICTITLE_REQUIRED),
  faculty: z.string().min(1, FACULTY_REQUIRED),
  description: z.string().min(1, INPUT_REQUIRED).max(500, DESCRIPTION_LENGTH),
  isActive: z.boolean(),
  gender: z.boolean(),
})
