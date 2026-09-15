import Image from "next/image";

type AnimatedLogoProps = { className?: string; compact?: boolean };

export function AnimatedLogo({ className = "", compact = false }: AnimatedLogoProps) {
  return <span className={`animated-logo${compact ? " animated-logo--compact" : ""} ${className}`.trim()} aria-hidden="true">
    <Image src="/brand/yeyamo-logo.png" alt="" fill sizes={compact ? "160px" : "210px"} priority={compact} />
  </span>;
}
