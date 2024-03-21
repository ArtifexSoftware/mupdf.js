// cat src/mupdf.c | sed '/#include/d' | cpp | node gen-wasm-type.js

"use strict"

import fs from "fs"

console.log(`export default libmupdf_wasm
declare function libmupdf_wasm(): Promise<Libmupdf>
type Pointer = number
interface Libmupdf {
	UTF8ToString(ptr: Pointer): string,
	stringToUTF8(str: string, outPtr: Pointer, maxBytesToWrite: number): number,
	lengthBytesUTF8(str: string): number,
	HEAP8: Int8Array,
	HEAP16: Int16Array,
	HEAPU8: Uint8Array,
	HEAPU16: Uint16Array,
	HEAP32: Int32Array,
	HEAPU32: Uint32Array,
	HEAPF32: Float32Array,
	HEAPF64: Float64Array,
`)

const TYPE = {
	size_t: "number",
	int: "number",
	float: "number",
	double: "number",
}

let lines = fs.readFileSync(0, "utf-8").split("\n")
let dump = false
for (let line of lines) {
	if (dump) {
		line.split(";").map(parse_function_signature)
		dump = false
	}
	else if (line === "EMSCRIPTEN_KEEPALIVE")
		dump = true
	else if (line.startsWith("EMSCRIPTEN_KEEPALIVE")) {
		line.split("EMSCRIPTEN_KEEPALIVE").map(chunk => chunk.replace(/{.*}/, "").replaceAll(";", "").trim()).map(parse_function_signature)
	}
}

function map_type(raw) {
	return TYPE[raw] || raw
}

function parse_type_name(str) {
	let is_ptr = str.includes("*")
	let list = str.replaceAll("*", "").split(/ +/g)
	let name = list.pop()
	let type = map_type(list.join(" "))
	if (is_ptr)
		type = "Pointer"
	return [ type, name ]
}

function parse_function_signature(line) {
	if (!line.includes("("))
		return

	line = line.replaceAll("const ", " ")
	line = line.replaceAll("unsigned ", " ")
	line = line.replaceAll("signed ", " ")

	let [ret, args] = line.split("(")
	args = args.replace(")", "").split(",").map(x => x.trim())

	let [ ret_type, ret_name ] = parse_type_name(ret)

	let outarg = []
	for (let arg of args) {
		if (arg !== "void") {
			let [ arg_type, arg_name ] = parse_type_name(arg)
			outarg.push(arg_name + ": " + arg_type)
		}
	}

	console.log(`\t_${ret_name}(${outarg.join(", ")}): ${ret_type},`)
}

console.log("}")
