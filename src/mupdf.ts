// Copyright (C) 2004-2023 Artifex Software, Inc.
//
// This file is part of MuPDF WASM Library.
//
// MuPDF is free software: you can redistribute it and/or modify it under the
// terms of the GNU Affero General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option)
// any later version.
//
// MuPDF is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
// details.
//
// You should have received a copy of the GNU Affero General Public License
// along with MuPDF. If not, see <https://www.gnu.org/licenses/agpl-3.0.en.html>
//
// Alternative licensing terms are available from the licensor.
// For commercial licensing, see <https://www.artifex.com/> or contact
// Artifex Software, Inc., 39 Mesa Street, Suite 108A, San Francisco,
// CA 94129, USA, for further information.

"use strict"

import libmupdf_wasm from "./mupdf-wasm.js"

const libmupdf = await libmupdf_wasm()

libmupdf._wasm_init_context()

/*
--------------------------------------------------------------------------------

How to call into WASM and convert values between JS and WASM (libmupdf) worlds:

Passing values into WASM needs to either copy primitive values into WASM memory
or passing around pointer values.

	Wrap and/or copy non-Userdata values into WASM:

		STRING(stringValue)
		STRING2(stringValue) -- if you need to pass more than one string
		MATRIX(matrixArray)
		RECT(rectArray)
		BUFFER(bufferValue)
		etc.

	Look up an enum value by string:

		ENUM<EnumType>(string, listOfValidValues)

	Pass the pointer when the value is a Userdata object:

		userdataObject.pointer

Convert WASM pointer into a JS value (for simple types like strings and matrices).

	fromType(pointer)

Wrap a WASM pointer in a new Userdata object (for complex types):

	new Wrapper(pointer)

PDFObjects are always bound to a PDFDocument, so must be accessed via a document:

	doc._fromPDFObjectNew(new_ptr)
	doc._fromPDFObjectKeep(borrowed_ptr)
	doc._PDFOBJ(value)

Type checking of input arguments at runtime.

	checkType(value, "string")
	checkType(value, Class)
	checkRect(value)
	checkMatrix(value)

	This code needs to work type safely from plain Javascript too,
	so do NOT rely on Typescript to do all the type checking.

--------------------------------------------------------------------------------
*/

type Pointer = number

type Matrix = [number, number, number, number, number, number]
type Rect = [number, number, number, number]
type Quad = [number, number, number, number, number, number, number, number]
type Point = [number, number]
type Color = [number] | [number, number, number] | [number, number, number, number]

type Rotate = 0 | 90 | 180 | 270

export const Matrix = {
	identity: [ 1, 0, 0, 1, 0, 0 ] as Matrix,
	scale(sx: number, sy: number): Matrix {
		return [ sx, 0, 0, sy, 0, 0 ]
	},
	translate(tx: number, ty: number): Matrix {
		return [ 1, 0, 0, 1, tx, ty ]
	},
	rotate(d: number): Matrix {
		while (d < 0)
			d += 360
		while (d >= 360)
			d -= 360
		let s = Math.sin((d * Math.PI) / 180)
		let c = Math.cos((d * Math.PI) / 180)
		return [ c, s, -s, c, 0, 0 ]
	},
	invert(m: Matrix): Matrix {
		checkMatrix(m)
		let det = m[0] * m[3] - m[1] * m[2]
		if (det > -1e-23 && det < 1e-23)
			return m
		let rdet = 1 / det
		let inva = m[3] * rdet
		let invb = -m[1] * rdet
		let invc = -m[2] * rdet
		let invd = m[0] * rdet
		let inve = -m[4] * inva - m[5] * invc
		let invf = -m[4] * invb - m[5] * invd
		return [ inva, invb, invc, invd, inve, invf ]
	},
	concat(one: Matrix, two: Matrix): Matrix {
		checkMatrix(one)
		checkMatrix(two)
		return [
			one[0] * two[0] + one[1] * two[2],
			one[0] * two[1] + one[1] * two[3],
			one[2] * two[0] + one[3] * two[2],
			one[2] * two[1] + one[3] * two[3],
			one[4] * two[0] + one[5] * two[2] + two[4],
			one[4] * two[1] + one[5] * two[3] + two[5],
		]
	},
}

export const Rect = {
	MIN_INF_RECT: 0x80000000,
	MAX_INF_RECT: 0x7fffff80,
	isEmpty: function (rect: Rect) {
		checkRect(rect)
		return rect[0] >= rect[2] || rect[1] >= rect[3]
	},
	isValid: function (rect: Rect) {
		checkRect(rect)
		return rect[0] <= rect[2] && rect[1] <= rect[3]
	},
	isInfinite: function (rect: Rect) {
		checkRect(rect)
		return (
			rect[0] === Rect.MIN_INF_RECT &&
			rect[1] === Rect.MIN_INF_RECT &&
			rect[2] === Rect.MAX_INF_RECT &&
			rect[3] === Rect.MAX_INF_RECT
		)
	},
	transform: function (rect: Rect, matrix: Matrix): Rect {
		checkRect(rect)
		checkMatrix(matrix)
		var t

		if (Rect.isInfinite(rect))
			return rect
		if (!Rect.isValid(rect))
			return rect

		var ax0 = rect[0] * matrix[0]
		var ax1 = rect[2] * matrix[0]
		if (ax0 > ax1)
			t = ax0, ax0 = ax1, ax1 = t

		var cy0 = rect[1] * matrix[2]
		var cy1 = rect[3] * matrix[2]
		if (cy0 > cy1)
			t = cy0, cy0 = cy1, cy1 = t

		ax0 += cy0 + matrix[4]
		ax1 += cy1 + matrix[4]

		var bx0 = rect[0] * matrix[1]
		var bx1 = rect[2] * matrix[1]
		if (bx0 > bx1)
			t = bx0, bx0 = bx1, bx1 = t

		var dy0 = rect[1] * matrix[3]
		var dy1 = rect[3] * matrix[3]
		if (dy0 > dy1)
			t = dy0, dy0 = dy1, dy1 = t

		bx0 += dy0 + matrix[5]
		bx1 += dy1 + matrix[5]

		return [ ax0, bx0, ax1, bx1 ]
	},
}

export function enableICC() {
	libmupdf._wasm_enable_icc()
}

export function disableICC() {
	libmupdf._wasm_disable_icc()
}

export function setUserCSS(text: string) {
	libmupdf._wasm_set_user_css(STRING(text))
}

/* -------------------------------------------------------------------------- */

// To pass Rect and Matrix as pointer arguments
const _wasm_int = libmupdf._wasm_malloc(4)
const _wasm_point = libmupdf._wasm_malloc(4 * 4) >> 2
const _wasm_rect = libmupdf._wasm_malloc(4 * 8) >> 2
const _wasm_matrix = libmupdf._wasm_malloc(4 * 6) >> 2
const _wasm_color = libmupdf._wasm_malloc(4 * 4) >> 2
const _wasm_quad = libmupdf._wasm_malloc(4 * 8) >> 2
const _wasm_string: [ number, number ] = [ 0, 0 ]

function checkType(value: any, type: any) {
	if (typeof type === "string" && typeof value !== type)
		throw new TypeError("expected " + type)
	if (typeof type === "function" && !(value instanceof type))
		throw new TypeError("expected " + type.name)
}

function checkPoint(value: any): asserts value is Point {
	if (!Array.isArray(value) || value.length !== 2)
		throw new TypeError("expected point")
}

function checkRect(value: any): asserts value is Rect {
	if (!Array.isArray(value) || value.length !== 4)
		throw new TypeError("expected rectangle")
}

function checkMatrix(value: any): asserts value is Matrix {
	if (!Array.isArray(value) || value.length !== 6)
		throw new TypeError("expected matrix")
}

function checkQuad(value: any): asserts value is Quad {
	if (!Array.isArray(value) || value.length !== 8)
		throw new TypeError("expected quad")
}

function checkColor(value: any): asserts value is Color {
	if (!Array.isArray(value) || (value.length !== 1 && value.length !== 3 && value.length !== 4))
		throw new TypeError("expected color array")
}

/** The types that can be automatically converted into a Buffer object */
type AnyBuffer = Buffer | ArrayBuffer | Uint8Array | string

function BUFFER(input: AnyBuffer) {
	if (input instanceof Buffer)
		return input.pointer
	if (input instanceof ArrayBuffer || input instanceof Uint8Array)
		return new Buffer(input).pointer
	if (typeof input === "string")
		return new Buffer(input).pointer
	throw new TypeError("expected buffer")
}

function ENUM<T>(value: T, list: readonly T[]): number {
	if (typeof value === "number") {
		if (value >= 0 && value < list.length)
			return value
	}
	if (typeof value === "string") {
		let idx = list.indexOf(value)
		if (idx >= 0)
			return idx
	}
	throw new TypeError(`invalid enum value ("${value}"; expected ${list.join(", ")})`)
}

function allocateUTF8(str: string) {
	var size = libmupdf.lengthBytesUTF8(str) + 1
	var pointer = libmupdf._wasm_malloc(size)
	libmupdf.stringToUTF8(str, pointer, size)
	return pointer
}

function STRING_N(s: string, i: number) {
	if (_wasm_string[i]) {
		libmupdf._wasm_free(_wasm_string[i] as number)
		_wasm_string[i] = 0
	}
	return _wasm_string[i] = allocateUTF8(s)
}

function STRING(s: string) {
	return STRING_N(s, 0)
}

function STRING2(s: string) {
	return STRING_N(s, 1)
}

function STRING_OPT(s?: string) {
	return typeof s === "string" ? STRING_N(s, 0) : 0
}

function STRING2_OPT(s?: string) {
	return typeof s === "string" ? STRING_N(s, 1) : 0
}

function POINT(p: Point) {
	libmupdf.HEAPF32[_wasm_point + 0] = p[0]
	libmupdf.HEAPF32[_wasm_point + 1] = p[1]
	return _wasm_point << 2
}

function POINT2(p: Point) {
	libmupdf.HEAPF32[_wasm_point + 2] = p[0]
	libmupdf.HEAPF32[_wasm_point + 3] = p[1]
	return (_wasm_point + 2) << 2
}

function RECT(r: Rect) {
	libmupdf.HEAPF32[_wasm_rect + 0] = r[0]
	libmupdf.HEAPF32[_wasm_rect + 1] = r[1]
	libmupdf.HEAPF32[_wasm_rect + 2] = r[2]
	libmupdf.HEAPF32[_wasm_rect + 3] = r[3]
	return _wasm_rect << 2
}

function RECT2(r: Rect) {
	libmupdf.HEAPF32[_wasm_rect + 4] = r[0]
	libmupdf.HEAPF32[_wasm_rect + 5] = r[1]
	libmupdf.HEAPF32[_wasm_rect + 6] = r[2]
	libmupdf.HEAPF32[_wasm_rect + 7] = r[3]
	return (_wasm_rect + 4) << 2
}

function MATRIX(m: Matrix) {
	libmupdf.HEAPF32[_wasm_matrix + 0] = m[0]
	libmupdf.HEAPF32[_wasm_matrix + 1] = m[1]
	libmupdf.HEAPF32[_wasm_matrix + 2] = m[2]
	libmupdf.HEAPF32[_wasm_matrix + 3] = m[3]
	libmupdf.HEAPF32[_wasm_matrix + 4] = m[4]
	libmupdf.HEAPF32[_wasm_matrix + 5] = m[5]
	return _wasm_matrix << 2
}

function QUAD(q: Quad) {
	libmupdf.HEAPF32[_wasm_quad + 0] = q[0]
	libmupdf.HEAPF32[_wasm_quad + 1] = q[1]
	libmupdf.HEAPF32[_wasm_quad + 2] = q[2]
	libmupdf.HEAPF32[_wasm_quad + 3] = q[3]
	libmupdf.HEAPF32[_wasm_quad + 4] = q[4]
	libmupdf.HEAPF32[_wasm_quad + 5] = q[5]
	libmupdf.HEAPF32[_wasm_quad + 6] = q[6]
	libmupdf.HEAPF32[_wasm_quad + 7] = q[7]
	return _wasm_quad << 2
}

function COLOR(c?: Color) {
	if (typeof c !== "undefined") {
		switch (c.length) {
		case 1:
			libmupdf.HEAPF32[_wasm_color + 0] = c[0]
			break
		case 3:
			libmupdf.HEAPF32[_wasm_color + 0] = c[0]
			libmupdf.HEAPF32[_wasm_color + 1] = c[1]
			libmupdf.HEAPF32[_wasm_color + 2] = c[2]
			break
		case 4:
			libmupdf.HEAPF32[_wasm_color + 0] = c[0]
			libmupdf.HEAPF32[_wasm_color + 1] = c[1]
			libmupdf.HEAPF32[_wasm_color + 2] = c[2]
			libmupdf.HEAPF32[_wasm_color + 3] = c[3]
			break
		}
	}
	return _wasm_color << 2
}

/* -------------------------------------------------------------------------- */

function fromColor(n: number): Color {
	if (n === 1)
		return [
			libmupdf.HEAPF32[_wasm_color] as number
		]
	if (n === 3)
		return [
			libmupdf.HEAPF32[_wasm_color + 0] as number,
			libmupdf.HEAPF32[_wasm_color + 1] as number,
			libmupdf.HEAPF32[_wasm_color + 2] as number,
		]
	if (n === 4)
		return [
			libmupdf.HEAPF32[_wasm_color + 0] as number,
			libmupdf.HEAPF32[_wasm_color + 1] as number,
			libmupdf.HEAPF32[_wasm_color + 2] as number,
			libmupdf.HEAPF32[_wasm_color + 3] as number,
		]
	throw new TypeError("invalid number of components for Color: " + n)
}

