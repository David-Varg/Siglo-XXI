# Agent guidelines

## Project overview

- This is the academic project "El Siglo XXI", a Spanish-language historical and educational website.
- The site uses Astro to generate pages and routes, with React islands for selected interactive UI. Keep pages static-first and add client-side hydration only when needed.
- Main features include the historical timeline, individual milestone articles, article search, a 3D hero scene, team information, page transitions, and persistent audio.
- Astro pages and layouts live in `src/pages/` and `src/layouts/`. Reusable UI is grouped by domain in `src/components/`.
- Content collections are configured in `src/content.config.ts`. Milestone articles are Markdown files in `src/content/blog/`; team data is in `src/content/team/members.json`.
- Browser-side behavior is implemented in `src/hooks/`, independent utilities and unit tests in `src/lib/`, and shared search state in `src/store/`.
- Public images, models, and sounds are served from `public/`. Their URLs should be root-relative (for example, `/images/inventions/example.webp`).

## Implementation guidelines

- Preserve the existing Spanish UI copy, accents, tone, and TypeScript types.
- Follow the existing Astro, React, and TypeScript patterns. The project uses strict Astro TypeScript settings and the aliases configured in `tsconfig.json` (`@/`, `@components/`, `@layouts/`, `@hooks/`, and `@store/`).
- Keep content, page composition, and interactive behavior separated: article data belongs in the content collection, reusable markup in components, and browser behavior in hooks or interactive components.
- Validate changes to article frontmatter against the Zod schema in `src/content.config.ts`. Keep category values and numeric bounds consistent with that schema.
- Article routes are generated from the `hitos` collection in `src/pages/blog/[id].astro`. Preserve the existing route IDs and chronological navigation behavior when changing article routing.
- Keep client-side scripts compatible with Astro View Transitions: initialize behavior on the appropriate page lifecycle event and clean up listeners, animations, and other resources before a swap.
- Respect `prefers-reduced-motion` for newly added motion and preserve responsive behavior at narrow viewport sizes.
- Use Tailwind utilities and existing global styles in `src/styles/` for presentation. Avoid introducing a second styling system for a local change.
- For React islands, use Astro client directives deliberately; do not hydrate static content without a functional reason.
- When working with Three.js or other browser resources, handle loading and cleanup and provide a usable fallback if an optional asset cannot be displayed.
- Keep article prose and assets unchanged unless they are explicitly part of the task. Do not add generated output, dependency directories, or build artifacts to source changes.
- Avoid unrelated refactors. Match the surrounding naming, formatting, and component conventions.

## Validation

- Install dependencies with `pnpm install` only when dependencies are missing or the dependency manifest has changed.
- Run `pnpm lint` to check ESLint rules across `src/`.
- Run `pnpm test:unit` for the unit tests covering carousel math and search-result logic.
- Run `pnpm build` when a change affects Astro pages, routes, content collections, or production bundling.
- Prefer the smallest relevant validation set, and report any command that could not be run or any pre-existing failure.
- `pnpm dev` starts the Astro development server; `pnpm preview` serves the production build locally.
