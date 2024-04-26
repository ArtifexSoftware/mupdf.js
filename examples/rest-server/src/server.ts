import cors from 'cors'
import express from 'express'
import * as fs from 'fs'
import * as mupdf from 'mupdf'
import path from 'path'

const app = express()
const PORT = 8080
const HOST = 'http://localhost'

// cache fetched documents in memory for at least 5 minutes
const FETCH_CACHE_EXPIRES = 5 * 60 * 1000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const fetchCache: Map<string, { promise: Promise<Response>; expires: number }> =
  new Map()
function cachedFetch(url: string): Promise<Response> {
  let item = fetchCache.get(url)
  if (!item)
    fetchCache.set(
      url,
      (item = {
        promise: fetch(url),
        expires: Date.now() + FETCH_CACHE_EXPIRES,
      })
    )
  return item.promise
}

const responseCache: Map<
  string,
  { promise: Promise<ArrayBuffer>; expires: number }
> = new Map()
function cachedResponseArrayBuffer(
  url: string,
  res: Response
): Promise<ArrayBuffer> {
  let item = responseCache.get(url)
  if (!item)
    responseCache.set(
      url,
      (item = {
        promise: res.arrayBuffer(),
        expires: Date.now() + FETCH_CACHE_EXPIRES,
      })
    )
  return item.promise
}

setInterval(function () {
  const now = Date.now()
  fetchCache.forEach((value, key, map) => {
    if (value.expires < now) map.delete(key)
  })
  responseCache.forEach((value, key, map) => {
    if (value.expires < now) map.delete(key)
  })
}, FETCH_CACHE_EXPIRES)

// Helper function to load document from URL
async function loadDocumentFromUrl(url: string): Promise<mupdf.Document> {
  try {
    const response = await cachedFetch(url)
    const buffer = await cachedResponseArrayBuffer(url, response)
    return mupdf.Document.openDocument(buffer, 'application/pdf')
  } catch (error) {
    throw new Error(`Failed to load document from URL: ${url}`)
  }
}

// Helper function to validate page number
function validatePageNumber(
  pageNumber: number,
  document: mupdf.Document
): number {
  if (
    isNaN(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > document.countPages()
  ) {
    throw new Error('Invalid page number')
  }

  return pageNumber - 1
}

// GET /document/needs-password
app.get(
  '/document/needs-password',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const needsPassword = document.needsPassword()
      res.json({ needsPassword })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/authenticate-password
app.post(
  '/document/authenticate-password',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, password } = req.body
      if (!url || !password) {
        return res.status(400).json({ error: 'URL and password are required' })
      }

      const document = await loadDocumentFromUrl(url)
      const result = document.authenticatePassword(password)
      res.json({ result })
    } catch (error) {
      next(error)
    }
  }
)

/// GET /document/metadata
app.get(
  '/document/metadata',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const format = document.getMetaData('format')
      const modificationDate = document.getMetaData('info:ModDate')
      const author = document.getMetaData('info:Author')

      res.json({ format, modificationDate, author })
    } catch (error) {
      next(error)
    }
  }
)

// TODO: SetMetaData is not working
// POST /document/metadata
app.post(
  '/document/metadata',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, key, value } = req.body
      if (!url || !key || !value) {
        return res
          .status(400)
          .json({ error: 'URL, key, and value are required' })
      }

      const document = (await loadDocumentFromUrl(url)) as mupdf.PDFDocument
      document.setMetaData(key, value)
      const outputBuffer = document.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/page-count
