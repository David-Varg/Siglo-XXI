import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

let ctx: gsap.Context | null = null

document.addEventListener("astro:page-load", () => {
	if (ctx) ctx.revert()

	ctx = gsap.context(() => {
		const tl = gsap.timeline({
			defaults: { ease: "power3.out" },
		})

		tl.from("#main-header", {
			y: -40,
			autoAlpha: 0,
			duration: 1,
		})
			.from(
				"#aside-info",
				{
					x: -30,
					autoAlpha: 0,
					duration: 0.8,
				},
				"-=0.5",
			)
			.from(
				"#main-content",
				{
					y: 30,
					autoAlpha: 0,
					duration: 0.8,
				},
				"<0.1",
			)

		const articleElements = gsap.utils.toArray<HTMLElement>(
			"#main-content :is(h2, h3, p, img, blockquote, ul, ol)",
		)

		ScrollTrigger.batch(articleElements, {
			start: "top 90%",
			once: false,
			onEnter: (batch) => {
				gsap.fromTo(
					batch,
					{ y: 45, autoAlpha: 0 },
					{
						y: 0,
						autoAlpha: 1,
						duration: 0.9,
						stagger: 0.15,
						ease: "power2.out",
					},
				)
			},
			onLeaveBack: (batch) => {
				gsap.to(batch, {
					y: 45,
					autoAlpha: 0,
					duration: 0.4,
				})
			},
		})

		const nextTrigger = document.getElementById("next-post-trigger")
		if (nextTrigger) {
			const nextUrl = nextTrigger.dataset.nextUrl

			ScrollTrigger.create({
				trigger: nextTrigger,
				start: "top 80%",
				onEnter: () => {
					gsap.fromTo(
						nextTrigger,
						{ scale: 0.95, autoAlpha: 0.7 },
						{
							scale: 1,
							autoAlpha: 1,
							duration: 0.6,
							ease: "back.out(1.7)",
						},
					)
				},
			})
		}
	})
})

document.addEventListener("astro:before-swap", () => {
	if (ctx) ctx.revert()
})
