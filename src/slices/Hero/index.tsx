import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="flex flex-col items-center gap-4 py-24 text-center"
    >
      <div className="text-4xl font-semibold tracking-tight">
        <PrismicRichText field={slice.primary.title} />
      </div>
      <div className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        <PrismicRichText field={slice.primary.description} />
      </div>
    </section>
  );
};

export default Hero;
