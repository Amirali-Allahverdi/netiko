/** Primary keys from common.TimeStampedModel. */
export type UUID = string;

/** Default Django auth.User primary key (integer). */
export type UserId = number;

/** DateField wire format: YYYY-MM-DD. */
export type ISODate = string;

/** DRF DateTimeField wire format (ISO-8601, normally UTC with Z). */
export type ISODateTime = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = Record<string, JsonValue>;

export interface TimestampedDto {
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CreatedAtDto {
  created_at: ISODateTime;
}