app.get(
  '/document/page-count',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageCount = document.countPages()
      res.json({ pageCount })
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/page/:pageNumber
app.get(
  '/document/page/:pageNumber',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber)
      res.json(page)
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/structured-text
app.get(
  '/document/structured-text',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const result = []
      let i = 0
      while (i < document.countPages()) {
        const page = document.loadPage(i)
        const json = page.toStructuredText('preserve-whitespace').asJSON()
        result.push(json)
        i++
      }

      res.json(result)
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/images
app.get(
  '/document/images',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const result: {
        bbox: [number, number, number, number]
        matrix: [number, number, number, number, number, number]
        image: mupdf.Image
      }[] = []
      let i = 0
      while (i < document.countPages()) {
        const page = document.loadPage(i)
        page.toStructuredText('preserve-images').walk({
          onImageBlock(bbox, matrix, image) {
            result.push({ bbox, matrix, image })
          },
        })
        i++
      }

      res.json(result)
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/annotations
app.get(
  '/document/annotations',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const result = []
      let i = 0
      while (i < document.countPages()) {
        const page = document.loadPage(i) as mupdf.PDFPage
        const annots = page.getAnnotations()
        result.push(...annots)
        i++
      }

      res.json(result)
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/bake
app.post(
  '/document/bake',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.body
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url)
      const pdfDocument = document as mupdf.PDFDocument
      pdfDocument.bake()
      const outputBuffer = pdfDocument.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/search
app.post(
  '/document/search',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, searchTerm } = req.body
      if (!url || !searchTerm) {
        return res
          .status(400)
          .json({ error: 'URL and searchTerm are required' })
      }

      const document = await loadDocumentFromUrl(url)
      const results = []
      let i = 0
      while (i < document.countPages()) {
        const page = document.loadPage(i)
        const pageResults = page.search(searchTerm)
        results.push(pageResults)
        i++
      }

      res.json(results)
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/links
app.get(
  '/document/links',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const links = []
      let i = 0
      while (i < document.countPages()) {
        const page = document.loadPage(i)
        const pageLinks = page.getLinks()
        links.push(...pageLinks)
        i++
      }

      res.json(links)
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/embed-file
app.post(
  '/document/embed-file',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, embedUrl } = req.body
      if (!url || !embedUrl) {
        return res.status(400).json({ error: 'URL and embedUrl are required' })
      }

      const document = await loadDocumentFromUrl(url)
      const pdfDocument = document as mupdf.PDFDocument

      const embedMe = (await loadDocumentFromUrl(embedUrl)) as mupdf.PDFDocument
      const page = pdfDocument.loadPage(0)
      const annotation = page.createAnnotation('FileAttachment')

      annotation.setRect([50, 50, 100, 100])

      const buffer = embedMe.saveToBuffer('compress')

      const fileSpecObject = pdfDocument.addEmbeddedFile(
        path.basename(embedUrl),
        'application/pdf',
        buffer,
        new Date(),
        new Date(),
        false
      )
      annotation.setFileSpec(fileSpecObject)
      const outputBuffer = pdfDocument.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/page/:pageNumber/bounds
app.get(
  '/document/page/:pageNumber/bounds',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber)
      const bounds = page.getBounds()

      res.json({ bounds })
    } catch (error) {
      next(error)
    }
  }
)
// GET /document/page/:pageNumber/pixmap
app.get(
  '/document/page/:pageNumber/pixmap',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber)
      const pixmap = page.toPixmap(
        mupdf.Matrix.identity,
        mupdf.ColorSpace.DeviceRGB,
        false,
        true
      )
      const pngImage = pixmap.asPNG()
      const base64Image = Buffer.from(pngImage).toString('base64')

      res.json({ base64Image })
    } catch (error) {
      next(error)
    }
  }
)

