import { z } from 'zod'
import {
  DESCRIPTION_LENGTH,
  IMAGE_FACULTY_REQUIRED,
  INPUT_REQUIRED,
  NAME_FACULTY_LENGTH,
} from './messageCode/faculty'

export const FacultyFormValidation = z.object({
  name: z.string().min(2, INPUT_REQUIRED).max(50, NAME_FACULTY_LENGTH),
  description: z.string().min(1, INPUT_REQUIRED).max(500, DESCRIPTION_LENGTH),
  image: z.string().min(1, IMAGE_FACULTY_REQUIRED),
})
