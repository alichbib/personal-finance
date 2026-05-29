import { api } from '../lib/api';
import type { AuthResult } from '../types';

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>('/auth/register', {
    email,
    password,
  });
  return data;
}
