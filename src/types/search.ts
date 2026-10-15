export interface SearchItem {
	id: string
	title: string
	description: string
  category: string
  heroImage?: string
	year?: number
	[key: string]: unknown
}

export interface SearchSuggestion {
	id: string
	tituloCompleto: string
	url: string
}
