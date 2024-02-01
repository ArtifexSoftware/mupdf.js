// Copyright (C) 2022, 2024 Artifex Software, Inc.
//
// This file is part of MuPDF.
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

// FAST SORTED ARRAY FUNCTIONS

function array_remove(array, index) {
	let n = array.length
	for (let i = index + 1; i < n; ++i)
		array[i - 1] = array[i]
	array.length = n - 1
}

function array_insert(array, index, item) {
	for (let i = array.length; i > index; --i)
		array[i] = array[i - 1]
	array[index] = item
}

function set_add(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else
			return
	}
	array_insert(set, a, item)
}

function set_delete(set, item) {
	let a = 0
	let b = set.length - 1
	while (a <= b) {
		let m = (a + b) >> 1
		let x = set[m]
		if (item < x)
			b = m - 1
		else if (item > x)
			a = m + 1
		else {
			array_remove(set, m)
			return
		}
	}
}

// LOADING AND ERROR MESSAGES

function show_message(msg) {
	document.getElementById("message").textContent = msg
}

function clear_message() {
	document.getElementById("message").textContent = ""
}

function die(error) {
	show_message(error.name + ": " + error.message)
	console.error(error)
}

// MENU BAR

function close_all_menus(self) {
	for (let node of document.querySelectorAll("header > details"))
		if (node !== self)
			node.removeAttribute("open")
}

/* close menu if opening another */
for (let node of document.querySelectorAll("header > details")) {
	node.addEventListener("click", function () {
		close_all_menus(node)
	})
}

/* close menu after selecting something */
for (let node of document.querySelectorAll("header > details > menu")) {
	node.addEventListener("click", function () {
		close_all_menus(null)
	})
}

/* click anywhere outside the menu to close it */
window.addEventListener("mousedown", function (evt) {
	let e = evt.target
	while (e) {
		if (e.tagName === "DETAILS")
			return
		e = e.parentElement
	}
	close_all_menus(null)
})

/* close menus if window loses focus */
window.addEventListener("blur", function () {
	close_all_menus(null)
})

// BACKGROUND WORKER

const worker = new Worker("worker.js")

worker._promise_id = 1
worker._promise_map = new Map()

worker.wrap = function (name) {
	return function (...args) {
		return new Promise(function (resolve, reject) {
			let id = worker._promise_id++
			worker._promise_map.set(id, { resolve, reject })
			if (args[0] instanceof ArrayBuffer)
				worker.postMessage([ name, id, args ], [ args[0] ])
			else
				worker.postMessage([ name, id, args ])
		})
	}
}

worker.onmessage = function (event) {
	let [ type, id, result ] = event.data
	let error

	switch (type) {
	case "INIT":
		for (let method of result)
			worker[method] = worker.wrap(method)
		main()
		break

	case "RESULT":
		worker._promise_map.get(id).resolve(result)
		worker._promise_map.delete(id)
		break

	case "ERROR":
		error = new Error(result.message)
		error.name = result.name
		error.stack = result.stack
		worker._promise_map.get(id).reject(error)
		worker._promise_map.delete(id)
		break

	default:
		error = new Error(`Invalid message '${type}'`)
		worker._promise_map.get(id).reject(error)
		break
	}
}

// PAGE VIEW

class PageView {
	constructor(doc, pageNumber, defaultSize, dpi) {
		this.doc = doc
		this.pageNumber = pageNumber // 0-based
		this.size = defaultSize
		this.sizeIsDefault = true

		const rootNode = document.createElement("div")
		rootNode.classList.add("page")
		rootNode.id = "page" + (pageNumber+1)
		rootNode.pageNumber = pageNumber
		rootNode.page = this

		const canvasNode = document.createElement("canvas")
		rootNode.appendChild(canvasNode)

		this.rootNode = rootNode
		this.canvasNode = canvasNode
		this.canvasCtx = canvasNode.getContext("2d")
		this._updateSize(dpi)

		this.renderPromise = null
		this.queuedRenderArgs = null

		this.textNode = null
		this.textPromise = null
		this.textResultObject = null

		this.linksNode = null
		this.linksPromise = null
		this.linksResultObject = null

		this.searchHitsNode = null
		this.searchPromise = null
		this.searchResultObject = null
		this.lastSearchNeedle = null
		this.searchNeedle = null
	}

