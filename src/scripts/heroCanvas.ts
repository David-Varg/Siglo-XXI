import type * as THREE_NS from "three"

let animationFrameId: number
let onMouseMove: (e: MouseEvent) => void
let onResize: () => void

const initScene = async () => {
	const container = document.getElementById("hero-canvas-container")
	const canvas = document.getElementById("hero-canvas") as HTMLCanvasElement
	if (!container || !canvas || container.dataset.sceneInitialized === "true")
		return
	container.dataset.sceneInitialized = "true"

	let THREE: typeof import("three")
	let GLTFLoader: typeof import("three/examples/jsm/loaders/GLTFLoader.js").GLTFLoader
	let DRACOLoader: typeof import("three/examples/jsm/loaders/DRACOLoader.js").DRACOLoader
	let OBJLoader: typeof import("three/examples/jsm/loaders/OBJLoader.js").OBJLoader
	try {
		;[THREE, { GLTFLoader }, { DRACOLoader }, { OBJLoader }] =
			await Promise.all([
				import("three"),
				import("three/examples/jsm/loaders/GLTFLoader.js"),
				import("three/examples/jsm/loaders/DRACOLoader.js"),
				import("three/examples/jsm/loaders/OBJLoader.js"),
			])
	} catch (error) {
		console.error("No se pudo inicializar la escena 3D:", error)
		window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		return
	}

	if (animationFrameId) cancelAnimationFrame(animationFrameId)
	if (onMouseMove) window.removeEventListener("mousemove", onMouseMove)
	if (onResize) window.removeEventListener("resize", onResize)

	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	)
	camera.position.set(0, 1.5, -11)
	camera.lookAt(0, 0, 0)

	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: true,
	})

	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFShadowMap

	const ambientLight = new THREE.AmbientLight(0x07101e, 0.78)
	scene.add(ambientLight)

	const sunLight = new THREE.DirectionalLight(0xffd08a, 6.5)
	sunLight.position.set(-54, 18, -408)
	sunLight.target.position.set(0, 0, -130)
	sunLight.castShadow = true
	scene.add(sunLight)
	scene.add(sunLight.target)

	const pointSunLight = new THREE.PointLight(0xffad42, 850, 360, 1.7)
	pointSunLight.position.copy(sunLight.position)
	scene.add(pointSunLight)

	const fillLight = new THREE.DirectionalLight(0x38bdf8, 2.0)
	fillLight.position.set(-5, -3, 3)
	fillLight.castShadow = true
	scene.add(fillLight)

	const rimLight = new THREE.DirectionalLight(0xa855f7, 3.5)
	rimLight.position.set(0, -6, -4)
	rimLight.castShadow = true
	scene.add(rimLight)

	// Definir variables
	let voyager: THREE_NS.Group | null = null
	let saturn: THREE_NS.Group | null = null
	let earth: THREE_NS.Object3D | null = null
	let starStreaks: THREE_NS.LineSegments | null = null
	const streakCenters: [number, number, number][] = []

	let flightProgress = 0

	const cameraPivot = new THREE.Vector3()
	const cameraOffset = new THREE.Vector3()
	const cameraTarget = new THREE.Vector3()

	const setFlightProgress = (value: number) => {
		flightProgress = THREE.MathUtils.clamp(value, 0, 1)
		const pivot = voyager?.position ?? cameraPivot.set(0, 0, 0)

		if (flightProgress < 0.42) {
			if (voyager) voyager.position.z = 0

			const turn = THREE.MathUtils.clamp(flightProgress / 0.34, 0, 1)
			const angle = turn * Math.PI

			cameraOffset.set(Math.sin(angle) * 11, 1.5, -Math.cos(angle) * 11)

			camera.position.copy(pivot).add(cameraOffset)
			camera.lookAt(pivot)
		} else {
			const travel = THREE.MathUtils.clamp(
				(flightProgress - 0.42) / 0.5,
				0,
				1,
			)

			const easedTravel = 0.5 - Math.cos(Math.PI * travel) * 0.5
			if (voyager) voyager.position.z = -easedTravel * 118

			camera.position.set(pivot.x, pivot.y + 1.5, pivot.z + 11)
			cameraTarget.set(
				pivot.x,
				pivot.y - 0.7,
				pivot.z - 5 - easedTravel * 25,
			)

			camera.lookAt(cameraTarget)
		}

		if (flightProgress >= 0.92 && voyager) {
			camera.position.set(
				voyager.position.x,
				voyager.position.y + 1.5,
				voyager.position.z + 11,
			)
			cameraTarget.set(0, 0, -148)
			camera.lookAt(cameraTarget)
		}

		const streakProgress = THREE.MathUtils.clamp(
			(flightProgress - 0.42) / 0.22,
			0,
			1,
		)

		if (starStreaks) {
			const positions = starStreaks.geometry.getAttribute(
				"position",
			) as THREE_NS.BufferAttribute

			const values = positions.array as Float32Array
			const streakLength = 0.035 + streakProgress * 1.8

			for (let i = 0; i < streakCenters.length; i++) {
				const [x, y, z] = streakCenters[i]!
				const magnitude = Math.max(0.001, Math.hypot(x, y))

				const dx = (x / magnitude) * streakLength * 0.5
				const dy = (y / magnitude) * streakLength * 0.5

				const offset = i * 6

				values[offset] = x - dx
				values[offset + 1] = y - dy
				values[offset + 2] = z
				values[offset + 3] = x + dx
				values[offset + 4] = y + dy
				values[offset + 5] = z
			}

			positions.needsUpdate = true
			starStreaks.visible = streakProgress > 0.02
			;(starStreaks.material as THREE_NS.LineBasicMaterial).opacity =
				streakProgress * 0.85
		}
	}

	;(
		window as Window & {
			__setHeroFlightProgress?: (value: number) => void
		}
	).__setHeroFlightProgress = setFlightProgress

	const loader = new GLTFLoader()
	const dracoLoader = new DRACOLoader()

	// --------- Renders 3D -----------
	const sunTextureCanvas = document.createElement("canvas")

	sunTextureCanvas.width = 512
	sunTextureCanvas.height = 256

	const sunContext = sunTextureCanvas.getContext("2d")

	if (sunContext) {
		const surface = sunContext.createLinearGradient(0, 0, 0, 256)
		surface.addColorStop(0, "#ffd66b")
		surface.addColorStop(0.45, "#ff8a24")
		surface.addColorStop(1, "#d93716")

		sunContext.fillStyle = surface
		sunContext.fillRect(0, 0, 512, 256)

		for (let i = 0; i < 110; i++) {
			sunContext.fillStyle =
				i % 3 === 0 ? "rgba(255,238,150,0.18)" : "rgba(109,24,5,0.13)"
			sunContext.fillRect(
				Math.random() * 512,
				Math.random() * 256,
				18 + Math.random() * 95,
				1 + Math.random() * 4,
			)
		}
	}

	const sunTexture = new THREE.CanvasTexture(sunTextureCanvas)

	sunTexture.colorSpace = THREE.SRGBColorSpace

	const sun = new THREE.Mesh(
		new THREE.SphereGeometry(24, 48, 48),
		new THREE.MeshStandardMaterial({
			map: sunTexture,
			emissive: 0xff5c16,
			emissiveMap: sunTexture,
			emissiveIntensity: 3.35,
			roughness: 1,
		}),
	)
	sun.position.copy(sunLight.position)
	scene.add(sun)

	const glowCanvas = document.createElement("canvas")
	glowCanvas.width = glowCanvas.height = 128
	const glowContext = glowCanvas.getContext("2d")
	if (glowContext) {
		const glow = glowContext.createRadialGradient(64, 64, 2, 64, 64, 64)
		glow.addColorStop(0, "rgba(255,226,145,0.95)")
		glow.addColorStop(0.2, "rgba(255,155,48,0.48)")
		glow.addColorStop(1, "rgba(255,111,20,0)")
		glowContext.fillStyle = glow
		glowContext.fillRect(0, 0, 128, 128)
	}

	const sunCorona = new THREE.Sprite(
		new THREE.SpriteMaterial({
			map: new THREE.CanvasTexture(glowCanvas),
			color: 0xffc05c,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
		}),
	)

	sunCorona.scale.set(18, 18, 1)
	sun.add(sunCorona)

	dracoLoader.setDecoderPath(
		"https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
	)
	loader.setDRACOLoader(dracoLoader)

	loader.load(
		"/models/voyager.glb",
		(gltf) => {
			voyager = gltf.scene

			const box = new THREE.Box3().setFromObject(voyager)
			const center = box.getCenter(new THREE.Vector3())
			const size = box.getSize(new THREE.Vector3())

			voyager.position.sub(center)

			const maxDim = Math.max(size.x, size.y, size.z)
			if (maxDim > 0) {
				const targetScale = 4 / maxDim
				voyager.scale.set(targetScale, targetScale, targetScale)
			}

			voyager.traverse((child) => {
				if ((child as THREE_NS.Mesh).isMesh) {
					const mesh = child as THREE_NS.Mesh
					mesh.material.side = THREE.DoubleSide
				}
			})

			voyager.position.set(0, 0, 0)
			voyager.rotation.set(0.4, -0.6, 0.2)
			voyager.castShadow = true
			voyager.receiveShadow = true

			scene.add(voyager)
			setFlightProgress(flightProgress)

			renderer.render(scene, camera)

			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
		undefined,
		(error) => {
			console.error("Error al cargar el archivo GLTF:", error)
			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
	)

	loader.load(
		"/models/saturn.glb",
		(gltf) => {
			saturn = gltf.scene

			const box = new THREE.Box3().setFromObject(saturn)
			const center = box.getCenter(new THREE.Vector3())
			const size = box.getSize(new THREE.Vector3())

			saturn.position.sub(center)

			const maxDim = Math.max(size.x, size.y, size.z)
			if (maxDim > 0) {
				const targetScale = 52 / maxDim
				saturn.scale.set(targetScale, targetScale, targetScale)
			}

			saturn.traverse((child) => {
				if ((child as THREE_NS.Mesh).isMesh) {
					const mesh = child as THREE_NS.Mesh
					mesh.material.side = THREE.DoubleSide
				}
			})

			saturn.position.set(-102, -32, 184)
			saturn.rotation.set(0.8, 0.1, -0.6)
			saturn.castShadow = true
			saturn.receiveShadow = true

			scene.add(saturn)

			renderer.render(scene, camera)

			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
		undefined,
		(error) => {
			console.error("Error al cargar el archivo GLTF:", error)
			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
	)

	const earthTexture = new THREE.TextureLoader().load(
		"/models/earth-astroriah/textures/earth_texture_map_with_clouds___1k___by_co.jpg",
		() => renderer.render(scene, camera),
	)
	earthTexture.colorSpace = THREE.SRGBColorSpace
	new OBJLoader().load(
		"/models/earth-astroriah/source/Planet_Moon_starbase.obj",
		(object) => {
			earth = object
			const box = new THREE.Box3().setFromObject(object)
			const center = box.getCenter(new THREE.Vector3())
			const size = box.getSize(new THREE.Vector3())
			object.position.sub(center)

			const maxDim = Math.max(size.x, size.y, size.z)
			object.scale.setScalar(12 / maxDim)
			object.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshStandardMaterial({
						map: earthTexture,
						roughness: 0.92,
					})
					child.castShadow = true
					child.receiveShadow = true
				}
			})

			object.position.set(0, 0, -130)
			scene.add(object)
			renderer.render(scene, camera)
			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
		undefined,
		(error) => {
			console.error("Error al cargar el modelo OBJ de la Tierra:", error)
			window.dispatchEvent(new CustomEvent("hero:3d-ready"))
		},
	)

	const starCount = 1800
	const starPositions = new Float32Array(starCount * 3)

	for (let i = 0; i < starCount; i++) {
		starPositions[i * 3] = (Math.random() - 0.5) * 70
		starPositions[i * 3 + 1] = (Math.random() - 0.5) * 54
		starPositions[i * 3 + 2] = Math.random() * 230 - 160
	}

	const starsGeometry = new THREE.BufferGeometry()
	starsGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(starPositions, 3),
	)

	const stars = new THREE.Points(
		starsGeometry,
		new THREE.PointsMaterial({
			size: 0.045,
			color: 0xbbeaff,
			transparent: true,
			opacity: 0.78,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	)

	const streakCount = 320
	const streakPositions = new Float32Array(streakCount * 6)
	for (let i = 0; i < streakCount; i++) {
		const x = (Math.random() - 0.5) * 70
		const y = (Math.random() - 0.5) * 54
		const z = Math.random() * 230 - 160
		streakCenters.push([x, y, z])
		const offset = i * 6
		streakPositions[offset] = x
		streakPositions[offset + 1] = y
		streakPositions[offset + 2] = z
		streakPositions[offset + 3] = x
		streakPositions[offset + 4] = y
		streakPositions[offset + 5] = z
	}

	const streakGeometry = new THREE.BufferGeometry()
	streakGeometry.setAttribute(
		"position",
		new THREE.BufferAttribute(streakPositions, 3),
	)

	const streakLines = new THREE.LineSegments(
		streakGeometry,
		new THREE.LineBasicMaterial({
			color: 0xbbeaff,
			transparent: true,
			opacity: 0,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		}),
	)

	streakLines.visible = false
	starStreaks = streakLines
	const starfield = new THREE.Group()
	starfield.add(stars, streakLines)
	scene.add(starfield)

	// Movimiento de render 3D dependiendo del mouse del usuario xd (era obvio lol)
	let mouseX = 0

	onMouseMove = (e: MouseEvent) => {
		mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4
	}

	window.addEventListener("mousemove", onMouseMove)

	const motionReduced = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches

	const animate = () => {
		if (!motionReduced) animationFrameId = requestAnimationFrame(animate)

		starfield.rotation.z += 0.00088
		sun.rotation.y += 0.024

		if (saturn) {
			saturn.rotation.y += 0.0012
			saturn.rotation.z += 0.0009
		}

		if (earth) earth.rotation.y += 0.0016

		if (voyager) {
			voyager.rotation.y += 0.0022
			voyager.rotation.z = -mouseX * 0.12
			voyager.rotation.x += 0.0012
		}

		renderer.render(scene, camera)
	}

	animate()

	onResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	window.addEventListener("resize", onResize)
}

initScene()
document.addEventListener("astro:page-load", initScene)
