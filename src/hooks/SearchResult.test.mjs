import assert from "node:assert/strict"
import test from "node:test"
import { Search } from "./SearchResult.ts"

const items = [
	{
		id: "transistor",
		title: "El transistor",
		description: "Dispositivo electrónico",
		category: "ciencia",
	},
]

test("ignora stopwords aunque sean el último término de la consulta", () => {
	for (const query of ["el transistor de", "el transistor de "])
		assert.deepEqual(
			Search.autocompletado(query, items).map((result) => result.id),
			["transistor"],
		)
})

test("conserva el último término parcial para el autocompletado", () => {
	assert.deepEqual(
		Search.autocompletado("el trans", items).map((result) => result.id),
		["transistor"],
	)
})
