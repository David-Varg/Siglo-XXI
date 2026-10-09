import { useState, useEffect } from "react"

export const VoyagerInfo = () => {
	const [kms, setKms] = useState("")

	useEffect(() => {
		const EPOCH_DATE = new Date("2026-01-01T00:00:00Z").getTime()
		const BASE_DISTANCE_KM = 24350000000
		const SPEED_KM_PER_SEC = 16.999

		const updateDistance = () => {
			const now = Date.now()
			const elapsedSeconds = (now - EPOCH_DATE) / 1000
			const currentDistance =
				BASE_DISTANCE_KM + elapsedSeconds * SPEED_KM_PER_SEC

			setKms(Math.floor(currentDistance).toLocaleString("es-ES"))

			requestAnimationFrame(updateDistance)
		}

		updateDistance()
	}, [])

	return (
		<div id="voyager-telemetry" className="absolute bottom-28 left-8 z-20 flex flex-col gap-2 rounded-xl border border-cyan-500/30 bg-zinc-950/60 p-4 backdrop-blur-md font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
			<div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
				<span className="relative flex h-2 w-2">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
					<span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
				</span>
				<span className="font-bold tracking-wider text-white">
					VOYAGER 1 — TELEMETRÍA EN VIVO
				</span>
			</div>

			<div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-1 text-[11px]">
				<span className="text-zinc-400">Hito:</span>
				<span className="text-emerald-600 font-extrabold">
					Primer objeto en espacio <br />
					interestelar (2012)
				</span>

				<span className="text-zinc-400">Posición:</span>
				<span className="text-emerald-400 font-semibold">
					Espacio Interestelar
				</span>

				<span className="text-zinc-400">Distancia a la Tierra:</span>
				<span
					className="text-cyan-200 font-semibold"
					id="voyager-distance"
				>
					{kms} km
				</span>

				<span className="text-zinc-400">Velocidad actual:</span>
				<span className="text-cyan-200">~61,152 km/h</span>

				<span className="text-zinc-400">Retraso de señal:</span>
				<span className="text-cyan-200">~22.5 Horas (One-Way)</span>
			</div>
		</div>
	)
}
