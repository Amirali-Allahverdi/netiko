import { z } from "zod"
import { ISODateTimeSchema, UserIdSchema } from "../../common/schemas"

export const RegisterAccountRequestSchema = z.object({
  username: z.string().min(1).max(150),
  password: z.string().min(1),
  email: z.string().email().or(z.literal("")).optional(),
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
})

export const UpdateCurrentUserRequestSchema = z.object({
  email: z.string().email().or(z.literal("")).optional(),
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
})

export const ChangePasswordRequestSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(1),
})

export const RegisteredUserResponseSchema = z.object({
  id: UserIdSchema,
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
})

export const CurrentUserResponseSchema = RegisteredUserResponseSchema.extend({
  date_joined: ISODateTimeSchema,
})

export const DetailMessageResponseSchema = z.object({ detail: z.string() })