function fromString(ptr: Pointer): string {
	return libmupdf.UTF8ToString(ptr)
}

function fromStringFree(ptr: Pointer): string {
	let str = libmupdf.UTF8ToString(ptr)
	libmupdf._wasm_free(ptr)
	return str
}

function fromPoint(ptr: Pointer): Point {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0] as number,
		libmupdf.HEAPF32[ptr + 1] as number,
	]
}

function fromRect(ptr: Pointer): Rect {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0] as number,
		libmupdf.HEAPF32[ptr + 1] as number,
		libmupdf.HEAPF32[ptr + 2] as number,
		libmupdf.HEAPF32[ptr + 3] as number,
	]
}

function fromMatrix(ptr: Pointer): Matrix {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0] as number,
		libmupdf.HEAPF32[ptr + 1] as number,
		libmupdf.HEAPF32[ptr + 2] as number,
		libmupdf.HEAPF32[ptr + 3] as number,
		libmupdf.HEAPF32[ptr + 4] as number,
		libmupdf.HEAPF32[ptr + 5] as number,
	]
}

function fromQuad(ptr: Pointer): Quad {
	ptr = ptr >> 2
	return [
		libmupdf.HEAPF32[ptr + 0] as number,
		libmupdf.HEAPF32[ptr + 1] as number,
		libmupdf.HEAPF32[ptr + 2] as number,
		libmupdf.HEAPF32[ptr + 3] as number,
		libmupdf.HEAPF32[ptr + 4] as number,
		libmupdf.HEAPF32[ptr + 5] as number,
		libmupdf.HEAPF32[ptr + 6] as number,
		libmupdf.HEAPF32[ptr + 7] as number,
	]
}

function fromBuffer(ptr: Pointer): Uint8Array {
	let data = libmupdf._wasm_buffer_get_data(ptr)
	let size = libmupdf._wasm_buffer_get_len(ptr)
	return libmupdf.HEAPU8.slice(data, data + size)
}

/* -------------------------------------------------------------------------- */

type SearchFunction = (...args:number[]) => number

function runSearch(searchFun: SearchFunction, searchThis: number, needle: string, max_hits = 500) {
	checkType(needle, "string")
	let hits = 0
	let marks = 0
	try {
		hits = libmupdf._wasm_malloc(32 * max_hits)
		marks = libmupdf._wasm_malloc(4 * max_hits)
		let n = searchFun(searchThis, STRING(needle), marks, hits, max_hits)
		let outer: Quad[][] = []
		if (n > 0) {
			let inner: Quad[] = []
			for (let i = 0; i < n; ++i) {
				let mark = libmupdf.HEAP32[(marks>>2) + i]
				let quad = fromQuad(hits + i * 32)
				if (i > 0 && mark) {
					outer.push(inner)
					inner = []
				}
				inner.push(quad)
			}
			outer.push(inner)
		}
		return outer
	} finally {
		libmupdf._wasm_free(marks)
		libmupdf._wasm_free(hits)
	}
}

/* -------------------------------------------------------------------------- */

abstract class Userdata {
	private static _finalizer: FinalizationRegistry<number>

	static readonly _drop: (pointer: Pointer) => void

	pointer: Pointer

	constructor(pointer: Pointer) {
		if (typeof pointer !== "number")
			throw new Error("invalid pointer: " + typeof pointer)
		if (pointer !== 0) {
			let ctor = this.constructor as typeof Userdata
			if (!ctor._finalizer)
				ctor._finalizer = new FinalizationRegistry(ctor._drop)
			ctor._finalizer.register(this, pointer, this)
		}
		this.pointer = pointer
	}

	destroy() {
		if (this.pointer !== 0) {
			let ctor = this.constructor as typeof Userdata
			ctor._finalizer.unregister(this)
			ctor._drop(this.pointer)
		}
		this.pointer = 0
	}

	// Custom "console.log" formatting for Node
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return this.toString()
	}

	toString() {
		return `[${this.constructor.name} ${this.pointer}]`
	}

	valueOf() {
		throw new Error("cannot convert Userdata to Javascript value")
	}
}

export class Buffer extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_buffer

	/** New empty Buffer. */
	constructor()

	/** New Buffer initialized with string contents as UTF-8. */
	constructor(data: string)

	/** New Buffer initialized with typed array contents. */
	constructor(data: ArrayBuffer | Uint8Array)

	/** PRIVATE */
	constructor(pointer: Pointer)

	constructor(arg?: Pointer | string | ArrayBuffer | Uint8Array) {
		if (typeof arg === "undefined")
			super(libmupdf._wasm_new_buffer(1024))

		else if (typeof arg === "number")
			super(arg)

		else if (typeof arg === "string") {
			let data_len = libmupdf.lengthBytesUTF8(arg)
			let data_ptr = libmupdf._wasm_malloc(data_len + 1)
			libmupdf.stringToUTF8(arg, data_ptr, data_len + 1)
			super(libmupdf._wasm_new_buffer_from_data(data_ptr, data_len))
		}

		else if (arg instanceof ArrayBuffer || arg instanceof Uint8Array) {
			let data_len = arg.byteLength
			let data_ptr = libmupdf._wasm_malloc(data_len)
			libmupdf.HEAPU8.set(new Uint8Array(arg), data_ptr)
			super(libmupdf._wasm_new_buffer_from_data(data_ptr, data_len))
		}
	}

	getLength() {
		return libmupdf._wasm_buffer_get_len(this.pointer)
	}

	readByte(at: number) {
		let data = libmupdf._wasm_buffer_get_data(this.pointer)
		return libmupdf.HEAPU8[data + at] as number
	}

	write(s: string) {
		libmupdf._wasm_append_string(this.pointer, STRING(s))
	}

	writeByte(b: number) {
		libmupdf._wasm_append_byte(this.pointer, b)
	}

	writeLine(s: string) {
		this.write(s)
		this.writeByte(10)
	}

	writeBuffer(other: AnyBuffer) {
		libmupdf._wasm_append_buffer(this.pointer, BUFFER(other))
	}

	asUint8Array() {
		let data = libmupdf._wasm_buffer_get_data(this.pointer)
		let size = libmupdf._wasm_buffer_get_len(this.pointer)
		return libmupdf.HEAPU8.subarray(data, data + size)
	}

	slice(start: number, end: number) {
		return new Buffer(libmupdf._wasm_slice_buffer(this.pointer, start, end))
	}

	asString() {
		return fromString(libmupdf._wasm_string_from_buffer(this.pointer))
	}
}

type ColorSpaceType =
	"None" |
	"Gray" |
	"RGB" |
	"BGR" |
	"CMYK" |
	"Lab" |
	"Indexed" |
	"Separation"

export class ColorSpace extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_colorspace

	static readonly COLORSPACE_TYPES: ColorSpaceType[] = [
		"None",
		"Gray",
		"RGB",
		"BGR",
		"CMYK",
		"Lab",
		"Indexed",
		"Separation"
	]

	// Create ColorSpace from ICC profile.
	constructor(profile: AnyBuffer, name: string)

	// PRIVATE
	constructor(pointer: Pointer)

	constructor(from: Pointer | AnyBuffer, name?: string) {
		if (typeof from === "number")
			super(from)
		else
			super(libmupdf._wasm_new_icc_colorspace(STRING_OPT(name), BUFFER(from)))
	}

	getName() {
		return fromString(libmupdf._wasm_colorspace_get_name(this.pointer))
	}

	getType() {
		return ColorSpace.COLORSPACE_TYPES[libmupdf._wasm_colorspace_get_type(this.pointer)] || "None"
	}

	getNumberOfComponents() {
		return libmupdf._wasm_colorspace_get_n(this.pointer)
	}

	isGray(): boolean { return this.getType() === "Gray" }
	isRGB(): boolean { return this.getType() === "RGB" }
	isCMYK(): boolean { return this.getType() === "CMYK" }
	isIndexed(): boolean { return this.getType() === "Indexed" }
	isLab(): boolean { return this.getType() === "Lab" }
	isDeviceN(): boolean { return this.getType() === "Separation" }
	isSubtractive(): boolean { return this.getType() === "CMYK" || this.getType() === "Separation" }

	override toString() {
		return "[ColorSpace " + this.getName() + "]"
	}

	static readonly DeviceGray = new ColorSpace(libmupdf._wasm_device_gray())
	static readonly DeviceRGB = new ColorSpace(libmupdf._wasm_device_rgb())
	static readonly DeviceBGR = new ColorSpace(libmupdf._wasm_device_bgr())
	static readonly DeviceCMYK = new ColorSpace(libmupdf._wasm_device_cmyk())
	static readonly Lab = new ColorSpace(libmupdf._wasm_device_lab())
}

type FontSimpleEncoding = "Latin" | "Greek" | "Cyrillic"

type FontCJKOrdering = 0 | 1 | 2 | 3

type FontCJKLanguage =
	"Adobe-CNS1" |
	"Adobe-GB1" |
	"Adobe-Japan1" |
	"Adobe-Korea1" |
	"zh-Hant" |
	"zh-TW" |
	"zh-HK" |
	"zh-Hans" |
	"zh-CN" |
	"ja" |
	"ko"

export class Font extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_font

	static readonly SIMPLE_ENCODING: FontSimpleEncoding[] = [
		"Latin",
		"Greek",
		"Cyrillic"
	]

	static readonly ADOBE_CNS = 0
	static readonly ADOBE_GB = 1
	static readonly ADOBE_JAPAN = 2
	static readonly ADOBE_KOREA = 3

	static readonly CJK_ORDERING_BY_LANG: Record<FontCJKLanguage,FontCJKOrdering> = {
		"Adobe-CNS1": 0,
		"Adobe-GB1": 1,
		"Adobe-Japan1": 2,
		"Adobe-Korea1": 3,
		"zh-Hant": 0,
		"zh-TW": 0,
		"zh-HK": 0,
		"zh-Hans": 1,
		"zh-CN": 1,
		"ja": 2,
		"ko": 3,
	}

	// Create new Font from a font file.
	constructor(name: string, data: AnyBuffer, subfont: number)

	// PRIVATE
	constructor(pointer: Pointer)

	constructor(name_or_pointer: Pointer | string, data?: AnyBuffer, subfont=0) {
		let pointer = 0
		if (typeof name_or_pointer === "number") {
			pointer = libmupdf._wasm_keep_font(name_or_pointer)
		} else {
			if (data)
				pointer = libmupdf._wasm_new_font_from_buffer(STRING(name_or_pointer), BUFFER(data), subfont)
			else
				pointer = libmupdf._wasm_new_base14_font(STRING(name_or_pointer))
		}
		super(pointer)
	}

	getName() {
		return fromString(libmupdf._wasm_font_get_name(this.pointer))
	}

	encodeCharacter(uni: number | string) {
		if (typeof uni === "string")
			uni = uni.charCodeAt(0)
		return libmupdf._wasm_encode_character(this.pointer, uni)
	}

	advanceGlyph(gid: number, wmode = 0) {
		return libmupdf._wasm_advance_glyph(this.pointer, gid, wmode)
	}

	isMono() {
		return !!libmupdf._wasm_font_is_monospaced(this.pointer)
	}

	isSerif() {
		return !!libmupdf._wasm_font_is_serif(this.pointer)
	}

	isBold() {
		return !!libmupdf._wasm_font_is_bold(this.pointer)
	}

	isItalic() {
		return !!libmupdf._wasm_font_is_italic(this.pointer)
	}
}

export class Image extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_image

	constructor(pointer: Pointer)
	constructor(data: AnyBuffer)
	constructor(pixmap: Pixmap, colorspace: ColorSpace)

	constructor(arg1: Pointer | Pixmap | AnyBuffer, arg2?: ColorSpace) {
		let pointer = 0
		if (typeof arg1 === "number")
			pointer = libmupdf._wasm_keep_image(arg1)
		else if (arg1 instanceof Pixmap)
			pointer = libmupdf._wasm_new_image_from_pixmap(arg1.pointer, arg2 ? arg2.pointer : 0)
		else
			pointer = libmupdf._wasm_new_image_from_buffer(BUFFER(arg1))
		super(pointer)
	}

	getWidth() {
		return libmupdf._wasm_image_get_w(this.pointer)
	}

	getHeight() {
		return libmupdf._wasm_image_get_h(this.pointer)
	}

	getNumberOfComponents() {
		return libmupdf._wasm_image_get_n(this.pointer)
	}

	getBitsPerComponent() {
		return libmupdf._wasm_image_get_bpc(this.pointer)
	}

	getXResolution() {
		return libmupdf._wasm_image_get_xres(this.pointer)
	}

	getYResolution() {
		return libmupdf._wasm_image_get_yres(this.pointer)
	}

	getImageMask() {
		return !!libmupdf._wasm_image_get_imagemask(this.pointer)
	}

	getColorSpace() {
		let cs = libmupdf._wasm_image_get_colorspace(this.pointer)
		if (cs)
			return new ColorSpace(libmupdf._wasm_keep_colorspace(cs))
		return null
	}

	getMask() {
		let mask = libmupdf._wasm_image_get_mask(this.pointer)
		if (mask)
			return new Image(libmupdf._wasm_keep_image(mask))
		return null
	}

	toPixmap() {
		return new Pixmap(libmupdf._wasm_get_pixmap_from_image(this.pointer))
	}
}

type LineCap = "Butt" | "Round" | "Square" | "Triangle"
type LineJoin = "Miter" | "Round" | "Bevel" | "MiterXPS"

// TODO: convert StrokeState from plain JS object to match mutool run ffi_pushstroke/ffi_tostroke

