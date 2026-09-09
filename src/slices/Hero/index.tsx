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

const BADGE_RADIUS = 54;

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

  const headingOpacity = map(progress, 0.18, 0.38, 1, 0);
  const headingY = map(progress, 0, 0.38, 0, -56);
  const headingBlur = map(progress, 0, 0.38, 0, 6);

  const headingAltOpacity = map(progress, 0.32, 0.55, 0, 1);
  const headingAltY = map(progress, 0.32, 0.55, 56, 0);

  const badgeText = slice.primary.badge_text ?? "";
  const badgeWords = badgeText.split(/\s+/).filter(Boolean);
  const badgeRing = [...badgeWords, ...badgeWords];
  const badgeAngleStep = badgeRing.length ? 360 / badgeRing.length : 0;

  return (
    <section
      ref={sectionRef}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-hero-section
      className="relative h-[200vh] bg-black text-white"
    >
      <div
        data-hero-sticky
        className="sticky top-0 flex h-screen flex-col overflow-hidden"
      >
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-4 select-none whitespace-nowrap text-center text-[16vw] font-black leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)] sm:top-8 sm:text-[11vw]"
        >
          {slice.primary.display_name}
        </p>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[68%] w-full max-w-sm sm:h-[78%] sm:max-w-md">
          <PrismicNextImage
            field={slice.primary.portrait_image}
            fill
            priority
            className="object-contain object-bottom grayscale"
          />
        </div>

        {badgeRing.length > 0 && (
          <div className="pointer-events-none absolute end-6 top-1/2 hidden -translate-y-1/2 sm:end-10 sm:block">
            <div className="relative size-32">
              <div className="absolute inset-0 animate-[spin_16s_linear_infinite] rounded-full">
                {badgeRing.map((word, i) => (
                  <span
                    key={i}
                    className="absolute inset-0 m-auto h-fit w-fit whitespace-nowrap text-[9px] font-medium tracking-wide text-white/70"
                    style={{
                      transform: `rotate(${i * badgeAngleStep}deg) translateY(-${BADGE_RADIUS}px)`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v14m0 0-5-5m5 5 5-5"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-20 mt-auto flex w-full justify-start px-6 pb-14 sm:px-10 sm:pb-20">
          <div className="flex max-w-md flex-col items-start gap-4">
            <div className="grid w-full">
              <div
                data-fx
                className="col-start-1 row-start-1 font-persian-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight sm:[&_h1]:text-5xl"
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
                className="col-start-1 row-start-1 font-persian-serif [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight sm:[&_h1]:text-5xl"
                style={{
                  opacity: headingAltOpacity,
                  transform: `translateY(${headingAltY}px)`,
                }}
              >
                <PrismicRichText field={slice.primary.heading_alt} />
              </div>
            </div>

            <div className="text-sm leading-7 text-white/70 [&_p]:m-0">
              <PrismicRichText field={slice.primary.description} />
            </div>

            {slice.primary.cta_label && (
              <PrismicNextLink
                field={slice.primary.cta_link}
                className="inline-flex items-center gap-2 rounded-md bg-amber-400 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-amber-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4"
                  fill="currentColor"
                >
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.5c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
                </svg>
                {slice.primary.cta_label}
              </PrismicNextLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
