import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as
      | { message?: unknown }
      | undefined;
    const message = responseData?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}
