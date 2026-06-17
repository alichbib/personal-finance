import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerRequest } from '../api/auth';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../lib/error';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { labelClass } from '../components/ui/form';

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
  } = useForm<RegisterForm>({ defaultValues: { email: '', password: '' } });

  const validationError = errors.email || errors.password;

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
      subtitle="Start tracking your spending in seconds."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Sign in
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
          autoComplete="new-password"
          placeholder="••••••••"
          className="!h-11"
          {...register('password', {
            required: 'Please enter your email and password.',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters.',
            },
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
          {isSubmitting ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
