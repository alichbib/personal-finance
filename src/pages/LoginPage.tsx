import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../lib/error';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { labelClass } from '../components/ui/form';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } });

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/dashboard';

  const validationError = errors.email || errors.password;

  async function onSubmit(values: LoginForm) {
    setSubmitError(null);
    try {
      const result = await loginRequest(values.email.trim(), values.password);
      setSession(result.token, result.user);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="!h-11"
          {...register('email', {
            required: 'Please enter your email and password.',
          })}
        />

        <label htmlFor="password" className={`${labelClass} mt-4`}>
          Password
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="!h-11"
          {...register('password', {
            required: 'Please enter your email and password.',
          })}
        />

        {(validationError || submitError) && (
          <p role="alert" className="mt-3 text-[13px] text-danger">
            {validationError?.message ?? submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-[22px] inline-flex h-11 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-white shadow-primary-btn transition-colors hover:bg-primary-hover active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/[.18]"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}
