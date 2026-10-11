import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)
let navigationTween: gsap.core.Tween | undefined

const cancelNavigationTween = () => navigationTween?.kill()
window.addEventListener("wheel", cancelNavigationTween, { passive: true })
window.addEventListener("touchstart", cancelNavigationTween, {
	passive: true,
})

window.addEventListener("keydown", (event) => {
	if (
		[
			"ArrowDown",
			"ArrowUp",
			"PageDown",
			"PageUp",
			"Home",
			"End",
			" ",
		].includes(event.key)
	)
		cancelNavigationTween()
})

const initHeroJourney = () => {
	const hero = document.querySelector<HTMLElement>("#hero-section")
	const telemetry = document.querySelector<HTMLElement>("#voyager-telemetry")
	const nav = document.querySelector<HTMLElement>("#journey-nav")
	const clouds = document.querySelector<HTMLElement>("#cloud-transition")

	if (!hero || !nav || !clouds) return
	if (hero.dataset.journeyBound === "true") return

	hero.dataset.journeyBound = "true"

	const flight = { progress: 0 }
	const reducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches

	const setFlight = (progress: number) => {
		;(
			window as Window & {
				__setHeroFlightProgress?: (value: number) => void
			}
		).__setHeroFlightProgress?.(progress)
	}

	gsap.set(nav, {
		autoAlpha: reducedMotion ? 1 : 0,
		y: reducedMotion ? 0 : -18,
	})
	nav.toggleAttribute("inert", !reducedMotion)

	if (nav.dataset.smoothNavigation !== "true") {
		nav.dataset.smoothNavigation = "true"

		nav.addEventListener("click", (e) => {
			const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
				'a[href^="#"]',
			)

			const destination = link?.getAttribute("href")?.slice(1)
			const target = destination
				? document.getElementById(destination)
				: null

			if (!target) return
			e.preventDefault()
			cancelNavigationTween()

			const scrollState = { y: window.scrollY }
			const y = Math.max(
				0,
				window.scrollY + target.getBoundingClientRect().top,
			)

			if (reducedMotion) window.scrollTo(0, y)
			else
				navigationTween = gsap.to(scrollState, {
					y,
					duration: Math.min(
						3.4,
						Math.max(1.6, Math.abs(y - window.scrollY) / 850),
					),
					ease: "power2.inOut",
					onUpdate: () => window.scrollTo(0, scrollState.y),
					onComplete: () =>
						history.replaceState(null, "", `#${destination}`),
				})
		})
	}

	const navLinks = nav.querySelector<HTMLElement>(".journey-nav-links")
	const indicator = nav.querySelector<HTMLElement>("#nav-hover-indicator")
	if (navLinks && indicator && indicator.dataset.bound !== "true") {
		indicator.dataset.bound = "true"
		const moveIndicator = (link: HTMLElement) => {
			gsap.to(indicator, {
				x: link.offsetLeft,
				width: link.offsetWidth,
				autoAlpha: 1,
				duration: 0.32,
				ease: "power3.out",
				overwrite: true,
			})
		}
		navLinks
			.querySelectorAll<HTMLElement>("a[href^='#']")
			.forEach((link) => {
				link.addEventListener("pointerenter", () => moveIndicator(link))
				link.addEventListener("focus", () => moveIndicator(link))
			})
		navLinks.addEventListener("pointerleave", () => {
			gsap.to(indicator, {
				autoAlpha: 0,
				duration: 0.18,
				overwrite: true,
			})
		})
		navLinks.addEventListener("focusout", (event) => {
			if (!navLinks.contains(event.relatedTarget as Node | null))
				gsap.to(indicator, {
					autoAlpha: 0,
					duration: 0.18,
					overwrite: true,
				})
		})
	}

	if (reducedMotion) {
		setFlight(0)
		return
	}

	gsap.timeline({ defaults: { ease: "power3.out" } })
		.fromTo(
			"#hero-canvas-container",
			{ autoAlpha: 0, scale: 1.06 },
			{ autoAlpha: 1, scale: 1, duration: 1.25 },
		)
		.from(
			"#hero-copy > *",
			{ y: 28, autoAlpha: 0, duration: 0.72, stagger: 0.12 },
			"-=0.72",
		)
		.from(
			"#voyager-telemetry",
			{ x: -24, autoAlpha: 0, duration: 0.7 },
			"-=0.4",
		)
		.from(
			"#hero-scroll-hint",
			{ y: 14, autoAlpha: 0, duration: 0.55 },
			"-=0.25",
		)

	const sequence = gsap.timeline({
		scrollTrigger: {
			id: "hero-flight",
			trigger: hero,
			start: "top top",
			end: "+=800%",
			scrub: 1.25,
			pin: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
		},
		onUpdate: () => {
			setFlight(flight.progress)

			const navigationVisible = flight.progress >= 0.9
			nav.toggleAttribute("inert", !navigationVisible)
		},
	})

	sequence.to(flight, { progress: 1, duration: 1, ease: "none" }, 0)
	sequence.to(
		"#hero-copy",
		{ autoAlpha: 0, y: -24, duration: 0.16, ease: "none" },
		0.12,
	)
	sequence.fromTo(
		telemetry,
		{ autoAlpha: 1, y: 0 },
		{
			autoAlpha: 0,
			y: -24,
			duration: 0.16,
			ease: "none",
			overwrite: "auto",
		},
		0.12,
	)
	sequence.to(
		"#audio-player",
		{ autoAlpha: 0.18, duration: 0.16, ease: "none" },
		0.12,
	)
	sequence.to(
		"#hero-scroll-hint",
		{ autoAlpha: 0, y: 12, duration: 0.1, ease: "none" },
		0.08,
	)
	sequence.to(
		clouds,
		{ opacity: 0.94, scale: 1.05, duration: 0.14, ease: "none" },
		0.82,
	)
	sequence.to(
		clouds,
		{ opacity: 0, scale: 1.22, duration: 0.04, ease: "none" },
		0.96,
	)
	sequence.to(
		nav,
		{ autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
		0.92,
	)
	gsap.fromTo(
		"#timeline-console",
		{ autoAlpha: 0, y: 72 },
		{
			autoAlpha: 1,
			y: 0,
			ease: "none",
			scrollTrigger: {
				trigger: "#section-timeline",
				start: "top bottom",
				end: "top top",
				scrub: 0.65,
				invalidateOnRefresh: true,
			},
		},
	)
	gsap.timeline({
		scrollTrigger: {
			trigger: "#section-team",
			start: "top bottom",
			end: "top 68%",
			scrub: 0.8,
			invalidateOnRefresh: true,
		},
	}).fromTo(
		"#section-team",
		{ y: 54, autoAlpha: 0.45 },
		{ y: 0, autoAlpha: 1, ease: "none" },
		0,
	)

	gsap.timeline({
		scrollTrigger: {
			trigger: "#timeline-console [data-carousel-stage]",
			start: "top 92%",
			end: "bottom 12%",
			scrub: 0.8,
			invalidateOnRefresh: true,
		},
	})
		.fromTo(
			"#timeline-console [data-carousel-stage]",
			{ autoAlpha: 0, y: 56, scale: 0.96 },
			{ autoAlpha: 1, y: 0, scale: 1, ease: "none" },
		)
		.to("#timeline-console [data-carousel-stage]", {
			autoAlpha: 0,
			y: -44,
			scale: 0.98,
			ease: "none",
		})
}

