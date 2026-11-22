import type { ISODateTime, UserId } from "../../common/primitives"

/** RegisterSerializer response; password is never returned. */
export interface RegisteredUserResponseDto {
  id: UserId
  username: string
  email: string
  first_name: string
  last_name: string
}

/** UserProfileSerializer response for GET/PATCH /api/accounts/me/. */
export interface CurrentUserResponseDto {
  id: UserId
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: ISODateTime
}

export interface DetailMessageResponseDto {
  detail: string
}
