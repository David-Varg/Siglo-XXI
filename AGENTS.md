# Agent guidelines

## Project overview

- This is an Astro static site with React components for interactive UI.
- Astro pages and layouts live in `src/pages/` and `src/layouts/`.
- Content collections are configured in `src/content.config.ts`.
- Browser-side behavior is implemented in `src/hooks/` and imported by Astro components.
- Shared React state is managed with Nano Stores in `src/store/`.

## Working in this repository

- Preserve the existing Spanish UI copy and TypeScript types.
- Use Astro content collections for article and team data.
- Keep client-side code compatible with Astro View Transitions and reduced-motion preferences.
- Do not commit generated output in `dist/` or `.astro/`.
- Avoid modifying article Markdown or image assets unless the task explicitly includes them.

## Validation

- Run `pnpm lint` for ESLint.
- Run `pnpm test:unit` for unit tests.
- Run `pnpm build` to validate content collections and static routes.
