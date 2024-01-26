class MupdfDocumentViewer {
	constructor(mupdfWorker) {
		this.mupdfWorker = mupdfWorker
		this.documentHandler = null

		this.placeholderDiv = document.getElementById("placeholder")
		this.viewerDivs = {
			gridMenubarDiv: document.getElementById("grid-menubar"),
			gridSidebarDiv: document.getElementById("grid-sidebar"),
			gridMainDiv: document.getElementById("grid-main"),
			pagesDiv: document.getElementById("pages"),
			searchDialogDiv: document.getElementById("search-dialog"),
			outlineNode: document.getElementById("outline"),
			searchStatusDiv: document.getElementById("search-status"),
		}
	}

	async openFile(file) {
		try {
			if (!(file instanceof File)) {
				throw new Error(`Argument '${file}' is not a file`)
			}

			history.replaceState(null, null, window.location.pathname)
			this.clear()

			let loadingText = document.createElement("div")
			loadingText.textContent = "Loading document..."
			this.placeholderDiv.replaceChildren(loadingText)

			await this.mupdfWorker.openDocumentFromBuffer(await file.arrayBuffer(), file.name)
			await this._initDocument(file.name)
		} catch (error) {
			this.showDocumentError("openFile", error)
		}
	}

	async openURL(url, progressive, prefetch) {
		try {
			this.clear()

			let loadingText = document.createElement("div")
			loadingText.textContent = "Loading document..."
			this.placeholderDiv.replaceChildren(loadingText)

			let headResponse = await fetch(url, { method: "HEAD" })
			if (!headResponse.ok)
				throw new Error("Could not fetch document.")
			let acceptRanges = headResponse.headers.get("Accept-Ranges")
			let contentLength = headResponse.headers.get("Content-Length")
			let contentType = headResponse.headers.get("Content-Type")
			// TODO - Log less stuff
			console.log("HEAD", url)
			console.log("Content-Length", contentLength)
			console.log("Content-Type", contentType)

			if (acceptRanges === "bytes" && progressive) {
				console.log("USING HTTP RANGE REQUESTS")
				await mupdfView.openDocumentFromUrl(url, contentLength, progressive, prefetch, contentType || url)
			} else {
				let bodyResponse = await fetch(url)
				if (!bodyResponse.ok)
					throw new Error("Could not fetch document.")
				let buffer = await bodyResponse.arrayBuffer()
				await mupdfView.openDocumentFromBuffer(buffer, contentType || url)
			}

			await this._initDocument(url)
		} catch (error) {
			this.showDocumentError("openURL", error)
		}
	}

	openEmpty() {
		this.clear()
		this.placeholderDiv.replaceChildren()

		// TODO - add "empty" placeholder
		// add drag-and-drop support?
	}

	async _initDocument(docName) {
		this.documentHandler = await MupdfDocumentHandler.createHandler(this.mupdfWorker, this.viewerDivs)
		this.placeholderDiv.replaceChildren()

		console.log("mupdf: Loaded", JSON.stringify(docName), "with", this.documentHandler.pageCount, "pages.")

		// Change tab title
		document.title = this.documentHandler.title || docName
	}

	showDocumentError(functionName, error) {
		console.error(`mupdf.${functionName}: ${error.message}:\n${error.stack}`)

		let errorDiv = document.createElement("div")
		errorDiv.classList.add("error")
		errorDiv.textContent = error.name + ": " + error.message

		this.clear()
		this.placeholderDiv.replaceChildren(errorDiv)
	}

	// Note pageNumber is NOT zero indexed here
	goToPage(pageNumber) {
		this.documentHandler?.goToPage(pageNumber-1)
	}

	toggleFullscreen() {
		if (!document.fullscreenElement) {
			this.enterFullscreen()
		} else {
			this.exitFullscreen()
		}
	}

	enterFullscreen() {
		document.documentElement.requestFullscreen().catch((err) => {
			console.error("Could not enter fullscreen mode:", err)
		})
	}

	exitFullscreen() {
		document.exitFullscreen()
	}

	zoomIn() {
		this.documentHandler?.zoomIn()
	}

	zoomOut() {
		this.documentHandler?.zoomOut()
	}

	setZoom(newZoom) {
		this.documentHandler?.setZoom(newZoom)
	}

	clearSearch() {
		this.documentHandler?.clearSearch()
	}

	setSearch(newNeedle) {
		this.documentHandler?.setSearch(newNeedle)
	}

	showSearchBox() {
		this.documentHandler?.showSearchBox()
	}

	hideSearchBox() {
		this.documentHandler?.hideSearchBox()
	}

	runSearch(direction) {
		this.documentHandler?.runSearch(direction)
	}

	cancelSearch() {
		this.documentHandler?.cancelSearch()
	}

	showOutline() {
		this.documentHandler?.showOutline()
	}

	hideOutline() {
		this.documentHandler?.hideOutline()
	}

	toggleOutline() {
		this.documentHandler?.toggleOutline()
	}

	clear() {
		this.documentHandler?.clear()
		// TODO
	}
}
