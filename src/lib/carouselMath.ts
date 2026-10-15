export const clampCarouselValue = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value))

export const wrapCarouselAngle = (degrees: number) =>
	((((degrees + 180) % 360) + 360) % 360) - 180

export const getActiveCarouselIndex = (
	angle: number,
	step: number,
	count: number,
) => {
	if (count <= 0 || step === 0) return 0
	return ((Math.round(-angle / step) % count) + count) % count
}
