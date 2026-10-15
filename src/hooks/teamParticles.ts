let activeParticles: { destroy: () => void } | undefined
let observer: IntersectionObserver | undefined
let isLoading = false

const initParticles = async (container: HTMLElement) => {
	if (isLoading || container.dataset.loaded === "true") return
	isLoading = true
	const compactDevice =
		window.matchMedia("(max-width: 767px)").matches ||
		window.matchMedia("(pointer: coarse)").matches ||
		navigator.hardwareConcurrency <= 4

	try {
		const [{ tsParticles }, { loadSlim }] = await Promise.all([
			import("@tsparticles/engine"),
			import("@tsparticles/slim"),
		])
		await loadSlim(tsParticles)
		if (!container.isConnected) return

		activeParticles = await tsParticles.load({
			id: container.id,
			options: {
				fullScreen: { enable: false },
				fpsLimit: compactDevice ? 20 : 30,
				particles: {
					color: { value: "#a7f3d0" },
					links: {
						color: "#818cf8",
						distance: 140,
						enable: !compactDevice,
						opacity: 0.25,
						width: 1,
					},
					move: {
						enable: true,
						speed: 0.4,
						direction: "none",
						outModes: { default: "bounce" },
					},
					collisions: { enable: !compactDevice },
					number: {
						density: { enable: true, width: 800, height: 800 },
						value: compactDevice ? 42 : 100,
					},
					opacity: { value: { min: 0.2, max: 0.6 } },
					size: { value: { min: 1.5, max: 4 } },
				},
				interactivity: {
					events: {
						onHover: { enable: !compactDevice, mode: "grab" },
					},
					modes: { grab: { distance: 200 } },
				},
				detectRetina: !compactDevice,
			},
		})
		container.dataset.loaded = "true"
	} finally {
		isLoading = false
	}
}

const observeParticles = () => {
	const container = document.getElementById("particles-container")
	if (!container || container.dataset.observing === "true") return
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

	container.dataset.observing = "true"
	if (!("IntersectionObserver" in window)) {
		void initParticles(container)
		return
	}

	observer = new IntersectionObserver(([entry]) => {
		if (!entry.isIntersecting) return
		observer?.disconnect()
		void initParticles(container)
	})
	observer.observe(container)
}

const cleanParticles = () => {
	observer?.disconnect()
	observer = undefined
	activeParticles?.destroy()
	activeParticles = undefined
}

observeParticles()
document.addEventListener("astro:page-load", observeParticles)
document.addEventListener("astro:before-swap", cleanParticles)