export class StrokeState extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_stroke_state

	static readonly LINE_CAP: LineCap[] = [
		"Butt",
		"Round",
		"Square",
		"Triangle"
	]

	static readonly LINE_JOIN: LineJoin[] = [
		"Miter",
		"Round",
		"Bevel",
		"MiterXPS"
	]

	constructor(pointer?: Pointer) {
		if (typeof pointer === "number")
			super(pointer)
		else
			super(libmupdf._wasm_new_stroke_state())
	}

	getLineCap() {
		return libmupdf._wasm_stroke_state_get_start_cap(this.pointer)
	}

	setLineCap(j: LineCap) {
		let jj = ENUM<LineCap>(j, StrokeState.LINE_CAP)
		libmupdf._wasm_stroke_state_set_start_cap(this.pointer, jj)
		libmupdf._wasm_stroke_state_set_dash_cap(this.pointer, jj)
		libmupdf._wasm_stroke_state_set_end_cap(this.pointer, jj)
	}

	getLineJoin() {
		return libmupdf._wasm_stroke_state_get_linejoin(this.pointer)
	}

	setLineJoin(j: LineJoin) {
		let jj = ENUM<LineJoin>(j, StrokeState.LINE_JOIN)
		libmupdf._wasm_stroke_state_set_linejoin(this.pointer, jj)
	}

	getLineWidth() {
		return libmupdf._wasm_stroke_state_get_linewidth(this.pointer)
	}

	setLineWidth(w: number) {
		libmupdf._wasm_stroke_state_set_linewidth(this.pointer, w)
	}

	getMiterLimit() {
		return libmupdf._wasm_stroke_state_get_miterlimit(this.pointer)
	}

	setMiterLimit(m: number) {
		libmupdf._wasm_stroke_state_set_miterlimit(this.pointer, m)
	}

	// TODO: dashes
}

export class Path extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_path

	constructor(pointer?: Pointer) {
		if (typeof pointer === "number")
			super(pointer)
		else
			super(libmupdf._wasm_new_path())
	}

	getBounds(strokeState: StrokeState, transform: Matrix) {
		if (strokeState !== null)
			checkType(strokeState, StrokeState)
		checkMatrix(transform)
		return fromRect(libmupdf._wasm_bound_path(this.pointer, strokeState?.pointer, MATRIX(transform)))
	}

	moveTo(x: number, y: number) {
		checkType(x, "number")
		checkType(y, "number")
		libmupdf._wasm_moveto(this.pointer, x, y)
	}

	lineTo(x: number, y: number) {
		checkType(x, "number")
		checkType(y, "number")
		libmupdf._wasm_lineto(this.pointer, x, y)
	}

	curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
		libmupdf._wasm_curveto(this.pointer, x1, y1, x2, y2, x3, y3)
	}

	curveToV(cx: number, cy: number, ex: number, ey: number) {
		libmupdf._wasm_curvetov(this.pointer, cx, cy, ex, ey)
	}

	curveToY(cx: number, cy: number, ex: number, ey: number) {
		libmupdf._wasm_curvetoy(this.pointer, cx, cy, ex, ey)
	}

	closePath() {
		libmupdf._wasm_closepath(this.pointer)
	}

	rect(x1: number, y1: number, x2: number, y2: number) {
		libmupdf._wasm_rectto(this.pointer, x1, y1, x2, y2)
	}

	transform(matrix: Matrix) {
		checkMatrix(matrix)
		libmupdf._wasm_transform_path(this.pointer, MATRIX(matrix))
	}

	walk(_walker: any) {
		throw "TODO"
	}
}

export class Text extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_text

	constructor(pointer?: Pointer) {
		if (typeof pointer === "number")
			super(pointer)
		else
			super(libmupdf._wasm_new_text())
	}

	getBounds(strokeState: StrokeState, transform: Matrix) {
		if (strokeState !== null)
			checkType(strokeState, StrokeState)
		checkMatrix(transform)
		return fromRect(libmupdf._wasm_bound_text(this.pointer, strokeState?.pointer, MATRIX(transform)))
	}

	showGlyph(font: Font, trm: Matrix, gid: number, uni: number, wmode = 0) {
		checkType(font, Font)
		checkMatrix(trm)
		checkType(gid, "number")
		checkType(uni, "number")
		libmupdf._wasm_show_glyph(
			this.pointer,
			font.pointer,
			MATRIX(trm),
			gid,
			uni,
			wmode
		)
	}

	showString(font: Font, trm: Matrix, str: string, wmode = 0) {
		checkType(font, Font)
		checkMatrix(trm)
		checkType(str, "string")
		return fromMatrix(
			libmupdf._wasm_show_string(
				this.pointer,
				font.pointer,
				MATRIX(trm),
				STRING(str),
				wmode
			)
		)
	}

	walk(_walker: any) {
		throw "TODO"
	}
}

export class DisplayList extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_display_list

	constructor(pointer: Pointer)
	constructor(mediabox: Rect)

	constructor(arg1: Pointer | Rect) {
		let pointer = 0
		if (typeof arg1 === "number") {
			pointer = arg1
		} else {
			checkRect(arg1)
			pointer = libmupdf._wasm_new_display_list(RECT(arg1))
		}
		super(pointer)
	}

	getBounds() {
		return fromRect(libmupdf._wasm_bound_display_list(this.pointer))
	}

	toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false) {
		checkMatrix(matrix)
		checkType(colorspace, ColorSpace)
		return new Pixmap(
			libmupdf._wasm_new_pixmap_from_display_list(
				this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha
			)
		)
	}

	toStructuredText(options = "") {
		checkType(options, "string")
		return new StructuredText(libmupdf._wasm_new_stext_page_from_display_list(this.pointer, STRING(options)))
	}

	run(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_run_display_list(this.pointer, device.pointer, MATRIX(matrix))
	}

	search(needle: string, max_hits = 500) {
		return runSearch(libmupdf._wasm_search_display_list, this.pointer, needle, max_hits)
	}
}

export class Pixmap extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_pixmap

	constructor(pointer: Pointer)
	constructor(colorspace: ColorSpace, bbox: Rect, alpha: boolean)

	constructor(arg1: Pointer | ColorSpace, bbox?: Rect, alpha = false) {
		if (typeof arg1 === "number") {
			super(arg1)
		}
		if (arg1 instanceof ColorSpace) {
			checkRect(bbox)
			super(libmupdf._wasm_new_pixmap_with_bbox(arg1.pointer, RECT(bbox), alpha))
		}
		if (arg1 === null) {
			checkRect(bbox)
			super(libmupdf._wasm_new_pixmap_with_bbox(0, RECT(bbox), alpha))
		}
	}

	getBounds() {
		let x = libmupdf._wasm_pixmap_get_x(this.pointer)
		let y = libmupdf._wasm_pixmap_get_y(this.pointer)
		let w = libmupdf._wasm_pixmap_get_w(this.pointer)
		let h = libmupdf._wasm_pixmap_get_h(this.pointer)
		return [ x, y, x + w, y + h ]
	}

	clear(value?: number) {
		if (typeof value === "undefined")
			libmupdf._wasm_clear_pixmap(this.pointer)
		else
			libmupdf._wasm_clear_pixmap_with_value(this.pointer, value)
	}

	getWidth() {
		return libmupdf._wasm_pixmap_get_w(this.pointer)
	}
	getHeight() {
		return libmupdf._wasm_pixmap_get_h(this.pointer)
	}
	getX() {
		return libmupdf._wasm_pixmap_get_x(this.pointer)
	}
	getY() {
		return libmupdf._wasm_pixmap_get_y(this.pointer)
	}
	getStride() {
		return libmupdf._wasm_pixmap_get_stride(this.pointer)
	}
	getNumberOfComponents() {
		return libmupdf._wasm_pixmap_get_n(this.pointer)
	}
	getAlpha() {
		return libmupdf._wasm_pixmap_get_alpha(this.pointer)
	}
	getXResolution() {
		return libmupdf._wasm_pixmap_get_xres(this.pointer)
	}
	getYResolution() {
		return libmupdf._wasm_pixmap_get_yres(this.pointer)
	}

	setResolution(x: number, y: number) {
		libmupdf._wasm_pixmap_set_xres(this.pointer, x)
		libmupdf._wasm_pixmap_set_yres(this.pointer, y)
	}

	getColorSpace() {
		let cs = libmupdf._wasm_pixmap_get_colorspace(this.pointer)
		if (cs)
			return new ColorSpace(libmupdf._wasm_keep_colorspace(cs))
		return null
	}

	getPixels() {
		let s = libmupdf._wasm_pixmap_get_stride(this.pointer)
		let h = libmupdf._wasm_pixmap_get_h(this.pointer)
		let p = libmupdf._wasm_pixmap_get_samples(this.pointer)
		return new Uint8ClampedArray(libmupdf.HEAPU8.buffer, p, s * h)
	}

	asPNG() {
		let buf = libmupdf._wasm_new_buffer_from_pixmap_as_png(this.pointer)
		try {
			return fromBuffer(buf)
		} finally {
			libmupdf._wasm_drop_buffer(buf)
		}
	}

	asPSD() {
		let buf = libmupdf._wasm_new_buffer_from_pixmap_as_psd(this.pointer)
		try {
			return fromBuffer(buf)
		} finally {
			libmupdf._wasm_drop_buffer(buf)
		}
	}

	asPAM() {
		let buf = libmupdf._wasm_new_buffer_from_pixmap_as_pam(this.pointer)
		try {
			return fromBuffer(buf)
		} finally {
			libmupdf._wasm_drop_buffer(buf)
		}
	}

	asJPEG(quality: number, invert_cmyk: boolean) {
		let buf = libmupdf._wasm_new_buffer_from_pixmap_as_jpeg(this.pointer, quality, invert_cmyk)
		try {
			return fromBuffer(buf)
		} finally {
			libmupdf._wasm_drop_buffer(buf)
		}
	}

	invert() {
		libmupdf._wasm_invert_pixmap(this.pointer)
	}

	invertLuminance() {
		libmupdf._wasm_invert_pixmap_luminance(this.pointer)
	}

	gamma(p: number) {
		libmupdf._wasm_gamma_pixmap(this.pointer, p)
	}

	tint(black: number | Color, white: number | Color) {
		let black_hex = 0x000000
		let white_hex = 0xffffff
		if (typeof black === "number")
			black_hex = black
		else if (black instanceof Array && black.length === 3)
			black_hex = ( ( (black[0] * 255) << 16 ) | ( (black[1] * 255) << 8 ) | ( (black[2] * 255) ) )
		if (typeof white === "number")
			white_hex = white
		else if (white instanceof Array && white.length === 3)
			white = ( ( (white[0] * 255) << 16 ) | ( (white[1] * 255) << 8 ) | ( (white[2] * 255) ) )
		libmupdf._wasm_tint_pixmap(this.pointer, black_hex, white_hex)
	}

	convertToColorSpace(colorspace: ColorSpace, keepAlpha=false) {
		checkType(colorspace, ColorSpace)
		checkType(keepAlpha, "boolean")
		return new Pixmap(libmupdf._wasm_convert_pixmap(this.pointer, colorspace.pointer, keepAlpha))
	}

	warp(points: Point[], width: number, height: number) {
		let quad = points.flat()
		checkQuad(quad)
		checkType(width, "number")
		checkType(height, "number")
		return new Pixmap(libmupdf._wasm_warp_pixmap(this.pointer, QUAD(quad), width, height))
	}
}

export class Shade extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_shade
	getBounds() {
		return fromRect(libmupdf._wasm_bound_shade(this.pointer))
	}
}

interface StructuredTextWalker {
	onImageBlock?(bbox: Rect, transform: Matrix, image: Image): void
	beginTextBlock?(bbox: Rect): void
	beginLine?(bbox: Rect, wmode: number, direction: Point): void
	onChar?(c: string, origin: Point, font: Font, size: number, quad: Quad): void
	endLine?(): void
	endTextBlock?(): void
}

export class StructuredText extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_stext_page

	static readonly SELECT_CHARS = 0
	static readonly SELECT_WORDS = 1
	static readonly SELECT_LINES = 2

	walk(walker: StructuredTextWalker) {
		let block = libmupdf._wasm_stext_page_get_first_block(this.pointer)
		while (block) {
			let block_type = libmupdf._wasm_stext_block_get_type(block)
			let block_bbox = fromRect(libmupdf._wasm_stext_block_get_bbox(block))

			if (block_type === 1) {
				if (walker.onImageBlock) {
					let matrix = fromMatrix(libmupdf._wasm_stext_block_get_transform(block))
					let image = new Image(libmupdf._wasm_stext_block_get_image(block))
					walker.onImageBlock(block_bbox, matrix, image)
				}
			} else {
				if (walker.beginTextBlock)
					walker.beginTextBlock(block_bbox)

				let line = libmupdf._wasm_stext_block_get_first_line(block)
				while (line) {
					let line_bbox = fromRect(libmupdf._wasm_stext_line_get_bbox(line))
					let line_wmode = libmupdf._wasm_stext_line_get_wmode(line)
					let line_dir = fromPoint(libmupdf._wasm_stext_line_get_dir(line))

					if (walker.beginLine)
						walker.beginLine(line_bbox, line_wmode, line_dir)

					if (walker.onChar) {
						let ch = libmupdf._wasm_stext_line_get_first_char(line)
						while (ch) {
							let ch_rune = String.fromCharCode(libmupdf._wasm_stext_char_get_c(ch))
							let ch_origin = fromPoint(libmupdf._wasm_stext_char_get_origin(ch))
							let ch_font = new Font(libmupdf._wasm_stext_char_get_font(ch))
							let ch_size = libmupdf._wasm_stext_char_get_size(ch)
							let ch_quad = fromQuad(libmupdf._wasm_stext_char_get_quad(ch))

							walker.onChar(ch_rune, ch_origin, ch_font, ch_size, ch_quad)

							ch = libmupdf._wasm_stext_char_get_next(ch)
						}
					}

					if (walker.endLine)
						walker.endLine()

					line = libmupdf._wasm_stext_line_get_next(line)
				}

				if (walker.endTextBlock)
					walker.endTextBlock()
			}

			block = libmupdf._wasm_stext_block_get_next(block)
		}
	}

	asJSON(scale = 1) {
		return fromStringFree(libmupdf._wasm_print_stext_page_as_json(this.pointer, scale))
	}

	// TODO: highlight(a, b) -> quad[]
	// TODO: copy(a, b) -> string

	search(needle: string, max_hits = 500) {
		return runSearch(libmupdf._wasm_search_stext_page, this.pointer, needle, max_hits)
	}
}

