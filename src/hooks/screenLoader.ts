const initScreenLoader = () => {
	// if (sessionStorage.getItem("loaderShown") === "true") {
	//   document.querySelector("[data-screen-loader]")?.remove();
	//   return;
	// }

	const loader = document.querySelector<HTMLElement>("[data-screen-loader]")
	if (!loader || loader.dataset.bound === "true") return
	loader.dataset.bound = "true"

	const startedAt = performance.now()
	const bodyOverflow = document.body.style.overflow
	const main = document.querySelector<HTMLElement>("main")
	const mainOverflow = main?.style.overflowY ?? ""

	document.documentElement.dataset.screenLoading = "true"
	document.body.style.overflow = "hidden"
	if (main) main.style.overflowY = "hidden"

	let isHidden = false

	const hideLoader = () => {
		if (isHidden) return
		isHidden = true

		const delay = Math.max(0, 450 - (performance.now() - startedAt))

		window.setTimeout(() => {
			loader.classList.add("screen-loader--hidden")
			delete document.documentElement.dataset.screenLoading
			document.body.style.overflow = bodyOverflow
			if (main) main.style.overflowY = mainOverflow
			// sessionStorage.setItem("loaderShown", "true");

			window.setTimeout(() => loader.remove(), 700)
		}, delay)
	}

	window.addEventListener("hero:3d-ready", hideLoader, { once: true })
}

initScreenLoader()
document.addEventListener("astro:page-load", initScreenLoader)
