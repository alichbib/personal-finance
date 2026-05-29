import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../lib/error';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { inputClass, labelClass } from '../components/ui/form';

interface RegisterForm {
  email: string;
  password: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  async function onSubmit(values: RegisterForm) {
    setSubmitError(null);
    try {
      const result = await registerRequest(
        values.email.trim(),
        values.password,
      );
      setSession(result.token, result.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking your money in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-700 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {submitError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700"
          >
            {submitError}
          </div>
        )}

        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-describedby="password-hint"
            className={inputClass}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.password.message}
            </p>
          ) : (
            <p id="password-hint" className="mt-1 text-xs text-slate-500">
              At least 8 characters.
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