type BlendMode =
	"Normal" |
	"Multiply" |
	"Screen" |
	"Overlay" |
	"Darken" |
	"Lighten" |
	"ColorDodge" |
	"ColorBurn" |
	"HardLight" |
	"SoftLight" |
	"Difference" |
	"Exclusion" |
	"Hue" |
	"Saturation" |
	"Color" |
	"Luminosity"

export class Device extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_device

	static readonly BLEND_MODES: BlendMode[] = [
		"Normal",
		"Multiply",
		"Screen",
		"Overlay",
		"Darken",
		"Lighten",
		"ColorDodge",
		"ColorBurn",
		"HardLight",
		"SoftLight",
		"Difference",
		"Exclusion",
		"Hue",
		"Saturation",
		"Color",
		"Luminosity",
	]

	fillPath(path: Path, evenOdd: boolean, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number) {
		checkType(path, Path)
		checkMatrix(ctm)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_fill_path(this.pointer, path.pointer, evenOdd, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha)
	}

	strokePath(path: Path, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number) {
		checkType(path, Path)
		checkType(stroke, StrokeState)
		checkMatrix(ctm)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_stroke_path(
			this.pointer,
			path.pointer,
			stroke.pointer,
			MATRIX(ctm),
			colorspace.pointer,
			COLOR(color),
			alpha
		)
	}

	clipPath(path: Path, evenOdd: boolean, ctm: Matrix) {
		checkType(path, Path)
		checkMatrix(ctm)
		libmupdf._wasm_clip_path(this.pointer, path.pointer, evenOdd, MATRIX(ctm))
	}

	clipStrokePath(path: Path, stroke: StrokeState, ctm: Matrix) {
		checkType(path, Path)
		checkType(stroke, StrokeState)
		checkMatrix(ctm)
		libmupdf._wasm_clip_stroke_path(this.pointer, path.pointer, stroke.pointer, MATRIX(ctm))
	}

	fillText(text: Text, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number) {
		checkType(text, Text)
		checkMatrix(ctm)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_fill_text(this.pointer, text.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha)
	}

	strokeText(text: Text, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number) {
		checkType(text, Text)
		checkType(stroke, StrokeState)
		checkMatrix(ctm)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_stroke_text(
			this.pointer,
			text.pointer,
			stroke.pointer,
			MATRIX(ctm),
			colorspace.pointer,
			COLOR(color),
			alpha
		)
	}

	clipText(text: Text, ctm: Matrix) {
		checkType(text, Text)
		checkMatrix(ctm)
		libmupdf._wasm_clip_text(this.pointer, text.pointer, MATRIX(ctm))
	}

	clipStrokeText(text: Text, stroke: StrokeState, ctm: Matrix) {
		checkType(text, Text)
		checkType(stroke, StrokeState)
		checkMatrix(ctm)
		libmupdf._wasm_clip_stroke_text(this.pointer, text.pointer, stroke.pointer, MATRIX(ctm))
	}

	ignoreText(text: Text, ctm: Matrix) {
		checkType(text, Text)
		checkMatrix(ctm)
		libmupdf._wasm_ignore_text(this.pointer, text.pointer, MATRIX(ctm))
	}

	fillShade(shade: Shade, ctm: Matrix, alpha: number) {
		checkType(shade, Shade)
		checkMatrix(ctm)
		libmupdf._wasm_fill_shade(this.pointer, shade.pointer, MATRIX(ctm), alpha)
	}

	fillImage(image: Image, ctm: Matrix, alpha: number) {
		checkType(image, Image)
		checkMatrix(ctm)
		libmupdf._wasm_fill_image(this.pointer, image.pointer, MATRIX(ctm), alpha)
	}

	fillImageMask(image: Image, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number) {
		checkType(image, Image)
		checkMatrix(ctm)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_fill_image_mask(this.pointer, image.pointer, MATRIX(ctm), colorspace.pointer, COLOR(color), alpha)
	}

	clipImageMask(image: Image, ctm: Matrix) {
		checkType(image, Image)
		checkMatrix(ctm)
		libmupdf._wasm_clip_image_mask(this.pointer, image.pointer, MATRIX(ctm))
	}

	popClip() {
		libmupdf._wasm_pop_clip(this.pointer)
	}

	beginMask(area: Rect, luminosity: boolean, colorspace: ColorSpace, color: Color) {
		checkRect(area)
		checkType(colorspace, ColorSpace)
		checkColor(color)
		libmupdf._wasm_begin_mask(this.pointer, RECT(area), luminosity, colorspace.pointer, COLOR(color))
	}

	endMask() {
		libmupdf._wasm_end_mask(this.pointer)
	}

	beginGroup(area: Rect, colorspace: ColorSpace, isolated: boolean, knockout: boolean, blendmode: BlendMode, alpha: number) {
		checkRect(area)
		checkType(colorspace, ColorSpace)
		let blendmode_ix = ENUM<BlendMode>(blendmode, Device.BLEND_MODES)
		libmupdf._wasm_begin_group(this.pointer, RECT(area), colorspace.pointer, isolated, knockout, blendmode_ix, alpha)
	}

	endGroup() {
		libmupdf._wasm_end_group(this.pointer)
	}

	beginTile(area: Rect, view: Rect, xstep: number, ystep: number, ctm: Matrix, id: number) {
		checkRect(area)
		checkRect(view)
		checkMatrix(ctm)
		return libmupdf._wasm_begin_tile(this.pointer, RECT(area), RECT2(view), xstep, ystep, MATRIX(ctm), id)
	}

	endTile() {
		libmupdf._wasm_end_tile(this.pointer)
	}

	beginLayer(name: string) {
		libmupdf._wasm_begin_layer(this.pointer, STRING(name))
	}

	endLayer() {
		libmupdf._wasm_end_layer(this.pointer)
	}

	close() {
		libmupdf._wasm_close_device(this.pointer)
	}
}

export class DrawDevice extends Device {
	constructor(matrix: Matrix, pixmap: Pixmap) {
		checkMatrix(matrix)
		checkType(pixmap, Pixmap)
		super(libmupdf._wasm_new_draw_device(MATRIX(matrix), pixmap.pointer))
	}
}

export class DisplayListDevice extends Device {
	constructor(displayList: DisplayList) {
		checkType(displayList, DisplayList)
		super(libmupdf._wasm_new_display_list_device(displayList.pointer))
	}
}

export class DocumentWriter extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_document_writer

	constructor(buffer: Buffer, format: string, options: string) {
		super(
			libmupdf._wasm_new_document_writer_with_buffer(
				BUFFER(buffer),
				STRING(format),
				STRING2(options)
			)
		)
	}

	beginPage(mediabox: Rect) {
		checkRect(mediabox)
		return new Device(libmupdf._wasm_begin_page(this.pointer, RECT(mediabox)))
	}

	endPage() {
		libmupdf._wasm_end_page(this.pointer)
	}

	close() {
		libmupdf._wasm_close_document_writer(this.pointer)
	}
}

type DocumentPermission =
	"print" |
	"copy" |
	"edit" |
	"annotate" |
	"form" |
	"accessibility" |
	"assemble" |
	"print-hq"

export class Document extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_document

	static readonly META_FORMAT = "format"
	static readonly META_ENCRYPTION = "encryption"
	static readonly META_INFO_AUTHOR = "info:Author"
	static readonly META_INFO_TITLE = "info:Title"
	static readonly META_INFO_SUBJECT = "info:Subject"
	static readonly META_INFO_KEYWORDS = "info:Keywords"
	static readonly META_INFO_CREATOR = "info:Creator"
	static readonly META_INFO_PRODUCER = "info:Producer"
	static readonly META_INFO_CREATIONDATE = "info:CreationDate"
	static readonly META_INFO_MODIFICATIONDATE = "info:ModDate"

	static readonly PERMISSION: Record<DocumentPermission,number> = {
		"print": "p".charCodeAt(0),
		"copy": "c".charCodeAt(0),
		"edit": "e".charCodeAt(0),
		"annotate": "n".charCodeAt(0),
		"form": "f".charCodeAt(0),
		"accessibility": "y".charCodeAt(0),
		"assemble": "a".charCodeAt(0),
		"print-hq": "h".charCodeAt(0),
	}

	static readonly LINK_DEST: LinkDestType[] = [
		"Fit",
		"FitB",
		"FitH",
		"FitBH",
		"FitV",
		"FitBV",
		"FitR",
		"XYZ",
	]

	static openDocument(from: Buffer | ArrayBuffer | Uint8Array | Stream, magic: string) {
		checkType(magic, "string")

		let pointer = 0

		if (from instanceof ArrayBuffer || from instanceof Uint8Array)
			from = new Buffer(from)
		if (from instanceof Buffer)
			pointer = libmupdf._wasm_open_document_with_buffer(STRING(magic), from.pointer)
		else if (from instanceof Stream)
			pointer = libmupdf._wasm_open_document_with_stream(STRING(magic), from.pointer)
		else
			throw new Error("not a Buffer or Stream")

		if (libmupdf._wasm_pdf_document_from_fz_document(pointer))
			return new PDFDocument(pointer)

		return new Document(pointer)
	}

	formatLinkURI(dest: LinkDest) {
		return fromStringFree(
			libmupdf._wasm_format_link_uri(this.pointer,
				dest.chapter | 0,
				dest.page | 0,
				ENUM<LinkDestType>(dest.type, Document.LINK_DEST),
				+dest.x,
				+dest.y,
				+dest.width,
				+dest.height,
				+dest.zoom
			)
		)
	}

	isPDF() {
		return this instanceof PDFDocument
	}

	needsPassword() {
		return !!libmupdf._wasm_needs_password(this.pointer)
	}

	authenticatePassword(password: string) {
		return libmupdf._wasm_authenticate_password(this.pointer, STRING(password))
	}

	hasPermission(perm: DocumentPermission) {
		let perm_ix = Document.PERMISSION[perm]
		return !!libmupdf._wasm_has_permission(this.pointer, perm_ix)
	}

	getMetaData(key: string) {
		let value = libmupdf._wasm_lookup_metadata(this.pointer, STRING(key))
		if (value)
			return fromString(value)
		return undefined
	}

	setMetaData(key: string, value: string) {
		libmupdf._wasm_set_metadata(this.pointer, STRING(key), STRING2(value))
	}

	countPages() {
		return libmupdf._wasm_count_pages(this.pointer)
	}

	isReflowable() {
		// TODO: No HTML/EPUB support in WASM.
		return false
	}

	layout(w: number, h: number, em: number) {
		libmupdf._wasm_layout_document(this.pointer, w, h, em)
	}

	loadPage(index: number) {
		let fz_ptr = libmupdf._wasm_load_page(this.pointer, index)
		if (this instanceof PDFDocument) {
			let pdf_ptr = libmupdf._wasm_pdf_page_from_fz_page(fz_ptr)
			if (pdf_ptr)
				return new PDFPage(this, pdf_ptr)
		}
		return new Page(fz_ptr)
	}

	loadOutline() {
		let doc = this.pointer
		function to_outline(outline: Pointer) {
			let result: OutlineItem[] = []
			while (outline) {
				let title = libmupdf._wasm_outline_get_title(outline)
				let uri = libmupdf._wasm_outline_get_uri(outline)
				let open = libmupdf._wasm_outline_get_is_open(outline)

				let item: OutlineItem = {
					title: title ? fromString(title) : undefined,
					uri: uri ? fromString(uri) : undefined,
					open: !!open,
				}

				let page = libmupdf._wasm_outline_get_page(doc, outline)
				if (page >= 0)
					item.page = page

				let down = libmupdf._wasm_outline_get_down(outline)
				if (down)
					item.down = to_outline(down)

				result.push(item)

				outline = libmupdf._wasm_outline_get_next(outline)
			}
			return result
		}
		let root = libmupdf._wasm_load_outline(doc)
		if (root)
			return to_outline(root)
		return null
	}

	resolveLink(link: string | Link) {
		if (link instanceof Link)
			return libmupdf._wasm_resolve_link(this.pointer, libmupdf._wasm_link_get_uri(link.pointer))
		return libmupdf._wasm_resolve_link(this.pointer, STRING(link))
	}

	outlineIterator() {
		return new OutlineIterator(libmupdf._wasm_new_outline_iterator(this.pointer))
	}
}

interface OutlineItem {
	title: string | undefined,
	uri: string | undefined,
	open: boolean,
	down?: OutlineItem[],
	page?: number,
}

