"use client";

import { FC, useEffect, useRef, useState } from "react";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

export type HeroContext = { lang?: string };

export type HeroProps = SliceComponentProps<Content.HeroSlice, HeroContext>;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const map = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const t = clamp01((value - inMin) / (inMax - inMin));
  return outMin + t * (outMax - outMin);
};

const ARABIC_SCRIPT = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;
const BADGE_RADIUS = 58;
const NAME_MEASURE_SIZE = 100;

const Hero: FC<HeroProps> = ({ slice, context }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const nameBoxRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLSpanElement | null>(null);
  const [progress, setProgress] = useState(0);

  const displayName = slice.primary.display_name ?? "";
  const nameIsArabicScript = ARABIC_SCRIPT.test(displayName);

  // German reads left, Persian reads right. Prefer the document's own locale
  // and fall back to the script of its text, so the slice simulator (which
  // passes no context) still lays out correctly.
  const lang = context?.lang;
  const isRtl = lang
    ? /^(fa|ar|he|ur)/i.test(lang)
    : ARABIC_SCRIPT.test(`${displayName}${asText(slice.primary.heading)}`);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      setProgress(clamp01(raw));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Scale the display name so it always spans the full container width,
  // whatever the name and language.
  useEffect(() => {
    const box = nameBoxRef.current;
    const text = nameRef.current;
    if (!box || !text) return;

    // Converges in one pass, and re-runs when the box resizes or the webfont
    // swaps in and changes the text's natural width.
    const fit = () => {
      const available = box.clientWidth;
      const natural = text.getBoundingClientRect().width;
      if (available <= 0 || natural <= 0) return;
      const current =
        Number.parseFloat(text.style.fontSize) || NAME_MEASURE_SIZE;
      const next = (current * available) / natural;
      if (Math.abs(next - current) < 0.5) return;
      text.style.fontSize = `${next}px`;
    };

    text.style.fontSize = `${NAME_MEASURE_SIZE}px`;
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    observer.observe(text);
    return () => observer.disconnect();
  }, [displayName]);

  const headingOpacity = map(progress, 0.18, 0.38, 1, 0);
  const headingY = map(progress, 0, 0.38, 0, -56);
  const headingBlur = map(progress, 0, 0.38, 0, 6);

  const headingAltOpacity = map(progress, 0.32, 0.55, 0, 1);
  const headingAltY = map(progress, 0.32, 0.55, 56, 0);

  const badgeText = (slice.primary.badge_text ?? "").trim();
  const badgeWords = badgeText.split(/\s+/).filter(Boolean);
  // Persian keeps its letter joining only if whole words stay intact; Latin is
  // laid out letter by letter, the way the design draws it.
  const badgeTokens = badgeText
    ? ARABIC_SCRIPT.test(badgeText)
      ? [...badgeWords, ...badgeWords]
      : Array.from(badgeText.toUpperCase())
    : [];
  const badgeAngleStep = badgeTokens.length ? 360 / badgeTokens.length : 0;

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-hero-section
      dir={isRtl ? "rtl" : "ltr"}
      className="relative h-[200vh] bg-black text-white"
    >
      <div data-hero-sticky className="sticky top-0 h-screen overflow-hidden">
        <div className="container-app relative h-full w-full">
          <div
            ref={nameBoxRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-5 top-[6%] select-none text-center"
          >
            <span
              ref={nameRef}
              className="text-neon font-display-name inline-block origin-top whitespace-nowrap text-[15vw] font-extrabold uppercase leading-[0.78] tracking-[0.01em]"
              style={
                // Big Shoulders is already tall and narrow; Vazirmatn, which
                // Persian falls back to, needs stretching to match it.
                nameIsArabicScript ? { transform: "scaleY(1.15)" } : undefined
              }
            >
              {displayName}
            </span>
          </div>

          <div className="portrait-blend absolute inset-x-0 bottom-0 z-10 mx-auto h-[74%] w-[76%] max-w-[300px] sm:h-[82%] sm:w-[38%] sm:max-w-[560px]">
            <PrismicNextImage
              field={slice.primary.portrait_image}
              fill
              priority
              className="object-cover object-top grayscale"
            />
          </div>

          {badgeTokens.length > 0 && (
            <div className="pointer-events-none absolute end-5 top-[52%] z-20 hidden -translate-y-1/2 sm:end-[4%] sm:block">
              <div className="relative size-[132px]">
                <div
                  data-hero-badge-ring
                  className="absolute inset-0 animate-[spin_22s_linear_infinite]"
                >
                  {badgeTokens.map((token, i) => (
                    <span
                      key={i}
                      className="absolute inset-0 m-auto h-fit w-fit whitespace-nowrap text-[11px] font-normal uppercase text-white/75"
                      style={{
                        transform: `rotate(${i * badgeAngleStep}deg) translateY(-${BADGE_RADIUS}px)`,
                      }}
                    >
                      {token}
                    </span>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[58px] w-[58px] text-white/85"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3.5v17m0 0-6-6m6 6 6-6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-x-5 bottom-[12%] z-20 flex justify-start">
            <div className="flex w-full max-w-[380px] flex-col items-start gap-6">
              <div className="grid w-full">
                <div
                  data-fx
                  className="font-heading col-start-1 row-start-1 uppercase tracking-[0.01em] [&_h1]:text-[2rem] [&_h1]:font-normal [&_h1]:leading-[1.16] sm:[&_h1]:text-[2.5rem]"
                  style={{
                    opacity: headingOpacity,
                    transform: `translateY(${headingY}px)`,
                    filter: `blur(${headingBlur}px)`,
                  }}
                >
                  <PrismicRichText field={slice.primary.heading} />
                </div>

                <div
                  data-fx
                  data-hero-alt-heading
                  className="font-heading col-start-1 row-start-1 uppercase tracking-[0.01em] [&_h1]:text-[2rem] [&_h1]:font-normal [&_h1]:leading-[1.16] sm:[&_h1]:text-[2.5rem]"
                  style={{
                    opacity: headingAltOpacity,
                    transform: `translateY(${headingAltY}px)`,
                  }}
                >
                  <PrismicRichText field={slice.primary.heading_alt} />
                </div>
              </div>

              <div className="max-w-[310px] text-[15px] leading-[1.75] text-white/60 [&_p]:m-0">
                <PrismicRichText field={slice.primary.description} />
              </div>

              {slice.primary.cta_label && (
                <PrismicNextLink
                  field={slice.primary.cta_link}
                  className="inline-flex items-center gap-2.5 bg-brand px-6 py-4 text-[15px] font-medium text-black transition-[filter] hover:brightness-110"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-[18px]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.6 10.8a13.4 13.4 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z"
                    />
                  </svg>
                  {slice.primary.cta_label}
                </PrismicNextLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
