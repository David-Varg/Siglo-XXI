import assert from "node:assert/strict"
import test from "node:test"
import {
	clampCarouselValue,
	getActiveCarouselIndex,
	wrapCarouselAngle,
} from "./carouselMath.ts"

test("Ajusta un valor del carrusel en sus límites", () => {
	assert.equal(clampCarouselValue(-2, 0, 1), 0)
	assert.equal(clampCarouselValue(0.4, 0, 1), 0.4)
	assert.equal(clampCarouselValue(8, 0, 1), 1)
})

test("Ajusta los ángulos del carrusel al rango de -180 a 180", () => {
	assert.equal(wrapCarouselAngle(190), -170)
	assert.equal(wrapCarouselAngle(-190), 170)
	assert.equal(wrapCarouselAngle(720), 0)
})

test("Asocia la rotación del carrusel a un elemento activo válido", () => {
	assert.equal(getActiveCarouselIndex(0, 36, 10), 0)
	assert.equal(getActiveCarouselIndex(-72, 36, 10), 2)
	assert.equal(getActiveCarouselIndex(36, 36, 10), 9)
	assert.equal(getActiveCarouselIndex(-72, 36, 0), 0)
	assert.equal(getActiveCarouselIndex(-72, 0, 10), 0)
})