export class OutlineIterator extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_outline_iterator

	static readonly RESULT_DID_NOT_MOVE = -1
	static readonly RESULT_AT_ITEM = 0
	static readonly RESULT_AT_EMPTY = 1

	item() {
		let item = libmupdf._wasm_outline_iterator_item(this.pointer)
		if (item) {
			let title_ptr = libmupdf._wasm_outline_item_get_title(item)
			let uri_ptr = libmupdf._wasm_outline_item_get_uri(item)
			let is_open = libmupdf._wasm_outline_item_get_is_open(item)
			return {
				title: title_ptr ? fromString(title_ptr) : undefined,
				uri: uri_ptr ? fromString(uri_ptr) : undefined,
				open: !!is_open,
			} as OutlineItem
		}
		return null
	}

	next() {
		return libmupdf._wasm_outline_iterator_next(this.pointer)
	}

	prev() {
		return libmupdf._wasm_outline_iterator_prev(this.pointer)
	}

	up() {
		return libmupdf._wasm_outline_iterator_up(this.pointer)
	}

	down() {
		return libmupdf._wasm_outline_iterator_down(this.pointer)
	}

	delete() {
		return libmupdf._wasm_outline_iterator_delete(this.pointer)
	}

	insert(item: OutlineItem) {
		return libmupdf._wasm_outline_iterator_insert(this.pointer, STRING_OPT(item.title), STRING2_OPT(item.uri), item.open)
	}

	update(item: OutlineItem) {
		libmupdf._wasm_outline_iterator_update(this.pointer, STRING_OPT(item.title), STRING2_OPT(item.uri), item.open)
	}
}

type LinkDestType =
	"Fit" |
	"FitB" |
	"FitH" |
	"FitBH" |
	"FitV" |
	"FitBV" |
	"FitR" |
	"XYZ"

interface LinkDest {
	type: LinkDestType,
	chapter: number,
	page: number,
	x: number,
	y: number,
	width: number,
	height: number,
	zoom: number,
}

export class Link extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_link

	getBounds() {
		return fromRect(libmupdf._wasm_link_get_rect(this.pointer))
	}

	setBounds(rect: Rect) {
		checkRect(rect)
		libmupdf._wasm_link_set_rect(this.pointer, RECT(rect))
	}

	getURI() {
		return fromString(libmupdf._wasm_link_get_uri(this.pointer))
	}

	setURI(uri: string) {
		checkType(uri, "string")
		libmupdf._wasm_link_set_uri(this.pointer, STRING(uri))
	}

	isExternal() {
		return /^\w[\w+-.]*:/.test(this.getURI())
	}
}

export class Page extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_page

	isPDF() {
		return this instanceof PDFPage
	}

	getBounds() {
		return fromRect(libmupdf._wasm_bound_page(this.pointer))
	}

	getLabel() {
		return fromString(libmupdf._wasm_page_label(this.pointer))
	}

	run(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_run_page(this.pointer, device.pointer, MATRIX(matrix))
	}

	runPageContents(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_run_page_contents(this.pointer, device.pointer, MATRIX(matrix))
	}

	runPageAnnots(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_run_page_annots(this.pointer, device.pointer, MATRIX(matrix))
	}

	runPageWidgets(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_run_page_widgets(this.pointer, device.pointer, MATRIX(matrix))
	}

	toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false, showExtras = true) {
		checkType(colorspace, ColorSpace)
		checkMatrix(matrix)
		let result
		if (showExtras)
			result = libmupdf._wasm_new_pixmap_from_page(this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha)
		else
			result = libmupdf._wasm_new_pixmap_from_page_contents(this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha)
		return new Pixmap(result)
	}

	toDisplayList(showExtras = true) {
		let result
		if (showExtras)
			result = libmupdf._wasm_new_display_list_from_page(this.pointer)
		else
			result = libmupdf._wasm_new_display_list_from_page_contents(this.pointer)
		return new DisplayList(result)
	}

	toStructuredText(options = "") {
		checkType(options, "string")
		return new StructuredText(libmupdf._wasm_new_stext_page_from_page(this.pointer, STRING(options)))
	}

	getLinks() {
		let links: Link[] = []
		let link = libmupdf._wasm_load_links(this.pointer)
		while (link) {
			links.push(new Link(libmupdf._wasm_keep_link(link)))
			link = libmupdf._wasm_link_get_next(link)
		}
		return links
	}

	createLink(bbox: Rect, uri: string) {
		checkRect(bbox)
		return new Link(libmupdf._wasm_create_link(this.pointer, RECT(bbox), STRING(uri)))
	}

	deleteLink(link: Link) {
		checkType(link, Link)
		libmupdf._wasm_delete_link(this.pointer, link.pointer)
	}

	search(needle: string, max_hits = 500) {
		return runSearch(libmupdf._wasm_search_page, this.pointer, needle, max_hits)
	}
}

/* -------------------------------------------------------------------------- */

export class PDFDocument extends Document {
	// Create a new empty document
	constructor()

	// Open an existing document
	constructor(data: Buffer | ArrayBuffer | Uint8Array)

	// PRIVATE
	constructor(pointer: Pointer)

	constructor(arg1?: number | Buffer | ArrayBuffer | Uint8Array) {
		if (typeof arg1 === "undefined")
			super(libmupdf._wasm_pdf_create_document())
		else if (typeof arg1 === "number")
			super(arg1)
		else {
			let doc = Document.openDocument(arg1, "application/pdf")
			if (doc instanceof PDFDocument)
				return doc
			throw new Error("not a PDF document")
		}
	}

	override loadPage(index: number) {
		return super.loadPage(index) as PDFPage
	}

	// PDFObject instances are always bound to a document, so the WASM/JS value interface lives here.

	// Wrap a pdf_obj in a Userdata object. The pointer must be newly created or we already own it.
	_fromPDFObjectNew(ptr: number) {
		if (ptr === 0)
			return PDFObject.Null
		return new PDFObject(this, ptr)
	}

	// Wrap a pdf_obj in a Userdata object. The pointer must be a borrowed pointer, so we have to take ownership.
	_fromPDFObjectKeep(ptr: number) {
		if (ptr === 0)
			return PDFObject.Null
		return new PDFObject(this, libmupdf._wasm_pdf_keep_obj(ptr))
	}

	_toPDFObject(obj: any) {
		if (obj instanceof PDFObject)
			return obj
		if (obj === null || obj === undefined)
			return this.newNull()
		if (typeof obj === "string") {
			// if a JS string is surrounded by parens, convert it to a PDF string
			if (obj.startsWith("(") && obj.endsWith(")"))
				return this.newString(obj.slice(1, -1))
			// otherwise treat it as a name
			return this.newName(obj)
		}
		if (typeof obj === "number") {
			if (obj === (obj | 0))
				return this.newInteger(obj)
			return this.newReal(obj)
		}
		if (typeof obj === "boolean")
			return this.newBoolean(obj)
		if (obj instanceof Array) {
			let result = this.newArray(obj.length)
			for (let item of obj)
				result.push(item)
			return result
		}
		if (obj instanceof Object) {
			let result = this.newDictionary()
			for (let key in obj)
				result.put(key, obj[key])
			return result
		}
		throw new TypeError("cannot convert value to PDFObject")
	}

	_PDFOBJ(obj: any) {
		// Note: We have to create a PDFObject instance for garbage collection.
		return this._toPDFObject(obj).pointer
	}

	getVersion() {
		return libmupdf._wasm_pdf_version(this.pointer)
	}

	getLanguage() {
		return fromString(libmupdf._wasm_pdf_document_language(this.pointer))
	}

	setLanguage(lang: string) {
		libmupdf._wasm_pdf_set_document_language(this.pointer, STRING(lang))
	}

	countObjects() {
		return libmupdf._wasm_pdf_xref_len(this.pointer)
	}

	getTrailer() {
		return new PDFObject(this, libmupdf._wasm_pdf_trailer(this.pointer))
	}

	createObject() {
		let num = libmupdf._wasm_pdf_create_object(this.pointer)
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_indirect(this.pointer, num))
	}

	newNull() { return PDFObject.Null }
	newBoolean(v: boolean) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_bool(v)) }
	newInteger(v: number) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_int(v)) }
	newReal(v: number) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_real(v)) }
	newName(v: string) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_name(STRING(v))) }
	newString(v: string) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_text_string(STRING(v))) }

	newByteString(v: Uint8Array) {
		checkType(v, Uint8Array)
		let len = v.byteLength
		let ptr = libmupdf._wasm_malloc(len)
		libmupdf.HEAPU8.set(v, ptr)
		try {
			return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_string(ptr, len))
		} finally {
			libmupdf._wasm_free(ptr)
		}
	}

	newIndirect(v: number) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_indirect(this.pointer, v)) }
	newArray(cap=8) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_array(this.pointer, cap)) }
	newDictionary(cap=8) { return this._fromPDFObjectNew(libmupdf._wasm_pdf_new_dict(this.pointer, cap)) }

	deleteObject(num: number | PDFObject) {
		if (num instanceof PDFObject)
			num = num.asIndirect()
		else
			checkType(num, "number")
		libmupdf._wasm_pdf_delete_object(this.pointer, num)
	}

	addObject(obj: any) {
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_object(this.pointer, this._PDFOBJ(obj)))
	}

	addStream(buf: AnyBuffer, obj: any) {
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_stream(this.pointer, BUFFER(buf), this._PDFOBJ(obj), 0))
	}

	addRawStream(buf: AnyBuffer, obj: any) {
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_stream(this.pointer, BUFFER(buf), this._PDFOBJ(obj), 1))
	}

	newGraftMap() {
		return new PDFGraftMap(this, libmupdf._wasm_pdf_new_graft_map(this.pointer))
	}

	graftObject(obj: PDFObject) {
		checkType(obj, PDFObject)
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_graft_object(this.pointer, obj.pointer))
	}

	graftPage(to: number, srcDoc: PDFDocument, srcPage: number) {
		checkType(to, "number")
		checkType(srcDoc, PDFDocument)
		checkType(srcPage, "number")
		libmupdf._wasm_pdf_graft_page(this.pointer, to, srcDoc.pointer, srcPage)
	}

	addSimpleFont(font: Font, encoding: FontSimpleEncoding = "Latin") {
		checkType(font, Font)
		var encoding_ix = ENUM<FontSimpleEncoding>(encoding, Font.SIMPLE_ENCODING)
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_simple_font(this.pointer, font.pointer, encoding_ix))
	}

	addCJKFont(font: Font, lang: FontCJKOrdering | FontCJKLanguage, wmode = 0, serif = true) {
		checkType(font, Font)
		if (typeof lang === "string")
			lang = Font.CJK_ORDERING_BY_LANG[lang]
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_cjk_font(this.pointer, font.pointer, lang, wmode, serif))
	}

	addFont(font: Font) {
		checkType(font, Font)
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_cid_font(this.pointer, font.pointer))
	}

	addImage(image: Image) {
		checkType(image, Image)
		return this._fromPDFObjectNew(libmupdf._wasm_pdf_add_image(this.pointer, image.pointer))
	}

	loadImage(ref: PDFObject) {
		checkType(ref, PDFObject)
		return new Image(libmupdf._wasm_pdf_load_image(this.pointer, ref.pointer))
	}

	findPage(index: number) {
		checkType(index, "number")
		return this._fromPDFObjectKeep(libmupdf._wasm_pdf_lookup_page_obj(this.pointer, index))
	}

	addPage(mediabox: Rect, rotate: Rotate, resources: any, contents: AnyBuffer) {
		checkRect(mediabox)
		checkType(rotate, "number")
		return this._fromPDFObjectNew(
			libmupdf._wasm_pdf_add_page(
				this.pointer,
				RECT(mediabox),
				rotate,
				this._PDFOBJ(resources),
				BUFFER(contents)
			)
		)
	}

	insertPage(at: number, obj: PDFObject) {
		checkType(at, "number")
		libmupdf._wasm_pdf_insert_page(this.pointer, at, this._PDFOBJ(obj))
	}

	deletePage(at: number) {
		checkType(at, "number")
		libmupdf._wasm_pdf_delete_page(this.pointer, at)
	}

	isEmbeddedFile(ref: PDFObject) {
		checkType(ref, PDFObject)
		return libmupdf._wasm_pdf_is_embedded_file(ref.pointer)
	}

	addEmbeddedFile(filename: string, mimetype: string, contents: AnyBuffer, created: Date, modified: Date, checksum = false) {
		checkType(filename, "string")
		checkType(mimetype, "string")
		checkType(created, Date)
		checkType(modified, Date)
		checkType(checksum, "boolean")
		return this._fromPDFObjectNew(
			libmupdf._wasm_pdf_add_embedded_file(
				this.pointer,
				STRING(filename),
				STRING2(mimetype),
				BUFFER(contents),
				created.getTime() / 1000 | 0,
				modified.getTime() / 1000 | 0,
				checksum
			)
		)
	}

	getEmbeddedFileParams(ref: PDFObject) {
		checkType(ref, PDFObject)
		let ptr = libmupdf._wasm_pdf_get_embedded_file_params(ref.pointer)
		return {
			filename:
				fromString(libmupdf._wasm_pdf_embedded_file_params_get_filename(ptr)),
			mimetype:
				fromString(libmupdf._wasm_pdf_embedded_file_params_get_mimetype(ptr)),
			size:
				libmupdf._wasm_pdf_embedded_file_params_get_filename(ptr),
			creationDate:
				new Date(libmupdf._wasm_pdf_embedded_file_params_get_created(ptr) * 1000),
			modificationDate:
				new Date(libmupdf._wasm_pdf_embedded_file_params_get_modified(ptr) * 1000),
		}
	}

	getEmbeddedFileContents(ref: PDFObject) {
		checkType(ref, PDFObject)
		let contents = libmupdf._wasm_pdf_load_embedded_file_contents(ref.pointer)
		if (contents)
			return new Buffer(contents)
		return null
	}

	getEmbeddedFiles() {
		function _getEmbeddedFilesRec(result: any[string], N: PDFObject) {
			var i, n
			if (N) {
				var NN = N.get("Names")
				if (NN)
					for (i = 0, n = NN.length; i < n; i += 2)
						result[NN.get(i+0).asString()] = NN.get(i+1)
				var NK = N.get("Kids")
				if (NK)
					for (i = 0, n = NK.length; i < n; i += 1)
						_getEmbeddedFilesRec(result, NK.get(i))
			}
			return result
		}
		return _getEmbeddedFilesRec({}, this.getTrailer().get("Root", "Names", "EmbeddedFiles"))
	}

	saveToBuffer(options = "") {
		checkType(options, "string")
		// TODO: object options to string options?
		return new Buffer(libmupdf._wasm_pdf_write_document_buffer(this.pointer, STRING(options)))
	}

	static readonly PAGE_LABEL_NONE = "\0"
	static readonly PAGE_LABEL_DECIMAL = "D"
	static readonly PAGE_LABEL_ROMAN_UC = "R"
	static readonly PAGE_LABEL_ROMAN_LC = "r"
	static readonly PAGE_LABEL_ALPHA_UC = "A"
	static readonly PAGE_LABEL_ALPHA_LC = "a"

	setPageLabels(index: number, style = "D", prefix = "", start = 1) {
		libmupdf._wasm_pdf_set_page_labels(this.pointer, index, style.charCodeAt(0), STRING(prefix), start)
	}

	deletePageLabels(index: number) {
		libmupdf._wasm_pdf_delete_page_labels(this.pointer, index)
	}

	wasRepaired() {
		return !!libmupdf._wasm_pdf_was_repaired(this.pointer)
	}

	hasUnsavedChanges() {
		return !!libmupdf._wasm_pdf_has_unsaved_changes(this.pointer)
	}

	countVersions() {
		return libmupdf._wasm_pdf_count_versions(this.pointer)
	}

	countUnsavedVersions() {
		return libmupdf._wasm_pdf_count_unsaved_versions(this.pointer)
	}

	validateChangeHistory() {
		return libmupdf._wasm_pdf_validate_change_history(this.pointer)
	}

	canBeSavedIncrementally() {
		return !!libmupdf._wasm_pdf_can_be_saved_incrementally(this.pointer)
	}

	enableJournal() {
		libmupdf._wasm_pdf_enable_journal(this.pointer)
	}

	getJournal() {
		let position = libmupdf._wasm_pdf_undoredo_state_position(this.pointer)
		let n = libmupdf._wasm_pdf_undoredo_state_count(this.pointer)
		let steps: string[] = []
		for (let i = 0; i < n; ++i)
			steps.push(
				fromString(
					libmupdf._wasm_pdf_undoredo_step(this.pointer, i),
				)
			)
		return { position, steps }
	}

	beginOperation(op: string) {
		libmupdf._wasm_pdf_begin_operation(this.pointer, STRING(op))
	}

	beginImplicitOperation() {
		libmupdf._wasm_pdf_begin_implicit_operation(this.pointer)
	}

	endOperation() {
		libmupdf._wasm_pdf_end_operation(this.pointer)
	}

	abandonOperation() {
		libmupdf._wasm_pdf_abandon_operation(this.pointer)
	}

	canUndo() {
		return !!libmupdf._wasm_pdf_can_undo(this.pointer)
	}

	canRedo() {
		return !!libmupdf._wasm_pdf_can_redo(this.pointer)
	}

	undo() {
		libmupdf._wasm_pdf_undo(this.pointer)
	}

	redo() {
		libmupdf._wasm_pdf_redo(this.pointer)
	}

	isJSSupported() {
		return !!libmupdf._wasm_pdf_js_supported(this.pointer)
	}

	enableJS() {
		libmupdf._wasm_pdf_enable_js(this.pointer)
	}

	disableJS() {
		libmupdf._wasm_pdf_disable_js(this.pointer)
	}

	setJSEventListener(_listener: any) {
		throw "TODO"
	}

	rearrangePages(pages: number[]) {
		let n = pages.length
		let ptr = libmupdf._wasm_malloc(n << 2) >> 2
		for (let i = 0; i < n; ++i)
			libmupdf.HEAPU32[ptr + i] = pages[i] || 0
		try {
			libmupdf._wasm_pdf_rearrange_pages(this.pointer, n, ptr << 2)
		} finally {
			libmupdf._wasm_free(ptr)
		}
	}

	bake(bakeAnnots = true, bakeWidgets = true) {
		libmupdf._wasm_pdf_bake_document(this.pointer, bakeAnnots, bakeWidgets)
	}
}

