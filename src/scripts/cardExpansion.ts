const dialog = document.querySelector<HTMLDialogElement>("#team-card-dialog")

if (dialog && dialog.dataset.bound !== "true") {
	dialog.dataset.bound = "true"
	let opener: HTMLButtonElement | null = null

	const setLink = (key: "github" | "twitter" | "threads", url: string) => {
		const link = dialog.querySelector<HTMLAnchorElement>(`[data-dialog-${key}]`)
		if (!link) return
		link.href = url
		link.hidden = !url || url === "#"
	}

	document.querySelectorAll<HTMLButtonElement>("[data-card-open]").forEach((button) => {
		button.addEventListener("click", () => {
			opener = button
			const avatar = dialog.querySelector<HTMLImageElement>("[data-dialog-avatar]")
			if (avatar) {
				avatar.src = button.dataset.avatar ?? ""
				avatar.alt = `Foto de ${button.dataset.name ?? "integrante"}`
			}
			dialog.querySelector<HTMLElement>("[data-dialog-name]")!.textContent = button.dataset.name ?? ""
			dialog.querySelector<HTMLElement>("[data-dialog-role]")!.textContent = button.dataset.role ?? ""
			const badge = dialog.querySelector<HTMLElement>("[data-dialog-badge]")!
			badge.textContent = button.dataset.badge ?? ""
			badge.hidden = !badge.textContent
			setLink("github", button.dataset.github ?? "")
			setLink("twitter", button.dataset.twitter ?? "")
			setLink("threads", button.dataset.threads ?? "")
			dialog.showModal()
		})
	})

	dialog.querySelector<HTMLButtonElement>("[data-card-close]")?.addEventListener("click", () => dialog.close())
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close()
	})
	dialog.addEventListener("close", () => opener?.focus())
}
