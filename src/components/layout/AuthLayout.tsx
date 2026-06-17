import type { ReactNode } from 'react';
import { Logo } from '../ui/Logo';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  /** Reassurance caption below the card. */
  caption?: ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  caption,
}: AuthLayoutProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(120% 120% at 50% 0%, #F2F7F4 0%, #FAFAF9 55%)',
      }}
    >
      <div className="w-full max-w-[404px] animate-folioFade">
        <div className="mb-[30px] flex justify-center">
          <Logo size="lg" showShadow />
        </div>
        <div className="rounded-card-lg border border-border bg-surface p-8 shadow-auth">
          <h1 className="mb-1.5 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-ink-subtle">
            {subtitle}
          </p>
          {children}
          <div className="mt-5 text-center text-[13px] text-ink-subtle">
            {footer}
          </div>
        </div>
        <p className="mt-[18px] text-center text-xs leading-relaxed text-ink-faint">
          {caption ?? (
            <>
              Calm, private money tracking.
              <br />
              Your data stays yours.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
