import type { JsonValue } from "./primitives"

/** DRF errors may be a `detail` object or field-keyed validation errors. */
export interface ApiErrorDto {
  detail?: string
  code?: string
  [field: string]: JsonValue | undefined
}
