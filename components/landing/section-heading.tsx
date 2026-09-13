"use client";

import { usePublicLanguage } from "./public-language";

import type { ReactNode } from "react";

export function SectionBadge({ children }: { children: string }) {
  const { t } = usePublicLanguage();
  return <span className="section-badge">{t(children)}</span>;
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
  const { t } = usePublicLanguage();
  return (
    <div className={`section-heading section-heading--${align}`}>
      <SectionBadge>{t(badge)}</SectionBadge>
      <h2 className="section-heading__title" id={id}>
        {t(title)}
      </h2>
      <p className="section-heading__text">{t(description)}</p>
    </div>
  );
}
