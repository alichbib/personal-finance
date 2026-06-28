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
    <div className="relative flex min-h-screen flex-col items-center justify-start px-5 pb-8 pt-10 folio:justify-center folio:p-6">
      {/* Radial backdrop — desktop only. On mobile the plain app background shows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden folio:block"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 0%, #F2F7F4 0%, #FAFAF9 55%)',
        }}
      />
      <div className="w-full max-w-[404px] animate-folioFade">
        <div className="mb-[30px] flex justify-center">
          <Logo size="lg" showShadow />
        </div>
        {/* Card chrome (surface, border, padding, shadow) only on desktop.
            On mobile the form sits on the page using the screen padding only. */}
        <div className="folio:rounded-card-lg folio:border folio:border-border folio:bg-surface folio:p-8 folio:shadow-auth">
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