	// TODO - move searchNeedle out
	render(dpi, searchNeedle) {
		// TODO: only render if changed
		// TODO - error handling
		this._loadPageImg({ dpi })
		this._loadPageText(dpi)
		this._loadPageLinks(dpi)
		this._loadPageSearch(dpi, searchNeedle)
	}

	// TODO - update child nodes
	setZoom(zoomLevel) {
		this._updateSize(zoomLevel)
	}

	setSearchNeedle(searchNeedle = null) {
		this.searchNeedle = searchNeedle
	}

	// TODO - this is destructive and makes other method get null ref errors
	showError(functionName, error) {
		console.error(`mupdf.${functionName}: ${error.message}:\n${error.stack}`)

		let div = document.createElement("div")
		div.classList.add("error")
		div.textContent = error.name + ": " + error.message
		this.rootNode.replaceChildren(div)
	}


	// --- INTERNAL METHODS ---

	// TODO - remove dpi param
	_updateSize(dpi) {
		// We use the `foo | 0` notation to convert dimensions to integers.
		// This matches the conversion done in `mupdf.js` when `Pixmap.withBbox`
		// calls `libmupdf._wasm_new_pixmap_with_bbox`.
		this.rootNode.style.width = (((this.size.width * dpi) / 72) | 0) + "px"
		this.rootNode.style.height = (((this.size.height * dpi) / 72) | 0) + "px"
		this.canvasNode.style.width = (((this.size.width * dpi) / 72) | 0) + "px"
		this.canvasNode.style.height = (((this.size.height * dpi) / 72) | 0) + "px"
	}

	async _loadPageImg(renderArgs) {
		if (this.renderPromise != null || this.renderIsOngoing) {
			// If a render is ongoing, we mark the current arguments as queued
			// to be processed when the render ends.
			// This also erases any previous queued render arguments.
			this.queuedRenderArgs = renderArgs
			return
		}
		if (this.canvasNode?.renderArgs != null) {
			// If the current image node was rendered with the same arguments
			// we skip the render.
			if (renderArgs.dpi === this.canvasNode.renderArgs.dpi)
				return
		}

		let { dpi } = renderArgs

		try {
			// FIXME - find better system for skipping duplicate renders
			this.renderIsOngoing = true

			if (this.sizeIsDefault) {
				this.size = await worker.getPageSize(this.doc, this.pageNumber)
				this.sizeIsDefault = false
				this._updateSize(dpi)
			}

			this.renderPromise = worker.drawPageAsPixmap(this.doc, this.pageNumber, dpi * devicePixelRatio)
			let imageData = await this.renderPromise

			// if render was aborted, return early
			if (imageData == null)
				return

			this.canvasNode.renderArgs = renderArgs
			this.canvasNode.width = imageData.width
			this.canvasNode.height = imageData.height
			this.canvasCtx.putImageData(imageData, 0, 0)
		} catch (error) {
			this.showError("_loadPageImg", error)
		} finally {
			this.renderPromise = null
			this.renderIsOngoing = false
		}

		if (this.queuedRenderArgs != null) {
			// TODO - Error handling
			this._loadPageImg(this.queuedRenderArgs)
			this.queuedRenderArgs = null
		}
	}

	_invalidatePageImg() {
		if (this.canvasNode)
			this.canvasNode.renderArgs = null
	}

	// TODO - replace "dpi" with "scale"?
	async _loadPageText(dpi) {
		// TODO - Disable text when editing (conditions to be figured out)
		if (this.textNode != null && dpi === this.textNode.dpi) {
			// Text was already rendered at the right scale, nothing to be done
			return
		}
		if (this.textResultObject) {
			// Text was already returned, just needs to be rescaled
			this._applyPageText(this.textResultObject, dpi)
			return
		}

		let textNode = document.createElement("div")
		textNode.classList.add("text")

		this.textNode?.remove()
		this.textNode = textNode
		this.rootNode.appendChild(textNode)

		try {
			this.textPromise = worker.getPageText(this.doc, this.pageNumber)

			this.textResultObject = await this.textPromise
			this._applyPageText(this.textResultObject, dpi)
		} catch (error) {
			this.showError("_loadPageText", error)
		} finally {
			this.textPromise = null
		}
	}

