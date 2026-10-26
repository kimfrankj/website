"use client";

import { useEffect, useRef, useState } from "react";

// The song. The audio file lives in /public/audio; publishing a commercial track needs the rights to it.
const TRACK = {
  src: "/audio/it-makes-you-forget.mp3",
  title: "It Makes You Forget",
  artist: "Peggy Gou",
};
const VOLUME = 0.6;
// Remembers a visitor who paused, so the song doesn't start on them again next visit
const MUTED_KEY = "now-playing:off";

/**
 * A small "now playing" pill in the corner of every page that plays the song as soon as the browser
 * allows. Browsers block sound until the visitor interacts, so it tries straight away and, if that's
 * refused, starts on their first click, tap or keypress anywhere, fading in. The pill plays and pauses.
 * It lives in the layout, so the music carries on from page to page. If the file is missing, the pill hides.
 */
export function NowPlaying() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    // Set the source only now, after hydration, so a missing file's error reaches onError
    el.src = TRACK.src;
    let off = false;
    try { off = localStorage.getItem(MUTED_KEY) === "1"; } catch {}
    if (off) return;

    let fade = 0;
    const fadeIn = () => {
      el.volume = 0;
      const tick = () => {
        el.volume = Math.min(VOLUME, el.volume + 0.02);
        if (el.volume < VOLUME) fade = requestAnimationFrame(tick);
      };
      fade = requestAnimationFrame(tick);
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const disarm = () => events.forEach((e) => window.removeEventListener(e, onFirstGesture, true));
    const onFirstGesture = (e: Event) => {
      disarm();
      // A first click on the pill itself is left to the pill, which plays the song
      if ((e.target as Element | null)?.closest?.(".now-playing")) return;
      if (el.paused) el.play().then(fadeIn).catch(() => {});
    };
    el.play()
      .then(fadeIn)
      .catch(() => events.forEach((e) => window.addEventListener(e, onFirstGesture, true)));

    return () => {
      cancelAnimationFrame(fade);
      disarm();
    };
  }, []);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      el.volume = VOLUME;
      el.play().catch(() => {});
      try { localStorage.removeItem(MUTED_KEY); } catch {}
    } else {
      el.pause();
      try { localStorage.setItem(MUTED_KEY, "1"); } catch {}
    }
  };

  return (
    <div className="now-playing" hidden={missing}>
      <audio
        ref={audio}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${playing ? "Pause" : "Play"} ${TRACK.title} by ${TRACK.artist}`}
        aria-pressed={playing}
        className="now-playing-pill"
      >
        <span aria-hidden="true" className="eq" data-playing={playing || undefined}>
          <span /><span /><span /><span />
        </span>
        <span className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="display hidden text-base italic leading-none sm:inline">{TRACK.title}</span>
          <span className="label font-sans leading-none">{TRACK.artist}</span>
        </span>
      </button>
    </div>
  );
}
