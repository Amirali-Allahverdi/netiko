/** POST /api/accounts/register/ — password is write-only. */
export interface RegisterAccountRequestDto {
  username: string;
  password: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

/** PATCH/PUT /api/accounts/me/. ID, username and date_joined are read-only. */
export interface UpdateCurrentUserRequestDto {
  email?: string;
  first_name?: string;
  last_name?: string;
}

/** POST /api/accounts/change-password/. */
export interface ChangePasswordRequestDto {
  old_password: string;
  new_password: string;
}
