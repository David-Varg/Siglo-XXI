export interface BlogHeaderProps {
	year: number
	century: string
	place: string
	impactScore: number
	badgeConfig?: {
		class: string
	}
}

export interface BlogAsideInfoProps {
	inventor: {
		name: string
		role: string
		avatar?: string
		github?: string
	}[]
	precededBy: string[]
	impactScore: number
	category: string
	barColor?: string
}

export interface BlogContentProps {
	description: string
	heroImage: string
	model3d?: string
	isRetro?: boolean
}
