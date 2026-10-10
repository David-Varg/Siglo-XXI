import type { SearchItem, SearchSuggestion } from "@/types/search"

export type { SearchItem, SearchSuggestion } from "@/types/search"

const normalize = (value: string) =>
	value
		.toLocaleLowerCase("es")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")

export const Search = {
	autocompletado(query: string, items: SearchItem[]): SearchSuggestion[] {
		const term = normalize(query.trim())
		if (!term) return []

		return items
			.filter((item) =>
				normalize(
					`${item.title} ${item.category} ${item.description}`,
				).includes(term),
			)
			.map((item) => ({
				id: item.id,
				tituloCompleto: item.title,
				url: `/blog/${encodeURIComponent(item.id)}`,
			}))
	},
}
