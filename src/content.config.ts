import { defineCollection } from "astro:content";
import { glob, file } from "astro/loaders";

import { z } from "astro/zod";

const hitosSigloXXI = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    category: z.enum([
      "astronomia",
      "tecnologia",
      "salud",
      "ciencia",
      "sociedad",
    ]),
    description: z.string(),
    image: z.string(),
  }),
});

const miembrosDelGrupo = defineCollection({
  loader: file("./src/content/team/miembros.json"),
  schema: z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().max(50),
    role: z.string().max(100),
    badge: z.string().max(30),
    avatar: z.string(),
    github: z.string(),
    twitter: z.string().optional(),
    threads: z.string().optional(),
  }),
});

export const collections = {
  hitos: hitosSigloXXI,
  team: miembrosDelGrupo,
};
