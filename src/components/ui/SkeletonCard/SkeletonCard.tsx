import type { SkeletonCardProps } from './SkeletonCard.types';

// A shimmering placeholder bar. Two tones (base / soft) so the card reads as
// a title + value + meta + lines, matching the design's skeleton.
function ShimmerBar({
  width,
  height,
  radius = 6,
  soft = false,
}: {
  width: string;
  height: number;
  radius?: number;
  soft?: boolean;
}) {
  const gradient = soft
    ? 'linear-gradient(90deg,#eef2f7 25%,#f8fafc 50%,#eef2f7 75%)'
    : 'linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)';
  return (
    <div
      className="animate-shimmer"
      style={{
        width,
        height,
        borderRadius: radius,
        background: gradient,
        backgroundSize: '450px 100%',
      }}
    />
  );
}

export function SkeletonCard({ height = '118px' }: SkeletonCardProps) {
  return (
    <div
      className="flex flex-col gap-3.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
      style={{ height }}
      aria-hidden="true"
    >
      <ShimmerBar width="42%" height={12} />
      <ShimmerBar width="64%" height={26} radius={8} />
      <ShimmerBar width="34%" height={10} />
      <div className="mt-auto flex flex-col gap-[11px]">
        <ShimmerBar width="100%" height={9} soft />
        <ShimmerBar width="88%" height={9} soft />
      </div>
    </div>
  );
}
