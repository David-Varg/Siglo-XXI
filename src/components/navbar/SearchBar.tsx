import { useState, useEffect, useRef } from "react"
import { useStore } from "@nanostores/react"
import { $hitosCache, getHitos } from "@store/searchStore"

import type { SearchSuggestion } from "@/types/search"
import { Search } from "@hooks/SearchResult"

export const SearchBar = () => {
	const [query, setQuery] = useState("")
	const [results, setResults] = useState<SearchSuggestion[]>([])
	const [isOpen, setIsOpen] = useState(false)
	const [cargando, setCargando] = useState(false)
	const [hasNoResults, setHasNoResults] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState<number>(-1)
	const searchRef = useRef<HTMLDivElement | null>(null)

	const hitos = useStore($hitosCache)

	// Cargar los datos de la api xd
	useEffect(() => {
		setCargando(true)

		const cargarHitos = async () => {
			try {
				await getHitos()
			} finally {
				setCargando(false)
			}
		}

		cargarHitos()
	}, [])

	// Evitar Race Conditions, por si aún no se han cargado los datos pero el usuario escribe,
	// que se actualice cuando lleguen los datos sin necesidad de que el usuario vuelva a
	// escribir
	useEffect(() => {
		if (hitos && query.trim() !== "") {
			const resultados = Search.autocompletado(query, hitos)
			setResults(resultados)
			setIsOpen(resultados.length > 0)
			if (resultados.length > 0) setHasNoResults(false)
		}
	}, [hitos])

	// Ponerse a escuchar hasta que el usuario clickee por fuera del buscador
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

	// Busca el elemento dentro de la referencia que contenga el "data-active='true'"
	// y si existe, hace scroll hacia él.
	// Esta función se activa cada vez que el "selectedIndex" cambia, y la única forma de que cambie
	// es por el handleKeyDown
	useEffect(() => {
		if (!searchRef.current) return

		const elementoActivo = searchRef.current.querySelector(
			"[data-active='true']",
		)

		if (elementoActivo)
			elementoActivo.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			})
	}, [selectedIndex])

	// Leer lo que escribe y enviarlo al autocompletado para que actualice los resultados
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setQuery(val)
		setHasNoResults(false)

		const datosActuales = hitos || []
		const resultados = Search.autocompletado(val, datosActuales)

		setResults(resultados)
		setIsOpen(resultados.length > 0)
		setSelectedIndex(-1)
	}

	// Básicamente, para que entienda Tomás, es que:
	// 1. Si el indice seleccionado es mayor a 0 y existe dentro de results, consiga el link
	// de ese resultado seleccionado y redirija hacia esa página
	// 2. En caso de que no haya seleccionado nada y le haya dado "enter" lo redirije al primer resultado
	// 3. En caso que haya escrito algo y no hayan resultados, se marca en "rojo", solo funciona en
	// caso de usar el botón, ya que para que funcione con "Enter" debe estar dentro de un <form></form>
	const handleSearch = () => {
		if (selectedIndex >= 0 && results[selectedIndex])
			window.location.href = results[selectedIndex].url
		else if (results.length > 0) window.location.href = results[0].url

		setQuery("")
		setIsOpen(false)
	}

	// Es simplemente la lógica para que pueda subir o bajar en el array
	// de selecciones usando las flechitas. Y en caso de que haya seleccionado
	// el "Enter" llamada a handleSearch; desactiva el setIsOpen si le da a "escape"
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen && query.trim() === "") return
		else if (results.length === 0 && query.trim() !== "") {
			setHasNoResults(true)
			return
		}

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
			className="[view-transition-name:search-bar] size-full max-w-full min-h-[54.13px] relative z-50 transition-all duration-700 ease-in-out"
		>
			<div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 pointer-events-none"></div>

			<div
				className={`${hasNoResults ? "border-red-500 animate-shake" : "border-zinc-800"} border min-w-78.75 min-h-[45.13px] w-full relative flex items-center bg-zinc-900/90 rounded-2xl p-2 max-sm:p-1 shadow-2xl backdrop-blur-xl`}
			>
				<label className="w-full min-h-[45.13px] relative flex items-center cursor-pointer">
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
							/>
						</svg>
					</div>

					<input
						name="GlobalSearch"
						type="text"
						value={query}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onFocus={() => results.length > 0 && setIsOpen(true)}
						placeholder="Buscar registro histórico..."
						className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none px-2 py-1.5 text-sm font-mono"
						autoComplete="off"
					/>
				</label>

				<button
					type="button"
					onClick={handleSearch}
					className="ml-2 px-4 max-sm:px-2 py-2 max-sm:py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm max-sm:text-xs rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 shrink-0"
				>
					{cargando ? "..." : "Buscar"}
				</button>
			</div>

			{results.length > 0 && (
				<ul
					aria-hidden={!isOpen}
					inert={!isOpen}
					className={[
						"absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-50 text-left divide-y divide-zinc-800/50 max-h-60 overflow-y-scroll scrollbar-none transition-[opacity,transform,visibility] duration-200 ease-out",
						isOpen
							? "visible translate-y-0 opacity-100"
							: "invisible -translate-y-1 opacity-0 pointer-events-none",
					].join(" ")}
				>
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
								data-active={isSelected}
								onMouseEnter={() => setSelectedIndex(i)}
							>
								<a
									href={item.url}
									onClick={() => setIsOpen(false)}
									className="font-body block px-4 py-2.5 text-zinc-200 text-xs sm:text-sm font-medium hover:text-indigo-300 transition-colors select-none"
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
