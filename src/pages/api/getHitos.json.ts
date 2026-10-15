import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

const omittedSearchFields = new Set([
	"year",
	"century",
	"inventor",
	"precededBy",
	"impactScore",
])

export const GET: APIRoute = async () => {
	try {
		const hitosCollection = await getCollection("hitos")

		const hitosOrdenados = [...hitosCollection].sort(
			(a, b) => a.data.year - b.data.year,
		)

		const cachedHitos = hitosOrdenados.map((hito) => {
			const restoDeCampos = Object.fromEntries(
				Object.entries(hito.data).filter(
					([field]) => !omittedSearchFields.has(field),
				),
			)

			return {
				id: hito.id,
				title: hito.data.title,
				category: hito.data.category,
				description: hito.data.description,
				...restoDeCampos,
			}
		})

		return new Response(JSON.stringify(cachedHitos), {
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
