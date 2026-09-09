import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const page = await client.getByUID("page", "home").catch(() => null);

  if (!page) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Next.js + Slice Machine + Prismic
        </h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">
          No <code>home</code> page found in Prismic yet. Run{" "}
          <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
            bun run slicemachine
          </code>{" "}
          to connect a repository, create the <code>home</code> document, and
          add slices.
        </p>
      </main>
    );
  }

  return <SliceZone slices={page.data.slices} components={components} />;
}
