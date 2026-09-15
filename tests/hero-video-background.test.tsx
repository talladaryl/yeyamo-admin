import { fireEvent, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";

const videos = [
  "13275721_3840_2160_24fps.mp4",
  "15281144_3840_2160_24fps.mp4",
  "181314-866094614_medium.mp4",
  "18420-292228405_medium.mp4",
  "199294-909903183_medium.mp4"
];

describe("HeroVideoBackground", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  });

  it("plays all five backgrounds in order and loops after the last one", async () => {
    const { container } = render(<HeroVideoBackground />);
    for (const file of videos) {
      const video = container.querySelector("video");
      expect(video?.querySelector("source")?.getAttribute("src")).toContain(file);
      fireEvent.ended(video!);
      await waitFor(() => expect(container.querySelector("video")).not.toBe(video));
    }
    expect(container.querySelector("source")?.getAttribute("src")).toContain(videos[0]);
  });

  it("uses the static fallback when reduced motion is requested", async () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const { container } = render(<HeroVideoBackground />);
    await waitFor(() => expect(container.querySelector(".home-hero__video-fallback")).not.toBeNull());
    expect(container.querySelector("video")).toBeNull();
  });
});
