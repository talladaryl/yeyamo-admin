"use client";

import { useCallback, useRef, useState } from "react";

const HERO_VIDEOS = [
  "/backgrounds/13275721_3840_2160_24fps.mp4",
  "/backgrounds/15281144_3840_2160_24fps.mp4",
  "/backgrounds/181314-866094614_medium.mp4",
  "/backgrounds/18420-292228405_medium.mp4",
  "/backgrounds/199294-909903183_medium.mp4"
] as const;

type PlayerState = {
  activeSlot: 0 | 1;
  currentIndex: number;
  slots: [number, number];
};

const initialState: PlayerState = { activeSlot: 0, currentIndex: 0, slots: [0, 1] };

export function HeroVideoBackground() {
  const [player, setPlayer] = useState<PlayerState>(initialState);
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([null, null]);
  const switchingRef = useRef(false);

  const showNext = useCallback((nextSlot: 0 | 1) => {
    setPlayer((current) => {
      const nextIndex = (current.currentIndex + 1) % HERO_VIDEOS.length;
      const followingIndex = (nextIndex + 1) % HERO_VIDEOS.length;
      const slots: [number, number] = [...current.slots];
      slots[current.activeSlot] = followingIndex;
      return { activeSlot: nextSlot, currentIndex: nextIndex, slots };
    });
  }, []);

  const advance = useCallback(async () => {
    if (switchingRef.current) return;
    switchingRef.current = true;

    const nextSlot = (player.activeSlot === 0 ? 1 : 0) as 0 | 1;
    const nextVideo = videoRefs.current[nextSlot];

    if (!nextVideo) {
      switchingRef.current = false;
      return;
    }

    try {
      nextVideo.currentTime = 0;
      await nextVideo.play();
      showNext(nextSlot);
    } catch {
      // Keep the last rendered frame visible and retry when the next video is ready.
      nextVideo.addEventListener("canplay", () => {
        void nextVideo.play().then(() => showNext(nextSlot)).catch(() => undefined);
      }, { once: true });
    } finally {
      switchingRef.current = false;
    }
  }, [player.activeSlot, showNext]);

  return <div className="home-hero__video-layer" aria-hidden="true">
    {player.slots.map((videoIndex, slot) => <video
      ref={(element) => { videoRefs.current[slot] = element; }}
      key={slot}
      className="home-hero__video"
      data-active={slot === player.activeSlot}
      autoPlay={slot === 0}
      muted
      playsInline
      preload="auto"
      src={HERO_VIDEOS[videoIndex]}
      onEnded={slot === player.activeSlot ? () => void advance() : undefined}
      onError={slot === player.activeSlot ? () => void advance() : undefined}
    />)}
    <div className="home-hero__video-shade" />
    <div className="home-hero__video-progress">{HERO_VIDEOS.map((video, videoIndex) => <span key={video} data-active={videoIndex === player.currentIndex} />)}</div>
  </div>;
}