	_applyPageText(textResultObject, dpi) {
		this.textNode.dpi = dpi
		let nodes = []
		let pdf_w = []
		let html_w = []
		let text_len = []
		let scale = dpi / 72
		this.textNode.replaceChildren()
		for (let block of textResultObject.blocks) {
			if (block.type === "text") {
				for (let line of block.lines) {
					let text = document.createElement("span")
					text.style.left = line.bbox.x * scale + "px"
					text.style.top = (line.y - line.font.size * 0.8) * scale + "px"
					text.style.height = line.bbox.h * scale + "px"
					text.style.fontSize = line.font.size * scale + "px"
					text.style.fontFamily = line.font.family
					text.style.fontWeight = line.font.weight
					text.style.fontStyle = line.font.style
					text.textContent = line.text
					this.textNode.appendChild(text)
					nodes.push(text)
					pdf_w.push(line.bbox.w * scale)
					text_len.push(line.text.length - 1)
				}
			}
		}
		for (let i = 0; i < nodes.length; ++i) {
			if (text_len[i] > 0)
				html_w[i] = nodes[i].clientWidth
		}
		for (let i = 0; i < nodes.length; ++i) {
			if (text_len[i] > 0)
				nodes[i].style.letterSpacing = (pdf_w[i] - html_w[i]) / text_len[i] + "px"
		}
	}

	async _loadPageLinks(dpi) {
		if (this.linksNode != null && dpi === this.linksNode.dpi) {
			// Links were already rendered at the right scale, nothing to be done
			return
		}
		if (this.linksResultObject) {
			// Links were already returned, just need to be rescaled
			this._applyPageLinks(this.linksResultObject, dpi)
			return
		}

		let linksNode = document.createElement("div")
		linksNode.classList.add("links")

		// TODO - Figure out node order
		this.linksNode?.remove()
		this.linksNode = linksNode
		this.rootNode.appendChild(linksNode)

		try {
			this.linksPromise = worker.getPageLinks(this.doc, this.pageNumber)

			this.linksResultObject = await this.linksPromise
			this._applyPageLinks(this.linksResultObject, dpi)
		} catch (error) {
			this.showError("_loadPageLinks", error)
		} finally {
			this.linksPromise = null
		}
	}

	_applyPageLinks(linksResultObject, dpi) {
		let scale = dpi / 72
		this.linksNode.dpi = dpi
		this.linksNode.replaceChildren()
		for (let link of linksResultObject) {
			let a = document.createElement("a")
			a.href = link.href
			a.style.left = link.x * scale + "px"
			a.style.top = link.y * scale + "px"
			a.style.width = link.w * scale + "px"
			a.style.height = link.h * scale + "px"
			this.linksNode.appendChild(a)
		}
	}

	async _loadPageSearch(dpi, searchNeedle) {
		if (
			this.searchHitsNode != null &&
			dpi === this.searchHitsNode.dpi &&
			searchNeedle == this.searchHitsNode.searchNeedle
		) {
			// Search results were already rendered at the right scale, nothing to be done
			return
		}
		if (this.searchResultObject && searchNeedle == this.searchHitsNode.searchNeedle) {
			// Search results were already returned, just need to be rescaled
			this._applyPageSearch(this.searchResultObject, dpi)
			return
		}

		// TODO - cancel previous load

		let searchHitsNode = document.createElement("div")
		searchHitsNode.classList.add("searchHitList")
		this.searchHitsNode?.remove()
		this.searchHitsNode = searchHitsNode
		this.rootNode.appendChild(searchHitsNode)

		this.searchNeedle = searchNeedle ?? ""

		try {
			if (this.searchNeedle !== "") {
				console.log("SEARCH", this.pageNumber, JSON.stringify(this.searchNeedle))
				this.searchPromise = worker.search(this.doc, this.pageNumber, this.searchNeedle)
				this.searchResultObject = await this.searchPromise
			} else {
				this.searchResultObject = []
			}

			this._applyPageSearch(this.searchResultObject, searchNeedle, dpi)
		} catch (error) {
			this.showError("_loadPageSearch", error)
		} finally {
			this.searchPromise = null
		}
	}

	_applyPageSearch(searchResultObject, searchNeedle, dpi) {
		let scale = dpi / 72
		this.searchHitsNode.searchNeedle = searchNeedle
		this.searchHitsNode.dpi = dpi
		this.searchHitsNode.replaceChildren()
		for (let bbox of searchResultObject) {
			let div = document.createElement("div")
			div.classList.add("searchHit")
			div.style.left = bbox.x * scale + "px"
			div.style.top = bbox.y * scale + "px"
			div.style.width = bbox.w * scale + "px"
			div.style.height = bbox.h * scale + "px"
			this.searchHitsNode.appendChild(div)
		}
	}

