// Copyright (C) 2004-2022 Artifex Software, Inc.
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

/* eslint-disable no-unused-vars */

class MupdfPageViewer {
	// pageNumber here is NOT zero-indexed
	constructor(worker, pageNumber, defaultSize, dpi, title) {
		this.title = title
		this.worker = worker
		this.pageNumber = pageNumber
		this.size = defaultSize
		this.sizeIsDefault = true

		const rootNode = document.createElement("div")
		rootNode.classList.add("page")

		const canvasNode = document.createElement("canvas")
		rootNode.appendChild(canvasNode)

		const anchor = document.createElement("a")
		anchor.classList.add("anchor")

		anchor.id = "page" + (pageNumber)
		rootNode.appendChild(anchor)
		rootNode.pageNumber = pageNumber

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
		// TODO - error handling
		this._loadPageImg({ dpi })
		this._loadPageText(dpi)
		this._loadPageLinks(dpi)
		this._loadPageSearch(dpi, searchNeedle)
	}

	// TODO - update child nodes
	setZoom(zoomLevel) {
		const dpi = ((zoomLevel * 96) / 100) | 0

		this._updateSize(dpi)
	}

	setSearchNeedle(searchNeedle = null) {
		this.searchNeedle = searchNeedle
	}

	clear() {
		this.textNode?.remove()
		this.linksNode?.remove()
		this.searchHitsNode?.remove()

		// TODO - use promise cancelling
		this.renderPromise = null
		this.textPromise = null
		this.linksPromise = null
		this.searchPromise = null

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

		this.mouseIsPressed = false
	}

	// TODO - this is destructive and makes other method get null ref errors
	showError(functionName, error) {
		console.error(`mupdf.${functionName}: ${error.message}:\n${error.stack}`)

		let div = document.createElement("div")
		div.classList.add("error")
		div.textContent = error.name + ": " + error.message
		//this.clear()
		this.rootNode.replaceChildren(div)
	}

	async mouseDown(event, dpi) {
		let { x, y } = this._getLocalCoords(event.clientX, event.clientY)

		let changed = await this.worker.mouseDownOnPage(this.pageNumber, dpi * devicePixelRatio, x, y)
		this.mouseIsPressed = true
		if (changed) {
			this._invalidatePageImg()
			this._loadPageImg({ dpi })
		}
	}

	async mouseMove(event, dpi) {
		let { x, y } = this._getLocalCoords(event.clientX, event.clientY)
		let changed
		// TODO - handle multiple buttons
		// see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
		if (this.mouseIsPressed) {
			if (event.buttons == 0) {
				// In case we missed an onmouseup event outside of the frame
				this.mouseIsPressed = false
				changed = await this.worker.mouseUpOnPage(this.pageNumber, dpi * devicePixelRatio, x, y)
			} else {
				changed = await this.worker.mouseDragOnPage(this.pageNumber, dpi * devicePixelRatio, x, y)
			}
		} else {
			changed = await this.worker.mouseMoveOnPage(this.pageNumber, dpi * devicePixelRatio, x, y)
		}
		if (changed) {
			this._invalidatePageImg()
			this._loadPageImg({ dpi })
		}
	}

	async mouseUp(event, dpi) {
		let { x, y } = this._getLocalCoords(event.clientX, event.clientY)
		this.mouseIsPressed = false
		let changed = await this.worker.mouseUpOnPage(this.pageNumber, dpi * devicePixelRatio, x, y)
		if (changed) {
			this._invalidatePageImg()
			this._loadPageImg({ dpi })
		}
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
				this.size = await this.worker.getPageSize(this.pageNumber)
				this.sizeIsDefault = false
				this._updateSize(dpi)
			}

			this.renderPromise = this.worker.drawPageAsPixmap(this.pageNumber, dpi * devicePixelRatio)
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
			this.textPromise = this.worker.getPageText(this.pageNumber)

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
			this.linksPromise = this.worker.getPageLinks(this.pageNumber)

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
				this.searchPromise = this.worker.search(this.pageNumber, this.searchNeedle)
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
