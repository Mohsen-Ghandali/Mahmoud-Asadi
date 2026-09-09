"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

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

const Hero: FC<HeroProps> = ({ slice }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

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

  const imageScale = map(progress, 0, 1, 1.18, 1);
  const imageY = map(progress, 0, 1, 0, 18);
  const overlayOpacity = map(progress, 0, 1, 0.5, 0.82);

  const eyebrowOpacity = map(progress, 0, 0.2, 1, 0);
  const eyebrowY = map(progress, 0, 0.2, 0, -32);

  const headingOpacity = map(progress, 0.18, 0.38, 1, 0);
  const headingY = map(progress, 0, 0.38, 0, -56);
  const headingBlur = map(progress, 0, 0.38, 0, 6);

  const headingAltOpacity = map(progress, 0.32, 0.55, 0, 1);
  const headingAltY = map(progress, 0.32, 0.55, 56, 0);

  const descriptionOpacity = map(progress, 0.48, 0.72, 0, 1);
  const descriptionY = map(progress, 0.48, 0.72, 32, 0);

  const ctaOpacity = map(progress, 0.58, 0.82, 0, 1);
  const ctaScale = map(progress, 0.58, 0.82, 0.92, 1);

  const orbitRotate = map(progress, 0, 1, 0, 120);
  const orbitScale = map(progress, 0, 1, 1, 1.35);

  const scrollHintOpacity = map(progress, 0, 0.12, 1, 0);

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-hero-section
      className="relative h-[200vh]"
    >
      <div
        data-hero-sticky
        className="sticky top-0 flex h-screen items-center overflow-hidden"
      >
        <div
          aria-hidden
          data-hero-bg
          className="absolute inset-0"
          style={{
            transform: `scale(${imageScale}) translateY(${imageY}%)`,
          }}
        >
          <PrismicNextImage
            field={slice.primary.background_image}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div
          aria-hidden
          data-hero-overlay
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"
          style={{ opacity: overlayOpacity }}
        />

        <div
          aria-hidden
          data-fx
          className="pointer-events-none absolute -start-24 -top-24 size-[36rem] rounded-full border border-white/10"
          style={{
            transform: `rotate(${orbitRotate}deg) scale(${orbitScale})`,
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 text-white sm:px-10">
          <p
            data-fx
            className="text-sm font-medium tracking-wide text-amber-300 sm:text-base"
            style={{
              opacity: eyebrowOpacity,
              transform: `translateY(${eyebrowY}px)`,
            }}
          >
            {slice.primary.eyebrow}
          </p>

          <div className="grid w-full">
            <div
              data-fx
              className="col-start-1 row-start-1 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight sm:[&_h1]:text-6xl"
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
              className="col-start-1 row-start-1 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:leading-tight sm:[&_h1]:text-6xl"
              style={{
                opacity: headingAltOpacity,
                transform: `translateY(${headingAltY}px)`,
              }}
            >
              <PrismicRichText field={slice.primary.heading_alt} />
            </div>
          </div>

          <div
            data-fx
            className="max-w-xl text-base leading-8 text-white/80 sm:text-lg [&_p]:m-0"
            style={{
              opacity: descriptionOpacity,
              transform: `translateY(${descriptionY}px)`,
            }}
          >
            <PrismicRichText field={slice.primary.description} />
          </div>

          {slice.primary.cta_label && (
            <div
              data-fx
              style={{
                opacity: ctaOpacity,
                transform: `scale(${ctaScale})`,
              }}
            >
              <PrismicNextLink
                field={slice.primary.cta_link}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-300 sm:text-base"
              >
                {slice.primary.cta_label}
              </PrismicNextLink>
            </div>
          )}
        </div>

        <div
          aria-hidden
          data-hero-scrollhint
          className="absolute inset-x-0 bottom-8 flex justify-center"
          style={{ opacity: scrollHintOpacity }}
        >
          <div className="flex h-10 w-6 animate-bounce items-start justify-center rounded-full border-2 border-white/50 p-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