// GET /document/page/:pageNumber/structured-text
app.get(
  '/document/page/:pageNumber/structured-text',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber) as mupdf.PDFPage
      const json = page.toStructuredText('preserve-whitespace').asJSON()

      res.json(json)
    } catch (error) {
      next(error)
    }
  }
)
// GET /document/page/:pageNumber/images
app.get(
  '/document/page/:pageNumber/images',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.query
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const document = await loadDocumentFromUrl(url as string)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)
      const page = document.loadPage(validatedPageNumber)

      const images: {
        bbox: [number, number, number, number]
        matrix: [number, number, number, number, number, number]
        image: mupdf.Image
      }[] = []

      page.toStructuredText('preserve-images').walk({
        onImageBlock(bbox, matrix, image) {
          images.push({ bbox, matrix, image })
        },
      })

      res.json(images)
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/page/:pageNumber/add-text
app.post(
  '/document/page/:pageNumber/add-text',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, text, x, y, fontFamily, fontSize } = req.body
      if (!url || !text || !x || !y || !fontFamily || !fontSize) {
        return res.status(400).json({
          error: 'URL, text, x, y, fontFamily, and fontSize are required',
        })
      }

      const document = await loadDocumentFromUrl(url)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber) as mupdf.PDFPage
      const pageObj = page.getObject()

      const pdfDocument = document as mupdf.PDFDocument

      const font = pdfDocument.addSimpleFont(new mupdf.Font(fontFamily))

      let resources = pageObj.get('Resources')
      if (!resources.isDictionary())
        pageObj.put('Resources', (resources = pdfDocument.newDictionary()))

      let resFonts = resources.get('Font')
      if (!resFonts.isDictionary())
        resources.put('Font', (resFonts = pdfDocument.newDictionary()))

      resFonts.put('F1', font)

      // TODO: .addStream API type is not correct
      // const extra_contents = pdfDocument.addStream()

      const outputBuffer = pdfDocument.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/page/:pageNumber/add-image
app.post(
  '/document/page/:pageNumber/add-image',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, imageUrl, x, y, width, height } = req.body
      if (!url || !imageUrl || !x || !y || !width || !height) {
        return res.status(400).json({
          error: 'URL, imageUrl, x, y, width, and height are required',
        })
      }

      const document = await loadDocumentFromUrl(url)
      const pdfDocument = document as mupdf.PDFDocument

      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = pdfDocument.loadPage(validatedPageNumber)
      const pageObj = page.getObject()

      const imageResponse = await cachedFetch(imageUrl)
      const imageBuffer = await cachedResponseArrayBuffer(
        imageUrl,
        imageResponse
      )

      const image = pdfDocument.addImage(
        new mupdf.Image(new Uint8Array(imageBuffer))
      )

      let resources = pageObj.get('Resources')
      if (!resources.isDictionary())
        pageObj.put('Resources', (resources = pdfDocument.newDictionary()))

      let resXobj = resources.get('XObject')
      if (!resXobj.isDictionary())
        resources.put('XObject', (resXobj = pdfDocument.newDictionary()))

      resXobj.put('Image', image)

      // TODO: .addStream API type is not correct
      // const extra_contents = pdfDocument.addStream()

      const outputBuffer = pdfDocument.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/page/:pageNumber/copy