type PDFPageBox = "MediaBox" | "CropBox" | "BleedBox" | "TrimBox" | "ArtBox"

export class PDFPage extends Page {
	_doc: PDFDocument
	_annots: PDFAnnotation[] | null
	_widgets: PDFWidget[] | null

	// PRIVATE
	constructor(doc: PDFDocument, pointer: Pointer) {
		super(pointer)
		this._doc = doc
		this._annots = null
		this._widgets = null
	}

	getObject() {
		return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_page_get_obj(this.pointer))
	}

	static readonly BOXES: PDFPageBox[] = [
		"MediaBox",
		"CropBox",
		"BleedBox",
		"TrimBox",
		"ArtBox"
	]

	getTransform() {
		return fromMatrix(libmupdf._wasm_pdf_page_transform(this.pointer))
	}

	setPageBox(box: PDFPageBox, rect: Rect) {
		let box_ix = ENUM<PDFPageBox>(box, PDFPage.BOXES)
		checkRect(rect)
		libmupdf._wasm_pdf_set_page_box(this.pointer, box_ix, RECT(rect))
	}

	override toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false, showExtras = true, usage = "View", box: PDFPageBox = "CropBox") {
		checkMatrix(matrix)
		checkType(colorspace, ColorSpace)
		let box_ix = ENUM<PDFPageBox>(box, PDFPage.BOXES)
		let result
		if (showExtras)
			result = libmupdf._wasm_pdf_new_pixmap_from_page_with_usage(this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha,
				STRING(usage),
				box_ix)
		else
			result = libmupdf._wasm_pdf_new_pixmap_from_page_contents_with_usage(this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha,
				STRING(usage),
				box_ix)
		return new Pixmap(result)
	}

	getWidgets() {
		if (!this._widgets) {
			this._widgets = []
			let widget = libmupdf._wasm_pdf_first_widget(this.pointer)
			while (widget) {
				this._widgets.push(new PDFWidget(this._doc, libmupdf._wasm_pdf_keep_annot(widget)))
				widget = libmupdf._wasm_pdf_next_widget(widget)
			}
		}
		return this._widgets
	}

	getAnnotations() {
		if (!this._annots) {
			this._annots = []
			let annot = libmupdf._wasm_pdf_first_annot(this.pointer)
			while (annot) {
				this._annots.push(new PDFAnnotation(this._doc, libmupdf._wasm_pdf_keep_annot(annot)))
				annot = libmupdf._wasm_pdf_next_annot(annot)
			}
		}
		return this._annots
	}

	createAnnotation(type: PDFAnnotationType) {
		let type_ix = ENUM<PDFAnnotationType>(type, PDFAnnotation.ANNOT_TYPES)
		let annot = new PDFAnnotation(this._doc, libmupdf._wasm_pdf_create_annot(this.pointer, type_ix))
		if (this._annots)
			this._annots.push(annot)
		return annot
	}

	deleteAnnotation(annot: PDFAnnotation) {
		checkType(annot, PDFAnnotation)
		libmupdf._wasm_pdf_delete_annot(this.pointer, annot.pointer)
		if (this._annots) {
			let ix = this._annots.indexOf(annot)
			if (ix >= 0)
				this._annots.splice(ix, 1)
		}
	}

	static readonly REDACT_IMAGE_NONE = 0
	static readonly REDACT_IMAGE_REMOVE = 1
	static readonly REDACT_IMAGE_PIXELS = 2

	applyRedactions(black_boxes = 1, image_method = 2) {
		libmupdf._wasm_pdf_redact_page(this.pointer, black_boxes, image_method)
	}

	update() {
		return !!libmupdf._wasm_pdf_update_page(this.pointer)
	}
}

type PDFObjectPath = Array<number | string | PDFObject>

export class PDFObject extends Userdata {
	static override readonly _drop = libmupdf._wasm_pdf_drop_obj

	static readonly Null = new PDFObject(null as unknown as PDFDocument, 0)

	_doc: PDFDocument

	// PRIVATE
	constructor(doc: PDFDocument, pointer: Pointer) {
		super(libmupdf._wasm_pdf_keep_obj(pointer))
		this._doc = doc
	}

	isNull() { return this === PDFObject.Null }
	isIndirect() { return !!libmupdf._wasm_pdf_is_indirect(this.pointer) }
	isBoolean() { return !!libmupdf._wasm_pdf_is_bool(this.pointer) }
	isInteger() { return !!libmupdf._wasm_pdf_is_int(this.pointer) }
	isNumber() { return !!libmupdf._wasm_pdf_is_number(this.pointer) }
	isName() { return !!libmupdf._wasm_pdf_is_name(this.pointer) }
	isString() { return !!libmupdf._wasm_pdf_is_string(this.pointer) }
	isArray() { return !!libmupdf._wasm_pdf_is_array(this.pointer) }
	isDictionary() { return !!libmupdf._wasm_pdf_is_dict(this.pointer) }
	isStream() { return !!libmupdf._wasm_pdf_is_stream(this.pointer) }

	asIndirect(): number { return libmupdf._wasm_pdf_to_num(this.pointer) }
	asBoolean() { return !!libmupdf._wasm_pdf_to_bool(this.pointer) }
	asNumber(): number { return libmupdf._wasm_pdf_to_real(this.pointer) }
	asName() { return fromString(libmupdf._wasm_pdf_to_name(this.pointer)) }
	asString() { return fromString(libmupdf._wasm_pdf_to_text_string(this.pointer)) }

	asByteString() {
		let ptr = libmupdf._wasm_pdf_to_string(this.pointer, _wasm_int)
		let len = libmupdf.HEAPU32[_wasm_int >> 2] as number
		return libmupdf.HEAPU8.slice(ptr, ptr + len)
	}

	readStream() { return new Buffer(libmupdf._wasm_pdf_load_stream(this.pointer)) }
	readRawStream() { return new Buffer(libmupdf._wasm_pdf_load_raw_stream(this.pointer)) }

	writeObject(obj: any) {
		if (!this.isIndirect())
			throw new TypeError("can only call PDFObject.writeObject on an indirect reference")
		libmupdf._wasm_pdf_update_object(this._doc.pointer, this.asIndirect(), this._doc._PDFOBJ(obj))
	}

	writeStream(buf: AnyBuffer) {
		if (!this.isIndirect())
			throw new TypeError("can only call PDFObject.writeStream on an indirect reference")
		libmupdf._wasm_pdf_update_stream(this._doc.pointer, this.pointer, BUFFER(buf), 0)
	}

	writeRawStream(buf: AnyBuffer) {
		if (!this.isIndirect())
			throw new TypeError("can only call PDFObject.writeRawStream on an indirect reference")
		libmupdf._wasm_pdf_update_stream(this._doc.pointer, this.pointer, BUFFER(buf), 1)
	}

	resolve() {
		return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_resolve_indirect(this.pointer))
	}

	get length() {
		return libmupdf._wasm_pdf_array_len(this.pointer)
	}

	_get(path: PDFObjectPath) {
		let obj = this.pointer
		for (let key of path) {
			if (typeof key === "number")
				obj = libmupdf._wasm_pdf_array_get(obj, key)
			else if (key instanceof PDFObject)
				obj = libmupdf._wasm_pdf_dict_get(obj, key.pointer)
			else
				obj = libmupdf._wasm_pdf_dict_gets(obj, STRING(key))
			if (obj === 0)
				break
		}
		return obj
	}

	get(...path: PDFObjectPath): PDFObject { return this._doc._fromPDFObjectKeep(this._get(path)) }
	getIndirect(...path: PDFObjectPath): number { return libmupdf._wasm_pdf_to_num(this._get(path)) }
	getBoolean(...path: PDFObjectPath): boolean { return !!libmupdf._wasm_pdf_to_bool(this._get(path)) }
	getNumber(...path: PDFObjectPath): number { return libmupdf._wasm_pdf_to_real(this._get(path)) }
	getName(...path: PDFObjectPath): string { return fromString(libmupdf._wasm_pdf_to_name(this._get(path))) }
	getString(...path: PDFObjectPath): string { return fromString(libmupdf._wasm_pdf_to_text_string(this._get(path))) }

	getInheritable(key: string | PDFObject) {
		if (key instanceof PDFObject)
			return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_inheritable(this.pointer, key.pointer))
		return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_gets_inheritable(this.pointer, STRING(key)))
	}

	put(key: number | string | PDFObject, value: any) {
		value = this._doc._toPDFObject(value)
		if (typeof key === "number")
			libmupdf._wasm_pdf_array_put(this.pointer, key, value.pointer)
		else if (key instanceof PDFObject)
			libmupdf._wasm_pdf_dict_put(this.pointer, key.pointer, value.pointer)
		else
			libmupdf._wasm_pdf_dict_puts(this.pointer, STRING(key), value.pointer)
		return value
	}

	push(value: any) {
		value = this._doc._toPDFObject(value)
		libmupdf._wasm_pdf_array_push(this.pointer, value.pointer)
		return value
	}

	delete(key: number | string | PDFObject) {
		if (typeof key === "number")
			libmupdf._wasm_pdf_array_delete(this.pointer, key)
		else if (key instanceof PDFObject)
			libmupdf._wasm_pdf_dict_del(this.pointer, key.pointer)
		else
			libmupdf._wasm_pdf_dict_dels(this.pointer, STRING(key))
	}

	override valueOf() {
		if (this.isNull()) return null
		if (this.isBoolean()) return this.asBoolean()
		if (this.isNumber()) return this.asNumber()
		if (this.isName()) return this.asName()
		if (this.isString()) return this.asString()
		if (this.isIndirect()) return `${this.asIndirect()} 0 R`
		return this
	}

	override toString(tight = true, ascii = true) {
		return fromStringFree(libmupdf._wasm_pdf_sprint_obj(this.pointer, tight, ascii))
	}

	forEach(fn: (val: PDFObject, key: number | string, self: PDFObject) => void) {
		if (this.isArray()) {
			let n = this.length
			for (let i = 0; i < n; ++i)
				fn(this.get(i), i, this)
		} else if (this.isDictionary()) {
			let n = libmupdf._wasm_pdf_dict_len(this.pointer)
			for (let i = 0; i < n; ++i) {
				let key = this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_key(this.pointer, i))
				let val = this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_dict_get_val(this.pointer, i))
				fn(val, key.asName(), this)
			}
		}
	}

	// Convert to plain Javascript values, objects, and arrays.
	// If you want to resolve indirect references, pass an empty object or array as the first argument.
	// On exit, this object will contain all indirect objects encountered indexed by object number.
	// Note: This function will omit cyclic references.
	asJS(seen?: Record<number,PDFObject>): any {
		if (this.isIndirect()) {
			let ref = this.asIndirect()
			if (!seen)
				return `${ref} 0 R`
			if (ref in seen)
				return seen[ref]
			seen[ref] = PDFObject.Null // stop recursion!
			return seen[ref] = this.resolve().asJS(seen)
		}

		if (this.isArray()) {
			let result: any[] = []
			this.forEach(val => {
				result.push(val.asJS(seen))
			})
			return result
		}

		if (this.isDictionary()) {
			let result: Record<string,any> = {}
			this.forEach((val, key) => {
				result[key] = val.asJS(seen)
			})
			return result
		}

		return this.valueOf()
	}
}