const initTeamAndFooterAnimations = () => {
	const mainTimeline = gsap.timeline({
		scrollTrigger: {
			trigger: "#section-team",
			start: "top 80%",
			end: "bottom bottom",
			toggleActions: "play reverse play reverse",
		},
	})

	mainTimeline
		.from("#header h2", {
			y: 50,
			autoAlpha: 0,
			duration: 0.9,
			ease: "power4.out",
		})
		.from(
			"#header p",
			{
				y: 25,
				autoAlpha: 0,
				duration: 0.7,
				ease: "power3.out",
			},
			"-=0.6",
		)

	const cards = gsap.utils.toArray<HTMLElement>("#section-team article")

	if (cards.length > 0) {
		gsap.set("#cards-grid", { perspective: 1000 })

		mainTimeline.from(
			cards,
			{
				y: 90,
				scale: 0.88,
				rotateX: -15,
				autoAlpha: 0,
				duration: 1,
				stagger: {
					amount: 0.6,
					ease: "power2.out",
				},
				ease: "power4.out",
				clearProps: "transform,perspective",
			},
			"-=0.4",
		)

		mainTimeline.from(
			"#section-team article .card-avatar",
			{
				scale: 0.5,
				autoAlpha: 0,
				duration: 0.6,
				stagger: 0.1,
				ease: "back.out(1.7)",
			},
			"-=0.7",
		)
	}

	mainTimeline.from(
		"#global-footer",
		{
			y: 35,
			autoAlpha: 0,
			duration: 0.8,
			ease: "power3.out",
		},
		"-=0.3",
	)

	cards.forEach((card) => {
		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect()
			const x = e.clientX - rect.left - rect.width / 2
			const y = e.clientY - rect.top - rect.height / 2

			gsap.to(card, {
				rotateX: -y * 0.08,
				rotateY: x * 0.08,
				duration: 0.4,
				ease: "power2.out",
			})
		})

		card.addEventListener("mouseleave", () => {
			gsap.to(card, {
				rotateX: 0,
				rotateY: 0,
				duration: 0.6,
				ease: "power2.out",
			})
		})
	})
}

document.addEventListener("astro:page-load", () => {
	ScrollTrigger.refresh()
	initHeroJourney()
	initTeamAndFooterAnimations()
})
