export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  fields?: FieldErrors;

  constructor(message: string, status: number, fields?: FieldErrors) {
    super(message);
    this.status = status;
    this.fields = fields;
    this.name = 'APiError';
  }
}

