import { useState, useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { $hitosCache } from "@store/searchStore"

import type { SearchItem, SearchSuggestion } from "@/types/search"
import { Search } from "@hooks/SearchResult"

export const SearchBar = () => {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchSuggestion[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [cargando, setCargando] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState<number>(-1)
	const searchRef = useRef<HTMLDivElement | null>(null)

	const hitos = useStore($hitosCache)

	// Cargar los datos
	useEffect(() => {
		if ($hitosCache.get() !== null) return

		const cargarHitos = async () => {
			setCargando(true)
			try {
				const response = await fetch("/api/getHitos.json")
				if (!response.ok) throw new Error("Error al obtener datos")

				const datosLimpios: SearchItem[] = await response.json()

				$hitosCache.set(datosLimpios)
			} catch (error) {
				console.error("Error cargando el índice de búsqueda:", error)
			} finally {
				setCargando(false)
			}
		}

		cargarHitos()
	}, [])

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(e.target as Node)
			)
				setIsOpen(false)
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () =>
			document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setQuery(val)

		const datosActuales = hitos || []
		const resultados = Search.autocompletado(
			val,
			datosActuales,
		)

		setResults(resultados)
		setIsOpen(resultados.length > 0)
		setSelectedIndex(-1)
	}

	const handleSearch = () => {
		if (selectedIndex >= 0 && results[selectedIndex])
			window.location.href = results[selectedIndex].url
		else if (results.length > 0) window.location.href = results[0].url
		else if (query.trim() !== "") console.log("Buscar:", query)

		setIsOpen(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen || results.length === 0) return

		if (e.key === "ArrowDown") {
			e.preventDefault()
			setSelectedIndex((prevIndex) =>
				prevIndex < results.length - 1 ? prevIndex + 1 : 0,
			)
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setSelectedIndex((prevIndex) =>
				prevIndex > 0 ? prevIndex - 1 : results.length - 1,
			)
		} else if (e.key === "Enter") {
			e.preventDefault()
			handleSearch()
		} else if (e.key === "Escape") setIsOpen(false)
	}

	return (
		<div
			ref={searchRef}
			className="relative z-50 transition-all duration-700 ease-in-out max-w-5xl"
		>
			<div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none"></div>

			<div className="relative w-full flex items-center bg-zinc-900/90 border border-zinc-800 rounded-2xl p-2 max-sm:p-1 shadow-2xl backdrop-blur-xl">
				<div className="pl-3 pr-2 text-zinc-400 pointer-events-none">
					<svg
						className="size-5 max-sm:size-3"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						></path>
					</svg>
				</div>

				<input
					name="GlobalSearch"
					type="text"
					value={query}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onFocus={() => results.length > 0 && setIsOpen(true)}
					placeholder="Buscar en el Siglo XXI..."
					className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none px-2 py-1.5 text-sm font-normal"
					autoComplete="off"
				/>

				<button
					type="button"
					onClick={handleSearch}
					className="ml-2 px-4 max-sm:px-2 py-2 max-sm:py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm max-sm:text-xs rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 shrink-0"
				>
					{cargando ? "..." : "Buscar"}
				</button>
			</div>

			{isOpen && (
				<ul className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-50 text-left divide-y divide-zinc-800/50 max-h-60 overflow-y-scroll scrollbar-none">
					{results.map((item, i) => {
						const isSelected = i === selectedIndex

						return (
							<li
								key={item.id || item.url || `result-${i}`}
								className={`transition-colors ${
									isSelected
										? "bg-indigo-600/40 text-white"
										: "hover:bg-indigo-600/20 text-zinc-200"
								}`}
								onMouseEnter={() => setSelectedIndex(i)}
							>
								<a
									href={item.url}
									onClick={() => setIsOpen(false)}
									className="block px-4 py-2.5 text-zinc-200 text-xs sm:text-sm font-medium hover:text-indigo-300 transition-colors select-none"
								>
									{item.tituloCompleto}
								</a>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
