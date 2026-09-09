## Mahmoud Asadi

A [Next.js](https://nextjs.org) project (App Router, TypeScript, Tailwind CSS) wired up for [Slice Machine](https://prismic.io/docs/slice-machine) + [Prismic](https://prismic.io/).

### Getting Started

Install dependencies and run the dev server with [bun](https://bun.sh):

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Slice Machine

To connect a real Prismic repository and manage slices/custom types visually:

```bash
bun run slicemachine
```

This opens Slice Machine at [http://localhost:9999](http://localhost:9999), where you can log in to Prismic, push the `page` custom type and `Hero` slice defined in this repo, and create a `startseite` document.

- Custom types live in `customtypes/`
- Slices live in `src/slices/`
- The Prismic client is configured in `src/prismicio.ts`
- Update `slicemachine.config.json` with your own `repositoryName` before pushing

### Stack

- [Next.js](https://nextjs.org) (App Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Slice Machine](https://prismic.io/docs/slice-machine) + [Prismic](https://prismic.io/)
