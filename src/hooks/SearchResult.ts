// No usé una librería aquí por practicar
import type { SearchItem, SearchSuggestion } from "@/types/search"
import stopwordsData from "@/data/stopwords.json" with { type: "json" }

export type { SearchItem, SearchSuggestion } from "@/types/search"

const normalize = (value: string): string =>
	value
		.toLocaleLowerCase("es")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")

const STOP_WORDS = new Set(stopwordsData.stopwords)

const tokenizeForIndexing = (value: string): string[] => {
	return normalize(value)
		.replace(/[^\w\s]/g, " ")
		.split(/\s+/)
		.filter((word) => word.length > 0 && !STOP_WORDS.has(word))
}

const tokenizeForQuery = (value: string): string[] => {
  const trimmedValue = value.trimEnd()
	if (trimmedValue.length === 0) return []
  
	const rawTokens = normalize(trimmedValue)
		.replace(/[^\w\s]/g, " ")
		.split(/\s+/)
		.filter((word) => word.length > 0)

	if (rawTokens.length === 0) return []

	return rawTokens.filter(
			(word, index) =>
				index === rawTokens.length - 1 || !STOP_WORDS.has(word),
		)
}

class NodoTrie {
	hijos: Record<string, NodoTrie> = {}
	esFinDePalabra: boolean = false
	sugerencias: Set<SearchSuggestion> = new Set()
}

class TrieBusqueda {
	raiz: NodoTrie = new NodoTrie()
	cantidadPosiblesBusquedas: number = 0

	insertar(item: SearchItem) {
		const sugerencia: SearchSuggestion = {
			id: item.id,
			tituloCompleto: item.title,
			url: `/blog/${encodeURIComponent(item.id)}`,
		}

		const textoCompleto = `${item.title} ${item.category} ${item.description}`
		const tokens = tokenizeForIndexing(textoCompleto)

		for (const token of tokens) {
			let nodoActual = this.raiz

			for (const char of token) {
				if (!nodoActual.hijos[char])
					nodoActual.hijos[char] = new NodoTrie()

				nodoActual = nodoActual.hijos[char]
			}

			this.cantidadPosiblesBusquedas++
			nodoActual.esFinDePalabra = true
			nodoActual.sugerencias.add(sugerencia)
		}
	}

	private analizarTexto(
		texto: string,
		nodo: NodoTrie,
		i: number,
		erroresRestantes: number,
		nodosEncontrados: Set<NodoTrie>,
	) {
		if (erroresRestantes < 0) return

		if (i === texto.length) {
      nodosEncontrados.add(nodo)
			this.excavarNodosRecursivo(nodo, nodosEncontrados)
			return
		}

		const charActual = texto[i]

		if (nodo.hijos[charActual])
			this.analizarTexto(
				texto,
				nodo.hijos[charActual],
				i + 1,
				erroresRestantes,
				nodosEncontrados,
			)

		if (erroresRestantes > 0) {
			for (const letraHijo in nodo.hijos)
				if (letraHijo !== charActual)
					this.analizarTexto(
						texto,
						nodo.hijos[letraHijo],
						i + 1,
						erroresRestantes - 1,
						nodosEncontrados,
					)

			this.analizarTexto(
				texto,
				nodo,
				i + 1,
				erroresRestantes - 1,
				nodosEncontrados,
			)

			for (const letraHijo in nodo.hijos)
				this.analizarTexto(
					texto,
					nodo.hijos[letraHijo],
					i,
					erroresRestantes - 1,
					nodosEncontrados,
				)
		}
	}

	private excavarPalabras(nodo: NodoTrie, resultados: Set<SearchSuggestion>) {
		for (const sugerencia of nodo.sugerencias) resultados.add(sugerencia)

		for (const char in nodo.hijos)
			this.excavarPalabras(nodo.hijos[char], resultados)
  }

  private excavarNodosRecursivo(nodo: NodoTrie, nodosEncontrados: Set<NodoTrie>) {
		for (const char in nodo.hijos) {
			const hijo = nodo.hijos[char]
			nodosEncontrados.add(hijo)
			this.excavarNodosRecursivo(hijo, nodosEncontrados)
		}
	}

	private buscarToken(
		token: string,
		maxErrores: number,
	): Set<SearchSuggestion> {
		const nodosEncontrados = new Set<NodoTrie>()

		let erroresPermitidos = maxErrores
		if (token.length <= 2) erroresPermitidos = 0
		else if (token.length <= 4) erroresPermitidos = Math.min(1, maxErrores)

		this.analizarTexto(token, this.raiz, 0, erroresPermitidos, nodosEncontrados)

		const resultados = new Set<SearchSuggestion>()
		for (const nodo of nodosEncontrados)
			this.excavarPalabras(nodo, resultados)

		return resultados
	}

	autocompletadoPorTokens(
		query: string,
		maxErrores: number = 2,
	): SearchSuggestion[] {
		const queryTokens = tokenizeForQuery(query)
		if (queryTokens.length === 0) return []

		let resultadosFinales: Set<SearchSuggestion> | null = null

		for (const token of queryTokens) {
			const resultadosToken = this.buscarToken(token, maxErrores)

			if (resultadosFinales === null)
				resultadosFinales = new Set(resultadosToken)
			else
				resultadosFinales = new Set(
					[...resultadosFinales].filter((item) =>
						resultadosToken.has(item),
					),
				)

			if (resultadosFinales.size === 0) break
		}

		return resultadosFinales ? Array.from(resultadosFinales) : []
	}
}

export const Search = {
	autocompletado(
		query: string,
		items: SearchItem[],
		maxErrores: number = 2,
	): SearchSuggestion[] {
		const trie = new TrieBusqueda()
		for (const item of items) trie.insertar(item)

		return trie.autocompletadoPorTokens(query, maxErrores)
	},
}