app.post(
  '/document/page/:pageNumber/copy',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.body
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }
      const pdfDocument = (await loadDocumentFromUrl(url)) as mupdf.PDFDocument
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, pdfDocument)

      const newDocument = new mupdf.PDFDocument()
      newDocument.graftPage(0, pdfDocument, validatedPageNumber)

      const buffer = newDocument.saveToBuffer('compress')
      const outputPath = path.join('public', `copied-page-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, buffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// DELETE /document/page/:pageNumber/delete
app.delete(
  '/document/page/:pageNumber/delete',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.body
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }
      const pdfDocument = (await loadDocumentFromUrl(url)) as mupdf.PDFDocument

      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, pdfDocument)

      pdfDocument.deletePage(validatedPageNumber)

      const outputBuffer = pdfDocument.saveToBuffer('incremental')
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/page/:pageNumber/rotate
app.post(
  '/document/page/:pageNumber/rotate',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, degrees } = req.body
      if (!url || !degrees) {
        return res.status(400).json({ error: 'URL and degrees are required' })
      }

      const document = await loadDocumentFromUrl(url)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber) as mupdf.PDFPage
      const pageObj = page.getObject()

      const rotate = pageObj.getInheritable('Rotate')
      pageObj.put('Rotate', rotate + degrees)

      const outputBuffer = (document as mupdf.PDFDocument).saveToBuffer(
        'incremental'
      )
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/page/:pageNumber/crop
app.post(
  '/document/page/:pageNumber/crop',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url, x, y, width, height } = req.body

      if (!url || x === undefined || y === undefined || !width || !height) {
        return res
          .status(400)
          .json({ error: 'URL, x, y, width, and height are required' })
      }

      const document = await loadDocumentFromUrl(url)
      const pageNumber = parseInt(req.params.pageNumber)
      const validatedPageNumber = validatePageNumber(pageNumber, document)

      const page = document.loadPage(validatedPageNumber) as mupdf.PDFPage

      page.setPageBox('CropBox', [x, y, x + width, y + height])

      const outputBuffer = (document as mupdf.PDFDocument).saveToBuffer(
        'incremental'
      )
      const outputPath = path.join('public', `output-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, outputBuffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/split
app.post(
  '/document/split',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { url } = req.body
      if (!url) {
        return res.status(400).json({ error: 'URL is required' })
      }

      const pdfDocument = (await loadDocumentFromUrl(url)) as mupdf.PDFDocument

      const splitDocuments: string[] = []

      for (let i = 0; i < pdfDocument.countPages(); i++) {
        const newDoc = new mupdf.PDFDocument()
        newDoc.graftPage(0, pdfDocument, i)
        const buffer = newDoc.saveToBuffer('compress')
        const outputPath = path.join('public', `split-${i}-${Date.now()}.pdf`)
        fs.writeFileSync(outputPath, buffer.asUint8Array())
        splitDocuments.push(`${HOST}:${PORT}/${path.basename(outputPath)}`)
      }

      res.json({ urls: splitDocuments })
    } catch (error) {
      next(error)
    }
  }
)

// POST /document/merge
app.post(
  '/document/merge',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { urls } = req.body
      if (!urls || !Array.isArray(urls) || urls.length < 2) {
        return res.status(400).json({ error: 'At least two URLs are required' })
      }

      const dstDoc = new mupdf.PDFDocument()

      for (const url of urls) {
        const srcDoc = (await loadDocumentFromUrl(url)) as mupdf.PDFDocument
        const dstFromSrc = dstDoc.newGraftMap()

        for (let i = 0; i < srcDoc.countPages(); i++) {
          const srcPage = srcDoc.findPage(i)
          const dstPage = dstDoc.newDictionary()

          dstPage.put('Type', dstDoc.newName('Page'))
          if (srcPage.get('MediaBox'))
            dstPage.put(
              'MediaBox',
              dstFromSrc.graftObject(srcPage.get('MediaBox'))
            )
          if (srcPage.get('Rotate'))
            dstPage.put('Rotate', dstFromSrc.graftObject(srcPage.get('Rotate')))
          if (srcPage.get('Resources'))
            dstPage.put(
              'Resources',
              dstFromSrc.graftObject(srcPage.get('Resources'))
            )
          if (srcPage.get('Contents'))
            dstPage.put(
              'Contents',
              dstFromSrc.graftObject(srcPage.get('Contents'))
            )

          dstDoc.insertPage(-1, dstDoc.addObject(dstPage))
        }
      }

      const buffer = dstDoc.saveToBuffer('compress')
      const outputPath = path.join('public', `merged-${Date.now()}.pdf`)
      fs.writeFileSync(outputPath, buffer.asUint8Array())
      res.json({ url: `${HOST}:${PORT}/${path.basename(outputPath)}` })
    } catch (error) {
      next(error)
    }
  }
)

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message })
    } else {
      res.status(500).json({ error: 'Internal Server Error' })
    }
    next()
  }
)
