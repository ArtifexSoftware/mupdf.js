import * as mupdf from "mupdf"

export type MyWord = {
	rect: mupdf.Rect,
	text: string,
	font: mupdf.Font,
	size: number,
};

export function getPageWords(page: mupdf.PDFPage): MyWord[] {
	const words: MyWord[] = []
	let cwordRect: mupdf.Rect | undefined
	let cwordFont: mupdf.Font | undefined
	let cwordSize: number | undefined
	let cwordText = ""

	const endWord = () => {
		// if word is complete, append to list
		if (cwordRect !== undefined && cwordFont !== undefined && cwordSize !== undefined && cwordText !== "") {
			words.push({
				rect: cwordRect,
				text: cwordText,
				font: cwordFont,
				size: cwordSize,
			})
		}

		// Reset values
		cwordRect = undefined
		cwordFont = undefined
		cwordSize = undefined
		cwordText = ""
	}

	const enlargeRect = (quad: mupdf.Quad) => {
		if (cwordRect === undefined) {
			cwordRect = [ quad[0], quad[1], quad[6], quad[7] ]
			return
		}

		cwordRect[0] = Math.min(cwordRect[0], quad[0])
		cwordRect[1] = Math.min(cwordRect[1], quad[1])
		cwordRect[2] = Math.max(cwordRect[2], quad[6])
		cwordRect[3] = Math.max(cwordRect[3], quad[7])
	}

	// extract the words from the page
	page.toStructuredText("preserve-whitespace,preserve-spans").walk({
		onChar(c, _origin, font, size, quad) {
			enlargeRect(quad)

			cwordFont = font
			cwordSize = size

			// split by whitespace
			if (c == " ") {
				endWord()
			} else {
				cwordText += c
			}
		},
		// split by block
		endLine: endWord,
		endTextBlock: endWord,
	})

	return words
}

export function getPageImages(page: mupdf.PDFPage): { bbox: mupdf.Rect; matrix: mupdf.Matrix; image: mupdf.Image }[] {
	var images: { bbox: mupdf.Rect; matrix: mupdf.Matrix; image: mupdf.Image }[] = []
	page.toStructuredText("preserve-images").walk({
		onImageBlock(bbox, matrix, image) {
			images.push({ bbox: bbox, matrix: matrix, image: image })
		},
	})
	return images
}
