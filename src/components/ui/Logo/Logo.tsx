import type { LogoProps } from './Logo.types';

const sizeMap = {
  sm: { box: 27, mark: 10, radius: 8, text: 'text-base' },
  md: { box: 30, mark: 11, radius: 9, text: 'text-[17px]' },
  lg: { box: 34, mark: 13, radius: 10, text: 'text-[19px]' },
} as const;

export function Logo({ size = 'md', showShadow = false }: LogoProps) {
  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        aria-hidden="true"
        className="flex items-center justify-center bg-primary"
        style={{
          width: s.box,
          height: s.box,
          borderRadius: s.radius,
          boxShadow: showShadow ? '0 4px 12px rgba(5,150,105,.28)' : undefined,
        }}
      >
        <div
          className="bg-white"
          style={{
            width: s.mark,
            height: s.mark,
            borderRadius: 3,
            transform: 'rotate(45deg)',
          }}
        />
      </div>
      <span className={`${s.text} font-semibold tracking-[-0.02em] text-ink`}>
        Folio
      </span>
    </div>
  );
}
