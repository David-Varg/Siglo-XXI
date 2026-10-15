import { atom } from "nanostores"
import type { SearchItem } from "@/types/search"

export const $hitosCache = atom<SearchItem[] | null>(null)

export async function getHitos(): Promise<SearchItem[]> {
	const current = $hitosCache.get()
	if (current) return current

	try {
		const res = await fetch("/api/getHitos.json")
		if (!res.ok) throw new Error("Fallo al cargar los hitos")

		const data: SearchItem[] = await res.json()
		$hitosCache.set(data)

		return data
	} catch (error) {
		console.error(error)
		return []
	}
}
