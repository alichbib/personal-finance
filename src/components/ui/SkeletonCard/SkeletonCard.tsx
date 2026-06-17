import type { SkeletonCardProps } from './SkeletonCard.types';

// Shimmering bar; the two color pairs match the SkelCard reference.
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
    ? 'linear-gradient(90deg,#F4F4F2 25%,#FAFAF8 50%,#F4F4F2 75%)'
    : 'linear-gradient(90deg,#F1F1EF 25%,#F8F8F6 50%,#F1F1EF 75%)';
  return (
    <div
      className="animate-folioShimmer"
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
      className="flex flex-col gap-3.5 overflow-hidden rounded-card border border-border bg-surface p-[22px] shadow-card"
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
