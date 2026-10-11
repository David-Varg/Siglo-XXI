import type { CSSProperties } from "react"

export interface CircularCarouselItem {
	src: string
	alt?: string
	title?: string
	subtitle?: string
}

export type CircularCarouselPreset = "cylinder" | "orbit" | "wheel" | "panorama"
export type CircularCarouselIntro = "assemble" | "rise" | "spin" | "none"
export type CircularCarouselAutoplay = "drift" | "step" | "off"

export interface CircularCarouselProps {
	items?: CircularCarouselItem[]
	preset?: CircularCarouselPreset
	intro?: CircularCarouselIntro
	cardWidth?: number
	aspectRatio?: number
	gap?: number
	curve?: number
	tilt?: number
	perspective?: number
	autoplay?: CircularCarouselAutoplay
	speed?: number
	interval?: number
	direction?: "left" | "right"
	draggable?: boolean
	momentum?: number
	snap?: boolean
	pauseOnHover?: boolean
	focusOnClick?: boolean
	parallax?: number
	stretch?: number
	depthFade?: number
	fadeColor?: string
	innerShade?: number
	cornerRadius?: number
	captions?: boolean
	onChange?: (index: number) => void
	onItemClick?: (item: CircularCarouselItem, index: number) => void
	className?: string
	ariaLabel?: string
	style?: CSSProperties
}