export class PDFGraftMap extends Userdata {
	static override readonly _drop = libmupdf._wasm_pdf_drop_graft_map

	_doc: PDFDocument

	// PRIVATE
	constructor(doc: PDFDocument, pointer: Pointer) {
		super(pointer)
		this._doc = doc
	}

	graftObject(obj: PDFObject) {
		checkType(obj, PDFObject)
		return this._doc._fromPDFObjectNew(libmupdf._wasm_pdf_graft_mapped_object(this.pointer, obj.pointer))
	}

	graftPage(to: number, srcDoc: PDFDocument, srcPage: number) {
		checkType(to, "number")
		checkType(srcDoc, PDFDocument)
		checkType(srcPage, "number")
		libmupdf._wasm_pdf_graft_mapped_page(this.pointer, to, srcDoc.pointer, srcPage)
	}
}

type PDFAnnotationType =
	"Text" |
	"Link" |
	"FreeText" |
	"Line" |
	"Square" |
	"Circle" |
	"Polygon" |
	"PolyLine" |
	"Highlight" |
	"Underline" |
	"Squiggly" |
	"StrikeOut" |
	"Redact" |
	"Stamp" |
	"Caret" |
	"Ink" |
	"Popup" |
	"FileAttachment" |
	"Sound" |
	"Movie" |
	"RichMedia" |
	"Widget" |
	"Screen" |
	"PrinterMark" |
	"TrapNet" |
	"Watermark" |
	"3D" |
	"Projection"

type PDFAnnotationLineEndingStyle =
	"None" |
	"Square" |
	"Circle" |
	"Diamond" |
	"OpenArrow" |
	"ClosedArrow" |
	"Butt" |
	"ROpenArrow" |
	"RClosedArrow" |
	"Slash"

type PDFAnnotationBorderStyle = "Solid" | "Dashed" | "Beveled" | "Inset" | "Underline"

type PDFAnnotationBorderEffect = "None" | "Cloudy"

type PDFAnnotationIntent =
	null |
	"FreeTextCallout" |
	"FreeTextTypeWriter" |
	"LineArrow" |
	"LineDimension" |
	"PloyLine" |
	"PolygonCloud" |
	"PolygonDimension" |
	"StampImage" |
	"StampSnapshot"

export class PDFAnnotation extends Userdata {
	static override readonly _drop = libmupdf._wasm_pdf_drop_annot

	_doc: PDFDocument

	/* IMPORTANT: Keep in sync with mupdf/pdf/annot.h and PDFAnnotation.java */
	static readonly ANNOT_TYPES: PDFAnnotationType[] = [
		"Text",
		"Link",
		"FreeText",
		"Line",
		"Square",
		"Circle",
		"Polygon",
		"PolyLine",
		"Highlight",
		"Underline",
		"Squiggly",
		"StrikeOut",
		"Redact",
		"Stamp",
		"Caret",
		"Ink",
		"Popup",
		"FileAttachment",
		"Sound",
		"Movie",
		"RichMedia",
		"Widget",
		"Screen",
		"PrinterMark",
		"TrapNet",
		"Watermark",
		"3D",
		"Projection",
	]

	static readonly LINE_ENDING: PDFAnnotationLineEndingStyle[] = [
		"None",
		"Square",
		"Circle",
		"Diamond",
		"OpenArrow",
		"ClosedArrow",
		"Butt",
		"ROpenArrow",
		"RClosedArrow",
		"Slash",
	]

	static readonly BORDER_STYLE: PDFAnnotationBorderStyle[] = [ "Solid", "Dashed", "Beveled", "Inset", "Underline" ]

	static readonly BORDER_EFFECT: PDFAnnotationBorderEffect[] = [ "None", "Cloudy" ]

	static readonly INTENT: PDFAnnotationIntent[] = [
		null,
		"FreeTextCallout",
		"FreeTextTypeWriter",
		"LineArrow",
		"LineDimension",
		"PloyLine",
		"PolygonCloud",
		"PolygonDimension",
		"StampImage",
		"StampSnapshot"
	]

	// Bit masks for getFlags and setFlags
	static readonly IS_INVISIBLE = 1 << (1 - 1)
	static readonly IS_HIDDEN = 1 << (2 - 1)
	static readonly IS_PRINT = 1 << (3 - 1)
	static readonly IS_NO_ZOOM = 1 << (4 - 1)
	static readonly IS_NO_ROTATE = 1 << (5 - 1)
	static readonly IS_NO_VIEW = 1 << (6 - 1)
	static readonly IS_READ_ONLY = 1 << (7 - 1)
	static readonly IS_LOCKED = 1 << (8 - 1)
	static readonly IS_TOGGLE_NO_VIEW = 1 << (9 - 1)
	static readonly IS_LOCKED_CONTENTS = 1 << (10 - 1)

	// PRIVATE
	constructor(doc: PDFDocument, pointer: Pointer) {
		super(pointer)
		this._doc = doc
	}

