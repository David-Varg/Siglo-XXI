import { defineCollection } from "astro:content"
import { glob, file } from "astro/loaders"

import { z } from "astro/zod"

const hitosSigloXXI = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		year: z.number(),
		century: z.enum(["XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"]),
		inventor: z.array(
			z.object({
				name: z.string(),
				role: z.string(),
				avatar: z.string(),
				github: z.url().optional(),
			}),
		),
		place: z.string(),
		precededBy: z.array(z.string()),
		category: z.enum([
			"astronomia",
			"tecnologia",
			"salud",
			"ciencia",
			"sociedad",
		]),
		description: z.string(),
		impactScore: z.number().min(1).max(10),
		heroImage: z.string(),
		model3d: z.string().optional(),
	}),
})

const miembrosDelGrupo = defineCollection({
	loader: file("./src/content/team/miembros.json"),
	schema: z.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().max(50),
		role: z.string().max(100),
		badge: z.string().max(30),
		avatar: z.string(),
		github: z.url(),
		twitter: z.url().optional(),
		threads: z.url().optional(),
	}),
})

export const collections = {
	hitos: hitosSigloXXI,
	team: miembrosDelGrupo,
}
