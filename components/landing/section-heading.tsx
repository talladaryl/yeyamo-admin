"use client";

import type { ReactNode } from "react";

export function SectionBadge({ children }: { children: string }) {
  return <span className="section-badge">{children}</span>;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  id
}: {
  badge: string;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <SectionBadge>{badge}</SectionBadge>
      <h2 className="section-heading__title" id={id}>
        {title}
      </h2>
      <p className="section-heading__text">{description}</p>
    </div>
  );
}
