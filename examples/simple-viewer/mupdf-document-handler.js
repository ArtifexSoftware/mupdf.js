let zoomLevels = [ 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200 ]

class MupdfDocumentHandler {
	constructor(documentUri, initialPage, showDefaultUi) {}

	static async createHandler(mupdfWorker, viewerDivs) {
		// TODO validate worker param

		const handler = new MupdfDocumentHandler()

		const pageCount = await mupdfWorker.countPages()
		const title = await mupdfWorker.documentTitle()

		// Use second page as default page size (the cover page is often differently sized)
		const defaultSize = await mupdfWorker.getPageSize(pageCount > 1 ? 2 : 1)

		handler.mupdfWorker = mupdfWorker
		handler.pageCount = pageCount
		handler.title = title
		handler.defaultSize = defaultSize
		handler.searchNeedle = ""

		handler.zoomLevel = 100

		// TODO - Add a second observer with bigger margin to recycle old pages
		handler.activePages = new Set()
		handler.pageObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						handler.activePages.add(entry.target)
					} else {
						handler.activePages.delete(entry.target)
					}
				}
			},
			{
				// This means we have roughly five viewports of vertical "head start" where
				// the page is rendered before it becomes visible
				rootMargin: "500% 0px",
			}
		)

		// TODO
		// This is a hack to compensate for the lack of a priority queue
		// We wait until the user has stopped scrolling to load pages.
		let scrollTimer = null
		handler.scrollListener = function (event) {
			if (scrollTimer !== null)
				clearTimeout(scrollTimer)
			scrollTimer = setTimeout(() => {
				scrollTimer = null
				handler._updateView()
			}, 50)
		}
		document.addEventListener("scroll", handler.scrollListener)

		//const rootDiv = document.createElement("div")

		handler.gridMenubarDiv = viewerDivs.gridMenubarDiv
		handler.gridSidebarDiv = viewerDivs.gridSidebarDiv
		handler.gridMainDiv = viewerDivs.gridMainDiv
		handler.pagesDiv = viewerDivs.pagesDiv
		handler.searchDialogDiv = viewerDivs.searchDialogDiv
		handler.outlineNode = viewerDivs.outlineNode
		handler.searchStatusDiv = viewerDivs.searchStatusDiv

		const pagesDiv = viewerDivs.pagesDiv

		let pages = new Array(pageCount)
		for (let i = 0; i < pageCount; ++i) {
			const page = new MupdfPageViewer(mupdfWorker, i+1, defaultSize, handler._dpi(), handler.title)
			pages[i] = page
			pagesDiv.appendChild(page.rootNode)
			handler.pageObserver.observe(page.rootNode)
		}

		function isPage(element) {
			return element.tagName === "CANVAS" && element.closest("div.page") != null
		}

		const searchDivInput = document.createElement("input")
		searchDivInput.id = "search-text"
		searchDivInput.type = "search"
		searchDivInput.size = 40
		searchDivInput.addEventListener("input", () => {
			let newNeedle = searchDivInput.value ?? ""
			handler.setSearch(newNeedle)
		})
		searchDivInput.addEventListener("keydown", (event) => {
			if (event.key == "Enter")
				handler.runSearch(event.shiftKey ? -1 : 1)
		})
		const ltButton = document.createElement("button")
		ltButton.innerText = "<"
		ltButton.addEventListener("click", () => handler.runSearch(-1))
		const gtButton = document.createElement("button")
		gtButton.innerText = ">"
		gtButton.addEventListener("click", () => handler.runSearch(1))
		const hideButton = document.createElement("button")
		hideButton.innerText = "X"
		hideButton.addEventListener("click", () => handler.hideSearchBox())
		const searchStatusDiv = document.createElement("div")
		searchStatusDiv.id = "search-status"
		searchStatusDiv.innerText = "-"

		const searchFlex = document.createElement("div")
		searchFlex.classList = [ "flex" ]
		searchFlex.append(searchDivInput, ltButton, gtButton, hideButton)

		handler.searchDialogDiv.append(searchFlex, searchStatusDiv)

		handler.searchStatusDiv = searchStatusDiv
		handler.searchDivInput = searchDivInput
		handler.currentSearchPage = 1

		// TODO use rootDiv instead
		pagesDiv.addEventListener(
			"wheel",
			(event) => {
				if (event.ctrlKey || event.metaKey) {
					if (event.deltaY < 0)
						handler.zoomIn()
					else if (event.deltaY > 0)
						handler.zoomOut()
					event.preventDefault()
				}
			},
			{ passive: false }
		)

		//handler.rootDiv = rootDiv
		handler.pagesDiv = pagesDiv // TODO - rename
		handler.pages = pages

		// TODO - remove await
		let outline = await mupdfWorker.documentOutline()
		let outlineNode = viewerDivs.outlineNode
		if (outline) {
			handler._buildOutline(outlineNode, outline)
			handler.showOutline()
		} else {
			handler.hideOutline()
		}

		// TODO - remove once we add a priority queue
		for (let i = 0; i < Math.min(pageCount, 5); ++i) {
			handler.activePages.add(pages[i].rootNode)
		}

		handler._updateView()
		return handler
	}

	_updateView() {
		const dpi = this._dpi()
		for (const page of this.activePages) {
			this.pages[page.pageNumber-1].render(dpi, this.searchNeedle)
		}
	}

	// TODO - remove?
	_dpi() {
		return ((this.zoomLevel * 96) / 100) | 0
	}

	// note: pageNumber is NOT zero indexed
	goToPage(pageNumber) {
		pageNumber = Math.max(0, Math.min(pageNumber, this.pages.length))
		this.pages[pageNumber-1].rootNode.scrollIntoView()
	}

	zoomIn() {
		// TODO - instead find next larger zoom
		let curr = zoomLevels.indexOf(this.zoomLevel)
		let next = zoomLevels[curr + 1]
		if (next)
			this.setZoom(next)
	}

	zoomOut() {
		let curr = zoomLevels.indexOf(this.zoomLevel)
		let next = zoomLevels[curr - 1]
		if (next)
			this.setZoom(next)
	}

	setZoom(newZoom) {
		if (this.zoomLevel === newZoom)
			return
		this.zoomLevel = newZoom

		for (const page of this.pages) {
			page.setZoom(newZoom)
		}
		this._updateView()
	}

	clearSearch() {
		// TODO
	}

	setSearch(newNeedle) {
		this.searchStatusDiv.textContent = ""
		if (this.searchNeedle !== newNeedle) {
			this.searchNeedle = newNeedle
			this._updateView()
		}
	}

	showSearchBox() {
		// TODO - Fix what happens when you re-open search with existing text
		this.searchDialogDiv.style.display = "block"
		this.searchDivInput.focus()
		this.searchDivInput.select()
		this.setSearch(this.searchDivInput.value ?? "")
	}

	hideSearchBox() {
		this.searchStatusDiv.textContent = ""
		this.searchDialogDiv.style.display = "none"
		this.cancelSearch()
		this.setSearch("")
	}

	async runSearch(direction) {
		let searchStatusDiv = this.searchStatusDiv

		try {
			let page = this.currentSearchPage + direction
			while (page >= 1 && page < this.pageCount) {
				// We run the check once per loop iteration,
				// in case the search was cancel during the 'await' below.
				if (this.searchNeedle === "") {
					searchStatusDiv.textContent = ""
					return
				}

				searchStatusDiv.textContent = `Searching page ${page}.`

				await this.pages[page]._loadPageSearch(this._dpi(), this.searchNeedle)
				const hits = this.pages[page].searchResultObject ?? []
				if (hits.length > 0) {
					this.pages[page].rootNode.scrollIntoView()
					this.currentSearchPage = page
					searchStatusDiv.textContent = `${hits.length} hits on page ${page}.`
					return
				}

				page += direction
			}

			searchStatusDiv.textContent = "No more search hits."
		} catch (error) {
			console.error(`mupdf.runSearch: ${error.message}:\n${error.stack}`)
		}
	}

	cancelSearch() {
		// TODO
	}

	showOutline() {
		this.gridSidebarDiv.style.display = "block"
		this.gridMainDiv.classList.replace("sidebarHidden", "sidebarVisible")
	}

	hideOutline() {
		this.gridSidebarDiv.style.display = "none"
		this.gridMainDiv.classList.replace("sidebarVisible", "sidebarHidden")
	}

	toggleOutline() {
		let node = this.gridSidebarDiv
		if (node.style.display === "none" || node.style.display === "")
			this.showOutline()
		else
			this.hideOutline()
	}

	_buildOutline(listNode, outline) {
		for (let item of outline) {
			let itemNode = document.createElement("li")
			let aNode = document.createElement("a")
			// Note: the item.page object IS zero-indexed, 
			// therfore we add 1 for the correct page number
			aNode.href = `#page${item.page + 1}`
			aNode.textContent = item.title
			itemNode.appendChild(aNode)
			listNode.appendChild(itemNode)
			if (item.down) {
				itemNode = document.createElement("ul")
				this._buildOutline(itemNode, item.down)
				listNode.appendChild(itemNode)
			}
		}
	}

	clear() {
		document.removeEventListener("scroll", this.scrollListener)

		this.pagesDiv?.replaceChildren()
		this.outlineNode?.replaceChildren()
		this.searchDialogDiv?.replaceChildren()

		for (let page of this.pages ?? []) {
			page.clear()
		}
		this.pageObserver?.disconnect()
		this.cancelSearch()
	}
}
