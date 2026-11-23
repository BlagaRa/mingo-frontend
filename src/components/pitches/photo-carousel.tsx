"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { theme } from "@/config/theme";

const SWIPE_THRESHOLD = 48;

export function PhotoCarousel({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const draggingRef = useRef(false);
  const countRef = useRef(0);
  const detachDrag = useRef<(() => void) | null>(null);
  const safe = photos.length > 0 ? photos : [];

  countRef.current = safe.length;

  useEffect(() => {
    return () => {
      detachDrag.current?.();
      draggingRef.current = false;
    };
  }, []);

  function go(delta: number) {
    if (safe.length < 2) return;
    setIndex((current) => (current + delta + safe.length) % safe.length);
  }

  function endDrag(clientX: number) {
    if (!draggingRef.current) return;
    const delta = clientX - startX.current;
    draggingRef.current = false;
    setDragging(false);
    setDragX(0);
    const count = countRef.current;
    if (count < 2) return;
    if (delta <= -SWIPE_THRESHOLD) {
      setIndex((current) => (current + 1) % count);
    } else if (delta >= SWIPE_THRESHOLD) {
      setIndex((current) => (current - 1 + count) % count);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (safe.length < 2 || event.button !== 0) return;
    event.preventDefault();
    detachDrag.current?.();
    startX.current = event.clientX;
    draggingRef.current = true;
    setDragging(true);

    const onMove = (ev: globalThis.PointerEvent) => {
      if (!draggingRef.current) return;
      setDragX(ev.clientX - startX.current);
    };
    const onUp = (ev: globalThis.PointerEvent) => {
      detach();
      endDrag(ev.clientX);
    };
    const detach = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      detachDrag.current = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    detachDrag.current = detach;
  }

  if (safe.length === 0) {
    return (
      <div
        className="aspect-[16/10] rounded-[var(--radius-md)]"
        style={{ backgroundColor: theme.colors.surfaceMuted }}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-md)] select-none">
      <div
        className="relative aspect-[16/10] cursor-grab touch-none active:cursor-grabbing bg-[var(--color-surface-muted)]"
        onPointerDown={onPointerDown}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
            transition: dragging
              ? "none"
              : "transform 420ms var(--ease-out)",
          }}
        >
          {safe.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full min-w-full shrink-0"
            >
              <Image
                src={src}
                alt={i === index ? `${alt} — poza ${i + 1}` : ""}
                fill
                draggable={false}
                className="pointer-events-none object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {safe.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Poza anterioară"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-3 py-2 text-sm font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
            style={{
              backgroundColor: theme.colors.ivory,
              color: theme.colors.forest,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Poza următoare"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full px-3 py-2 text-sm font-semibold transition-transform duration-[var(--motion-press-ms)] ease-[var(--ease-out)] active:scale-[0.97]"
            style={{
              backgroundColor: theme.colors.ivory,
              color: theme.colors.forest,
            }}
          >
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
            {safe.map((_, dot) => (
              <button
                key={dot}
                type="button"
                aria-label={`Mergi la poza ${dot + 1}`}
                aria-current={dot === index ? true : undefined}
                onClick={() => setIndex(dot)}
                className="h-2.5 w-2.5 rounded-full transition-[transform,background-color] duration-300 ease-[var(--ease-out)] active:scale-95"
                style={{
                  backgroundColor:
                    dot === index ? theme.colors.coral : theme.colors.ivory,
                  transform: dot === index ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
