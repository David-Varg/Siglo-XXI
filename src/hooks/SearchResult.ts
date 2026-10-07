const normalize = (value: string) =>
	value
		.toLocaleLowerCase("es")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")

export interface SearchItem {
	id: string
	title: string
	description: string
	category: string
}

export const Search = {
	autocompletado(query: string, items: SearchItem[]) {
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