	_getLocalCoords(clientX, clientY) {
		const canvas = this.canvasNode
		let x = clientX - canvas.getBoundingClientRect().left - canvas.clientLeft + canvas.scrollLeft
		let y = clientY - canvas.getBoundingClientRect().top - canvas.clientTop + canvas.scrollTop
		return { x, y }
	}
}

// DOCUMENT VIEW

var current_doc = 0
var current_zoom = 96

var page_list = null // all pages in document

// Track page visibility as the user scrolls through the document.
// When a page comes near the viewport, we add it to the list of
// "visible" pages and queue up rendering it.
var page_visible = []
var page_observer = new IntersectionObserver(
	function (entries) {
		for (let entry of entries) {
			if (entry.isIntersecting)
				set_add(page_visible, entry.target.pageNumber)
			else
				set_delete(page_visible, entry.target.pageNumber)
		}
		queue_update_view()
	},
	{
		// This means we have 3 viewports of vertical "head start" where
		// the page is rendered before it becomes visible.
		root: document.getElementById("page-panel"),
		rootMargin: "25% 0px 300% 0px",
	}
)


// Timer that waits until things settle before kicking off rendering.
var update_view_timer = 0
function queue_update_view() {
	if (update_view_timer)
		clearTimeout(update_view_timer)
	update_view_timer = setTimeout(update_view, 50)
}

function update_view() {
	if (update_view_timer)
		clearTimeout(update_view_timer)
	update_view_timer = 0

	for (let i of page_visible)
		page_list[i].render(current_zoom, current_search_needle)
}

function find_visible_page() {
	let panel = document.getElementById("page-panel").getBoundingClientRect()
	let panel_mid = (panel.top + panel.bottom) / 2
	for (let p of page_visible) {
		let rect = page_list[p].rootNode.getBoundingClientRect()
		if (rect.top <= panel_mid && rect.bottom >= panel_mid)
			return p
	}
	return page_visible[0]
}

function zoom_in() {
	zoom_to(Math.min(current_zoom + 12, 384))
}

function zoom_out() {
	zoom_to(Math.max(current_zoom - 12, 48))
}

function zoom_to(new_zoom) {
	if (current_zoom === new_zoom)
		return
	current_zoom = new_zoom

	// TODO: keep page coord at center of cursor in place when zooming

	let p = find_visible_page()

	for (let page of page_list)
		page.setZoom(current_zoom)

	page_list[p].rootNode.scrollIntoView()

	queue_update_view()
}

// KEY BINDINGS & MOUSE WHEEL ZOOM

window.addEventListener("wheel",
	function (event) {
		// Intercept Ctl+MOUSEWHEEL that change browser zoom.
		// Our page rendering requires a 1-to-1 pixel scale.
		if (event.ctrlKey || event.metaKey) {
			if (event.deltaY < 0)
				zoom_in()
			else if (event.deltaY > 0)
				zoom_out()
			event.preventDefault()
		}
	},
	{ passive: false }
)

window.addEventListener("keydown", function (event) {
	// Intercept and override some keyboard shortcuts.
	// We must override the Ctl-PLUS and Ctl-MINUS shortcuts that change browser zoom.
	// Our page rendering requires a 1-to-1 pixel scale.
	if (event.ctrlKey || event.metaKey) {
		switch (event.keyCode) {
		// '=' / '+' on various keyboards
		case 61:
		case 107:
		case 187:
		case 171:
			zoom_in()
			event.preventDefault()
			break
		// '-'
		case 173:
		case 109:
		case 189:
			zoom_out()
			event.preventDefault()
			break
		// '0'
		case 48:
		case 96:
			zoom_to(100)
			break

		// 'F'
		case 70:
			show_search_panel()
			event.preventDefault()
			break

		// 'G'
		case 71:
			show_search_panel()
			run_search(event.shiftKey ? -1 : 1)
			event.preventDefault()
			break
		}
	}

	if (event.key === "Escape") {
		hide_search_panel()
	}
})

function toggle_fullscreen() {
	// Safari on iPhone doesn't support Fullscreen
	if (typeof document.documentElement.requestFullscreen !== "function")
		return
	if (document.fullscreenElement)
		document.exitFullscreen()
	else
		document.documentElement.requestFullscreen()
}

// SEARCH

let search_panel = document.getElementById("search-panel")
let search_status = document.getElementById("search-status")
let search_input = document.getElementById("search-input")

var current_search_needle = ""
var current_search_page = 0

