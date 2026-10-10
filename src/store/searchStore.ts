import { atom } from "nanostores"
import type { SearchItem } from "@/types/search"

export const $hitosCache = atom<SearchItem[] | null>(null)
