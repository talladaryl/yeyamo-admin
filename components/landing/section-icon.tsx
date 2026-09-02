import type { LucideIcon } from "lucide-react";

export function SectionIcon({
  icon: Icon,
  className,
  size = 18,
  strokeWidth = 2
}: {
  icon: LucideIcon;
  className: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <span className={className}>
      <Icon aria-hidden="true" size={size} strokeWidth={strokeWidth} />
    </span>
  );
}

