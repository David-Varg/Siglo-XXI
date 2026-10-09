import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export const GET: APIRoute = async () => {
	try {
		const posts = await getCollection("hitos")

		const postsOrdenados = [...posts].sort(
			(a, b) => a.data.year - b.data.year,
		)

		const hitos = postsOrdenados.map((post) => {
			const {
				year,
				century,
				inventor,
				precededBy,
				impactScore,
				heroImage,
				...restoDeCampos
			} = post.data

			return {
				id: post.id,
				title: post.data.title,
				category: post.data.category,
				description: post.data.description,
				...restoDeCampos,
			}
		})

		return new Response(JSON.stringify(hitos), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error en el endpoint de hitos:", error)
		return new Response(
			JSON.stringify({
				error: "Fallo al procesar los hitos en el servidor",
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		)
	}
}