	getObject() {
		return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_annot_obj(this.pointer))
	}

	getBounds() {
		return fromRect(libmupdf._wasm_pdf_bound_annot(this.pointer))
	}

	run(device: Device, matrix: Matrix) {
		checkType(device, Device)
		checkMatrix(matrix)
		libmupdf._wasm_pdf_run_annot(this.pointer, device.pointer, MATRIX(matrix))
	}

	toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha = false) {
		checkMatrix(matrix)
		checkType(colorspace, ColorSpace)
		return new Pixmap(
			libmupdf._wasm_pdf_new_pixmap_from_annot(
				this.pointer,
				MATRIX(matrix),
				colorspace.pointer,
				alpha)
		)
	}

	toDisplayList() {
		return new DisplayList(libmupdf._wasm_pdf_new_display_list_from_annot(this.pointer))
	}

	update() {
		return !!libmupdf._wasm_pdf_update_annot(this.pointer)
	}

	getType() {
		let type = libmupdf._wasm_pdf_annot_type(this.pointer)
		return PDFAnnotation.ANNOT_TYPES[type] || "Text"
	}

	getLanguage() {
		return fromString(libmupdf._wasm_pdf_annot_language(this.pointer))
	}

	setLanguage(lang: string) {
		libmupdf._wasm_pdf_set_annot_language(this.pointer, STRING(lang))
	}

	getFlags() {
		return libmupdf._wasm_pdf_annot_flags(this.pointer)
	}

	setFlags(flags: number) {
		return libmupdf._wasm_pdf_set_annot_flags(this.pointer, flags)
	}

	getContents() {
		return fromString(libmupdf._wasm_pdf_annot_contents(this.pointer))
	}

	setContents(text: string) {
		libmupdf._wasm_pdf_set_annot_contents(this.pointer, STRING(text))
	}

	getAuthor() {
		return fromString(libmupdf._wasm_pdf_annot_author(this.pointer))
	}

	setAuthor(text: string) {
		libmupdf._wasm_pdf_set_annot_author(this.pointer, STRING(text))
	}

	getCreationDate() {
		return new Date(libmupdf._wasm_pdf_annot_creation_date(this.pointer) * 1000)
	}

	setCreationDate(date: Date) {
		checkType(date, Date)
		libmupdf._wasm_pdf_set_annot_creation_date(this.pointer, date.getTime() / 1000)
	}

	getModificationDate() {
		return new Date(libmupdf._wasm_pdf_annot_modification_date(this.pointer) * 1000)
	}

	setModificationDate(date: Date) {
		checkType(date, Date)
		libmupdf._wasm_pdf_set_annot_modification_date(this.pointer, date.getTime() / 1000)
	}

	hasRect() {
		return !!libmupdf._wasm_pdf_annot_has_rect(this.pointer)
	}
	hasInkList() {
		return !!libmupdf._wasm_pdf_annot_has_ink_list(this.pointer)
	}
	hasQuadPoints() {
		return !!libmupdf._wasm_pdf_annot_has_quad_points(this.pointer)
	}
	hasVertices() {
		return !!libmupdf._wasm_pdf_annot_has_vertices(this.pointer)
	}
	hasLine() {
		return !!libmupdf._wasm_pdf_annot_has_line(this.pointer)
	}
	hasInteriorColor() {
		return !!libmupdf._wasm_pdf_annot_has_interior_color(this.pointer)
	}
	hasLineEndingStyles() {
		return !!libmupdf._wasm_pdf_annot_has_line_ending_styles(this.pointer)
	}
	hasBorder() {
		return !!libmupdf._wasm_pdf_annot_has_border(this.pointer)
	}
	hasBorderEffect() {
		return !!libmupdf._wasm_pdf_annot_has_border_effect(this.pointer)
	}
	hasIcon() {
		return !!libmupdf._wasm_pdf_annot_has_icon_name(this.pointer)
	}
	hasOpen() {
		return !!libmupdf._wasm_pdf_annot_has_open(this.pointer)
	}
	hasAuthor() {
		return !!libmupdf._wasm_pdf_annot_has_author(this.pointer)
	}
	hasFilespec() {
		return !!libmupdf._wasm_pdf_annot_has_filespec(this.pointer)
	}

	getRect() {
		return fromRect(libmupdf._wasm_pdf_annot_rect(this.pointer))
	}

	setRect(rect: Rect) {
		checkRect(rect)
		libmupdf._wasm_pdf_set_annot_rect(this.pointer, RECT(rect))
	}

	getPopup() {
		return fromRect(libmupdf._wasm_pdf_annot_popup(this.pointer))
	}

	setPopup(rect: Rect) {
		checkRect(rect)
		libmupdf._wasm_pdf_set_annot_popup(this.pointer, RECT(rect))
	}

	getIsOpen() {
		return !!libmupdf._wasm_pdf_annot_is_open(this.pointer)
	}

	setIsOpen(isOpen: boolean) {
		checkType(isOpen, "boolean")
		libmupdf._wasm_pdf_set_annot_is_open(this.pointer, isOpen)
	}

	getHiddenForEditing() {
		return !!libmupdf._wasm_pdf_annot_hidden_for_editing(this.pointer)
	}

	setHiddenForEditing(isHidden: boolean) {
		checkType(isHidden, "boolean")
		libmupdf._wasm_pdf_set_annot_hidden_for_editing(this.pointer, isHidden)
	}

	getIcon() {
		return fromString(libmupdf._wasm_pdf_annot_icon_name(this.pointer))
	}

	setIcon(text: string) {
		checkType(text, "string")
		libmupdf._wasm_pdf_set_annot_icon_name(this.pointer, STRING(text))
	}

	getOpacity() {
		return libmupdf._wasm_pdf_annot_opacity(this.pointer)
	}

	setOpacity(opacity: number) {
		checkType(opacity, "number")
		libmupdf._wasm_pdf_set_annot_opacity(this.pointer, opacity)
	}

	getQuadding() {
		return libmupdf._wasm_pdf_annot_quadding(this.pointer)
	}

	setQuadding(quadding: number) {
		checkType(quadding, "number")
		libmupdf._wasm_pdf_set_annot_quadding(this.pointer, quadding)
	}

	getLine() {
		let a = fromPoint(libmupdf._wasm_pdf_annot_line_1(this.pointer))
		let b = fromPoint(libmupdf._wasm_pdf_annot_line_2(this.pointer))
		return [ a, b ]
	}

	setLine(a: Point, b: Point) {
		checkPoint(a)
		checkPoint(b)
		libmupdf._wasm_pdf_set_annot_line(this.pointer, POINT(a), POINT2(b))
	}

	getLineEndingStyles() {
		let a = libmupdf._wasm_pdf_annot_line_ending_styles_start(this.pointer)
		let b = libmupdf._wasm_pdf_annot_line_ending_styles_end(this.pointer)
		return {
			start: PDFAnnotation.LINE_ENDING[a] || "None",
			end: PDFAnnotation.LINE_ENDING[b] || "None",
		}
	}

	setLineEndingStyles(start: PDFAnnotationLineEndingStyle, end: PDFAnnotationLineEndingStyle) {
		let start_ix = ENUM<PDFAnnotationLineEndingStyle>(start, PDFAnnotation.LINE_ENDING)
		let end_ix = ENUM<PDFAnnotationLineEndingStyle>(end, PDFAnnotation.LINE_ENDING)
		return libmupdf._wasm_pdf_set_annot_line_ending_styles(this.pointer, start_ix, end_ix)
	}

	getColor() {
		return fromColor(libmupdf._wasm_pdf_annot_color(this.pointer, COLOR()))
	}

	getInteriorColor() {
		return fromColor(libmupdf._wasm_pdf_annot_interior_color(this.pointer, COLOR()))
	}

	setColor(color: Color) {
		checkColor(color)
		libmupdf._wasm_pdf_set_annot_color(this.pointer, color.length, COLOR(color))
	}

	setInteriorColor(color: Color) {
		checkColor(color)
		libmupdf._wasm_pdf_set_annot_interior_color(this.pointer, color.length, COLOR(color))
	}

	getBorderWidth() {
		return libmupdf._wasm_pdf_annot_border_width(this.pointer)
	}

	setBorderWidth(value: number) {
		checkType(value, "number")
		return libmupdf._wasm_pdf_set_annot_border_width(this.pointer, value)
	}

	getBorderStyle() {
		return PDFAnnotation.BORDER_STYLE[libmupdf._wasm_pdf_annot_border_style(this.pointer)] || "Solid"
	}

	setBorderStyle(value: PDFAnnotationBorderStyle) {
		let value_ix = ENUM<PDFAnnotationBorderStyle>(value, PDFAnnotation.BORDER_STYLE)
		return libmupdf._wasm_pdf_set_annot_border_style(this.pointer, value_ix)
	}

	getBorderEffect() {
		return PDFAnnotation.BORDER_EFFECT[libmupdf._wasm_pdf_annot_border_effect(this.pointer)] || "None"
	}

	setBorderEffect(value: PDFAnnotationBorderEffect) {
		let value_ix = ENUM<PDFAnnotationBorderEffect>(value, PDFAnnotation.BORDER_EFFECT)
		return libmupdf._wasm_pdf_set_annot_border_effect(this.pointer, value_ix)
	}

	getBorderEffectIntensity() {
		return libmupdf._wasm_pdf_annot_border_effect_intensity(this.pointer)
	}

	setBorderEffectIntensity(value: number) {
		checkType(value, "number")
		return libmupdf._wasm_pdf_set_annot_border_effect_intensity(this.pointer, value)
	}

	getBorderDashCount() {
		return libmupdf._wasm_pdf_annot_border_dash_count(this.pointer)
	}

	getBorderDashItem(idx: number) {
		return libmupdf._wasm_pdf_annot_border_dash_item(this.pointer, idx)
	}

	clearBorderDash() {
		return libmupdf._wasm_pdf_clear_annot_border_dash(this.pointer)
	}

	addBorderDashItem(v: number) {
		checkType(v, "number")
		return libmupdf._wasm_pdf_add_annot_border_dash_item(this.pointer, v)
	}

	getBorderDashPattern() {
		let n = this.getBorderDashCount()
		let result = new Array(n)
		for (let i = 0; i < n; ++i)
			result[i] = this.getBorderDashItem(i)
		return result
	}

	setBorderDashPattern(list: number[]) {
		this.clearBorderDash()
		for (let v of list)
			this.addBorderDashItem(v)
	}

	getIntent(): PDFAnnotationIntent {
		return PDFAnnotation.INTENT[libmupdf._wasm_pdf_annot_intent(this.pointer)] || null
	}

	setIntent(value: PDFAnnotationIntent) {
		let value_ix = ENUM<PDFAnnotationIntent>(value, PDFAnnotation.INTENT)
		return libmupdf._wasm_pdf_set_annot_intent(this.pointer, value_ix)
	}

	setDefaultAppearance(fontName: string, size: number, color: Color) {
		checkType(fontName, "string")
		checkType(size, "number")
		checkColor(color)
		libmupdf._wasm_pdf_set_annot_default_appearance(this.pointer, STRING(fontName), size, color.length, COLOR(color))
	}

	getDefaultAppearance() {
		let font = fromString(libmupdf._wasm_pdf_annot_default_appearance_font(this.pointer))
		let size = libmupdf._wasm_pdf_annot_default_appearance_size(this.pointer)
		let color = fromColor(libmupdf._wasm_pdf_annot_default_appearance_color(this.pointer, COLOR()))
		return { font, size, color }
	}

	getFileSpec() {
		return this._doc._fromPDFObjectKeep(libmupdf._wasm_pdf_annot_filespec(this.pointer))
	}

	setFileSpec(fs: PDFObject) {
		return libmupdf._wasm_pdf_set_annot_filespec(this.pointer, this._doc._PDFOBJ(fs))
	}

	getQuadPoints() {
		let n = libmupdf._wasm_pdf_annot_quad_point_count(this.pointer)
		let result: Quad[] = []
		for (let i = 0; i < n; ++i)
			result.push(fromQuad(libmupdf._wasm_pdf_annot_quad_point(this.pointer, i)))
		return result
	}

	clearQuadPoints() {
		libmupdf._wasm_pdf_clear_annot_quad_points(this.pointer)
	}

	addQuadPoint(quad: Quad) {
		checkQuad(quad)
		libmupdf._wasm_pdf_add_annot_quad_point(this.pointer, QUAD(quad))
	}

	setQuadPoints(quadlist: Quad[]) {
		this.clearQuadPoints()
		for (let quad of quadlist)
			this.addQuadPoint(quad)
	}

	getVertices() {
		let n = libmupdf._wasm_pdf_annot_vertex_count(this.pointer)
		let result: Point[] = new Array(n)
		for (let i = 0; i < n; ++i)
			result[i] = fromPoint(libmupdf._wasm_pdf_annot_vertex(this.pointer, i))
		return result
	}

	clearVertices() {
		libmupdf._wasm_pdf_clear_annot_vertices(this.pointer)
	}

	addVertex(vertex: Point) {
		checkPoint(vertex)
		libmupdf._wasm_pdf_add_annot_vertex(this.pointer, POINT(vertex))
	}

	setVertices(vertexlist: Point[]) {
		this.clearVertices()
		for (let vertex of vertexlist)
			this.addVertex(vertex)
	}

	getInkList() {
		let n = libmupdf._wasm_pdf_annot_ink_list_count(this.pointer)
		let outer: Point[][] = []
		for (let i = 0; i < n; ++i) {
			let m = libmupdf._wasm_pdf_annot_ink_list_stroke_count(this.pointer, i)
			let inner: Point[] = new Array(m)
			for (let k = 0; k < m; ++k)
				inner[k] = fromPoint(libmupdf._wasm_pdf_annot_ink_list_stroke_vertex(this.pointer, i, k))
			outer.push(inner)
		}
		return outer
	}

	clearInkList() {
		libmupdf._wasm_pdf_clear_annot_ink_list(this.pointer)
	}

	addInkListStroke() {
		libmupdf._wasm_pdf_add_annot_ink_list_stroke(this.pointer)
	}

	addInkListStrokeVertex(v: Point) {
		checkPoint(v)
		libmupdf._wasm_pdf_add_annot_ink_list_stroke_vertex(this.pointer, POINT(v))
	}

	setInkList(inklist: Point[][]) {
		this.clearInkList()
		for (let stroke of inklist) {
			this.addInkListStroke()
			for (let vertex of stroke)
				this.addInkListStrokeVertex(vertex)
		}
	}

	setAppearanceFromDisplayList(appearance: string | null, state: string | null, transform: Matrix, list: DisplayList) {
		checkMatrix(transform)
		checkType(list, DisplayList)
		libmupdf._wasm_pdf_set_annot_appearance_from_display_list(
			this.pointer,
			appearance ? STRING(appearance) : 0,
			state ? STRING2(state) : 0,
			MATRIX(transform),
			list.pointer
		)
	}

	setAppearance(appearance: string | null, state: string | null, transform: Matrix, bbox: Rect, resources: any, contents: AnyBuffer) {
		checkMatrix(transform)
		checkRect(bbox)
		libmupdf._wasm_pdf_set_annot_appearance(
			this.pointer,
			appearance ? STRING(appearance) : 0,
			state ? STRING2(state) : 0,
			MATRIX(transform),
			RECT(bbox),
			this._doc._PDFOBJ(resources),
			BUFFER(contents)
		)
	}

	applyRedaction(black_boxes = 1, image_method = 2) {
		libmupdf._wasm_pdf_apply_redaction(this.pointer, black_boxes, image_method)
	}
}

export class PDFWidget extends PDFAnnotation {
	/* IMPORTANT: Keep in sync with mupdf/pdf/widget.h and PDFWidget.java */
	static readonly WIDGET_TYPES = [
		"button",
		"button",
		"checkbox",
		"combobox",
		"listbox",
		"radiobutton",
		"signature",
		"text",
	]

	/* Field flags */
	static readonly FIELD_IS_READ_ONLY = 1
	static readonly FIELD_IS_REQUIRED = 1 << 1
	static readonly FIELD_IS_NO_EXPORT = 1 << 2

	/* Text fields */
	static readonly TX_FIELD_IS_MULTILINE = 1 << 12
	static readonly TX_FIELD_IS_PASSWORD = 1 << 13
	static readonly TX_FIELD_IS_COMB = 1 << 24

	/* Button fields */
	static readonly BTN_FIELD_IS_NO_TOGGLE_TO_OFF = 1 << 14
	static readonly BTN_FIELD_IS_RADIO = 1 << 15
	static readonly BTN_FIELD_IS_PUSHBUTTON = 1 << 16

	/* Choice fields */
	static readonly CH_FIELD_IS_COMBO = 1 << 17
	static readonly CH_FIELD_IS_EDIT = 1 << 18
	static readonly CH_FIELD_IS_SORT = 1 << 19
	static readonly CH_FIELD_IS_MULTI_SELECT = 1 << 21

	getFieldType() {
		return PDFWidget.WIDGET_TYPES[libmupdf._wasm_pdf_annot_field_type(this.pointer)] || "button"
	}

	isButton() {
		let type = this.getFieldType()
		return type === "button" || type === "checkbox" || type === "radiobutton"
	}

	isPushButton() {
		return this.getFieldType() === "button"
	}

	isCheckbox() {
		return this.getFieldType() === "checkbox"
	}

	isRadioButton() {
		return this.getFieldType() === "radiobutton"
	}

	isText() {
		return this.getFieldType() === "text"
	}

	isChoice() {
		let type = this.getFieldType()
		return type === "combobox" || type === "listbox"
	}

	isListBox() {
		return this.getFieldType() === "listbox"
	}

	isComboBox() {
		return this.getFieldType() === "combobox"
	}

	getFieldFlags() {
		return libmupdf._wasm_pdf_annot_field_flags(this.pointer)
	}

	isMultiline() {
		return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_MULTILINE) !== 0
	}

	isPassword() {
		return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_PASSWORD) !== 0
	}

	isComb() {
		return (this.getFieldFlags() & PDFWidget.TX_FIELD_IS_COMB) !== 0
	}

	isReadOnly() {
		return (this.getFieldFlags() & PDFWidget.FIELD_IS_READ_ONLY) !== 0
	}

	getLabel() {
		return fromString(libmupdf._wasm_pdf_annot_field_label(this.pointer))
	}

	getName() {
		return fromStringFree(libmupdf._wasm_pdf_load_field_name(this.pointer))
	}

	getValue() {
		return fromString(libmupdf._wasm_pdf_annot_field_value(this.pointer))
	}

	setTextValue(value: string) {
		libmupdf._wasm_pdf_set_annot_text_field_value(this.pointer, STRING(value))
	}

	getMaxLen() {
		return libmupdf._wasm_pdf_annot_text_widget_max_len(this.pointer)
	}

	setChoiceValue(value: string) {
		libmupdf._wasm_pdf_set_annot_choice_field_value(this.pointer, STRING(value))
	}

	getOptions(isExport=false) {
		let result: string[] = []
		let n = libmupdf._wasm_pdf_annot_choice_field_option_count(this.pointer)
		for (let i = 0; i < n; ++i) {
			result.push(
				fromString(
					libmupdf._wasm_pdf_annot_choice_field_option(this.pointer, isExport, i)
				)
			)
		}
		return result
	}

	toggle() {
		libmupdf._wasm_pdf_toggle_widget(this.pointer)
	}

	// Interactive Text Widget editing in a GUI.
	// TODO: getEditingState()
	// TODO: setEditingState()
	// TODO: clearEditingState()
	// TODO: layoutTextWidget()

	// Interactive form validation Javascript triggers.
	// NOTE: No embedded PDF Javascript engine in WASM build.
	// TODO: eventEnter()
	// TODO: eventExit()
	// TODO: eventDown()
	// TODO: eventUp()
	// TODO: eventFocus()
	// TODO: eventBlur()

	// NOTE: No OpenSSL support in WASM build.
	// TODO: isSigned()
	// TODO: validateSignature()
	// TODO: checkCertificate()
	// TODO: checkDigest()
	// TODO: getSignature()
	// TODO: previewSignature()
	// TODO: clearSignature()
	// TODO: sign()
}

/* -------------------------------------------------------------------------- */

export class TryLaterError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "TryLaterError"
	}
}

export class AbortError extends Error {
	constructor(message: string) {
		super(message)
		this.name = "AbortError"
	}
}

export class Stream extends Userdata {
	static override readonly _drop = libmupdf._wasm_drop_stream
	constructor(url: string, contentLength: number, block_size: number, prefetch: number) {
		super(libmupdf._wasm_open_stream_from_url(STRING(url), contentLength, block_size, prefetch))
	}
}