search_input.oninput = function (event) {
	set_search_needle(event.target.value)
}

search_input.onkeydown = function (event) {
	if (event.key == "Enter")
		run_search(event.shiftKey ? -1 : 1)
}

function show_search_panel() {
	if (!page_list)
		return
	search_panel.style.display = ""
	search_input.focus()
	search_input.select()
}

function hide_search_panel() {
	search_panel.style.display = "none"
	search_input.value = ""
	set_search_needle("")
}

function set_search_needle(needle) {
	if (current_search_needle !== needle) {
		search_status.textContent = ""
		current_search_needle = needle
		update_view()
	}
}

async function run_search(direction) {
	// start search from visible page
	current_search_page = find_visible_page()
	try {
		let next_page = current_search_page + direction
		while (next_page >= 0 && next_page < page_list.length) {

			// We run the check once per loop iteration,
			// in case the search was cancel during the 'await' below.
			if (current_search_needle === "") {
				search_status.textContent = ""
				return
			}

			search_status.textContent = `Searching page ${next_page}.`

			await page_list[next_page]._loadPageSearch(current_zoom, current_search_needle)
			const hits = page_list[next_page-1].searchResultObject ?? []
			if (hits.length > 0) {
				page_list[next_page-1].rootNode.scrollIntoView()
				current_search_page = next_page
				search_status.textContent = `${hits.length} hits on page ${next_page}.`
				return
			}

			next_page += direction
		}

		search_status.textContent = "No more search hits."
	} catch (error) {
		console.error(error)
	}
}

// OUTLINE

function build_outline(parent, outline) {
	for (let item of outline) {
		let node = document.createElement("li")
		let a = document.createElement("a")
		a.href = "#page" + (item.page + 1)
		a.textContent = item.title
		node.appendChild(a)
		if (item.down) {
			let down = document.createElement("ul")
			build_outline(down, item.down)
			node.appendChild(down)
		}
		parent.appendChild(node)
	}
}

function toggle_outline_panel() {
	if (document.getElementById("outline-panel").style.display === "none")
		show_outline_panel()
	else
		hide_outline_panel()
}

function show_outline_panel() {
	if (!page_list)
		return
	document.getElementById("outline-panel").style.display = "block"
}

function hide_outline_panel() {
	document.getElementById("outline-panel").style.display = "none"
}

// DOCUMENT LOADING

function close_document() {
	clear_message()
	hide_outline_panel()
	hide_search_panel()

	if (current_doc) {
		worker.closeDocument(current_doc)
		current_doc = 0
		document.getElementById("outline").replaceChildren()
		document.getElementById("pages").replaceChildren()
		for (let page of page_list)
			page_observer.unobserve(page.rootNode)
		page_visible.length = 0
	}

	page_list = null
}

async function open_document_from_buffer(buffer, magic, title) {
	current_doc = await worker.openDocumentFromBuffer(buffer, magic)

	document.title = await worker.documentTitle(current_doc) || title

	var page_count = await worker.countPages(current_doc)

	// Use second page as default page size (the cover page is often differently sized)
	var page_size = await worker.getPageSize(current_doc, page_count > 1 ? 2 : 1)

	page_list = []
	for (let i = 0; i < page_count; ++i)
		page_list[i] = new PageView(current_doc, i, page_size, current_zoom)

	for (let page of page_list) {
		document.getElementById("pages").appendChild(page.rootNode)
		page_observer.observe(page.rootNode)
	}

	var outline = await worker.documentOutline(current_doc)
	if (outline) {
		build_outline(document.getElementById("outline"), outline)
		show_outline_panel()
	} else {
		hide_outline_panel()
	}

	clear_message()

	current_search_needle = ""
	current_search_page = 0
}

async function open_document_from_file(file) {
	close_document()
	try {
		show_message("Loading " + file.name)
		history.replaceState(null, null, window.location.pathname)
		await open_document_from_buffer(await file.arrayBuffer(), file.name, file.name)
	} catch (error) {
		die(error)
	}
}

async function open_document_from_url(path) {
	close_document()
	try {
		show_message("Loading " + path)
		let response = await fetch(path)
		if (!response.ok)
			throw new Error("Could not fetch document.")
		await open_document_from_buffer(await response.arrayBuffer(), path, path)
	} catch (error) {
		die(error)
	}
}

function main() {
	clear_message()
	let params = new URLSearchParams(window.location.search)
	if (params.has("file"))
		open_document_from_url(params.get("file"))
}
