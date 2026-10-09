import { atom } from "nanostores"
import type { SearchItem } from "@hooks/SearchResult"

export const $hitosCache = atom<SearchItem[] | null>(null)
