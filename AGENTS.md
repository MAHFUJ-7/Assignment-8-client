<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project layout

- Assignment-8 has two independent apps, each with its own `package.json` and `node_modules` — no workspace tooling, no shared deps:
  - `Client-Side/` — Next.js 16 App Router (this directory). Entry points: `src/app/layout.js`, `src/app/page.js`.
  - `Server-Side/` — Express 5, ESM. Run with `node index.js` (it has **no** start script; `npm test` just errors).
- The git repo root is `D:\Web-Development\Programming-Hero`, a personal workspace holding many unrelated assignments — `git status` is very noisy and most siblings are untracked. Commit only what you intend to.

## Commands (run in `Client-Side/`)

- `npm run dev` — Next dev (Turbopack). `npm run build` — production build.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`). This is the **only** verification: there is no test runner, no typecheck, no CI.
- The project is plain JavaScript (`.js`/`.jsx`, no tsconfig). Don't introduce TypeScript files or `.ts` extensions.

## Toolchain quirks (would otherwise be guessed wrong)

- **Tailwind v4, CSS-first**: no `tailwind.config` — theme/vars live in `src/app/globals.css`. CSS is processed by the `@tailwindcss/turbopack` loader rule in `next.config.mjs`; don't add a config file or PostCSS setup.
- **React Compiler is on**: `reactCompiler: true` in `next.config.mjs` (via `babel-plugin-react-compiler`). Components must follow React Compiler rules (no mutating props, etc.).
- **shadcn/ui, `base-nova` style, JS not TS**: components are `.jsx` under `src/components/ui/`, built on `@base-ui/react` primitives — **not Radix**. Add/refresh with `npx shadcn add <component>` (the `shadcn` CLI is a dependency; config is `components.json` with `tsx: false`). Check an existing component for the current import conventions before hand-writing one.
- **`cn` is not clsx/tailwind-merge**: `src/lib/utils.js` re-exports `cn` from the npm `cn` package. Import it from `@/lib/utils` (or `cn` directly) as the existing components do.
- Client interactivity is opt-in per file with `"use client"` at the top; many `src/components/ui/*` files already have it, plain presentational ones don't.
