import { useState, useRef, useEffect } from "react"

export const AudioPlayer = () => {
	const [playing, setPlaying] = useState(true)

	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		const preference = localStorage.getItem("AudioPreference")
		const shouldPlay = preference ? preference === "on" : true

		setPlaying(shouldPlay)

		if (audioRef.current)
			if (shouldPlay)
				audioRef.current.play().catch((err) => {
					console.log(
						"Autoplay bloqueado por el navegador hasta que el usuario interactúe:",
						err,
					)
					setPlaying(false)
				})
			else audioRef.current.pause()
	}, [])

	const togglePlay = () => {
		const nextPlaying = !playing
		setPlaying(nextPlaying)

		if (audioRef.current)
			if (nextPlaying)
				audioRef.current.play().catch((e) => console.log(e))
			else audioRef.current.pause()

		localStorage.setItem("AudioPreference", nextPlaying ? "on" : "off")
	}

	return (
		<div
			className="fixed bottom-10 right-10 z-40 select-none"
		>
			<audio ref={audioRef} loop src="/sounds/Utrymme.mp3" />

			<button
				onClick={togglePlay}
				aria-label={playing ? "Silenciar sonido" : "Activar sonido"}
				aria-pressed={playing}
				className={`size-11 hover:size-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200
        ${
			playing
				? "bg-purple-600/80 border-purple-400 text-white motion-safe:animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.5)]"
				: "bg-black/40 hover:bg-gray-900/60 border-white/10 text-gray-400"
		}`}
			>
				{playing ? "🔊" : "🔇"}
			</button>
		</div>
	)
}
