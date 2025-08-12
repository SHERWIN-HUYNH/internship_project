import z from "zod";

export const LoginSchema = z
  .object({
    name: z.string().min(6, { message: 'Name is required' }),
    gender:z
    .enum(['Male', 'Female'], {
      errorMap: (issue) => {
        if (issue.code === 'invalid_type') {
          return { message: 'Please select a gender' };
        }
        if (issue.code === 'invalid_enum_value') {
          return { message: 'Gender must be either "male" or "female"' };
        }
        return { message: 'Invalid gender value' };
      },
    }),
    relationship: z.string().min(2, { message: 'Relationship is required' }),
    contact_phone: z.string().min(10, { message: 'Contact phone is required' }),

  })
