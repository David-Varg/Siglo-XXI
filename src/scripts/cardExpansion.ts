const dialog = document.querySelector<HTMLDialogElement>("#team-card-dialog")

if (dialog && dialog.dataset.bound !== "true") {
	dialog.dataset.bound = "true"
	let opener: HTMLElement | null = null

	const setLink = (key: "github" | "twitter" | "threads", url: string) => {
		const link = dialog.querySelector<HTMLAnchorElement>(
			`[data-dialog-${key}]`,
		)
		if (!link) return
		link.href = url
		link.hidden = !url || url === "#"
	}

	const openCard = (card: HTMLElement) => {
		opener = card
		const avatar = dialog.querySelector<HTMLImageElement>(
			"[data-dialog-avatar]",
		)
		if (avatar) {
			avatar.src = card.dataset.avatar ?? ""
			avatar.alt = `Foto de ${card.dataset.name ?? "integrante"}`
		}
		dialog.querySelector<HTMLElement>("[data-dialog-name]")!.textContent =
			card.dataset.name ?? ""
		dialog.querySelector<HTMLElement>("[data-dialog-role]")!.textContent =
			card.dataset.role ?? ""
		const badge = dialog.querySelector<HTMLElement>("[data-dialog-badge]")!
		badge.textContent = card.dataset.badge ?? ""
		badge.hidden = !badge.textContent
		setLink("github", card.dataset.github ?? "")
		setLink("twitter", card.dataset.twitter ?? "")
		setLink("threads", card.dataset.threads ?? "")
		dialog.showModal()
	}

	document
		.querySelectorAll<HTMLElement>("[data-card-open]")
		.forEach((card) => {
			card.addEventListener("click", (event) => {
				if (
					event.target instanceof Element &&
					event.target.closest("a")
				)
					return
				openCard(card)
			})
			card.addEventListener("keydown", (event) => {
				if (
					event.target !== card ||
					(event.key !== "Enter" && event.key !== " ")
				)
					return
				event.preventDefault()
				openCard(card)
			})
		})

	dialog
		.querySelector<HTMLButtonElement>("[data-card-close]")
		?.addEventListener("click", () => dialog.close())
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) dialog.close()
	})
	dialog.addEventListener("close", () => opener?.focus())
}
