import cors from 'cors'
import express, { Request, Response } from 'express'
import multer from 'multer'
import * as mupdf from 'mupdf'

const app = express()
const PORT = 8080
const upload = multer({ storage: multer.memoryStorage() })

// Set up a simple in-memory document storage for a single document
let document: mupdf.Document | null = null

app.use(cors())
app.use(express.json())
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})

// POST /document
app.post('/document', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('File is required')
  }
  const buffer = req.file.buffer
  document = mupdf.Document.openDocument(buffer, 'application/pdf')
  res.sendStatus(200)
})

// GET /document
app.get('/document', (req: Request, res: Response) => {
  if (document) {
    const metadata = {
      title: document.getMetaData('info:Title') || 'Untitled',
      format: document.getMetaData('format'),
      subject: document.getMetaData('info:Subject'),
      creator: document.getMetaData('info:Creator'),
      producer: document.getMetaData('info:Producer'),
      creationDate: document.getMetaData('info:CreationDate'),
      modificationDate: document.getMetaData('info:ModDate'),
    }
    res.json(metadata)
  } else {
    res.sendStatus(404)
  }
})

// DELETE /document
app.delete('/document', (req: Request, res: Response) => {
  document = null
  res.sendStatus(204)
})

// GET /pages
app.get('/pages', async (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send({ error: 'Document not found.' })
  }
  const pageCount = document.countPages()
  const pages = []
  for (let i = 0; i < pageCount; i++) {
    const page = document.loadPage(i)
    pages.push({
      pageNumber: i + 1,
      text: JSON.parse(page.toStructuredText('preserve-whitespace').asJSON()),
      image: getPageImage(document, i + 1, 100),
    })
  }
  res.json(pages)
})

// GET /pages/{pageNumber}
app.get('/pages/:pageNumber', async (req: Request, res: Response) => {
  const pageNumber = Number(req.params.pageNumber)
  if (!document) {
    return res.status(404).send({ error: 'Document not found.' })
  }

  const page: mupdf.PDFPage = document.loadPage(pageNumber - 1) as mupdf.PDFPage
  const text = JSON.parse(page.toStructuredText('preserve-whitespace').asJSON())
  const image = getPageImage(document, pageNumber, 300)
  const annotations = page.getAnnotations()
  const links = page.getLinks().map((link: any) => {
    return {
      bounds: link.getBounds(),
      uri: link.getURI(),
      isExternal: link.isExternal(),
    }
  })
  res.json({
    pageNumber,
    text,
    image,
    annotations,
    links,
  })
})

function getPageImage(
  document: mupdf.Document,
  pageNumber: number,
  dpi: number
): string | undefined {
  if (document == null) {
    return
  }
  // TODO, requires fix in API for a Matrix type to be returned
  // const docToScreen = mupdf.Matrix.scale(dpi / 72, dpi / 72)
  // until then we have to use an identity Matrix as it returns the correct type
  const docToScreen = mupdf.Matrix.identity
  const page = document.loadPage(pageNumber - 1)
  const pixmap = page.toPixmap(
    docToScreen,
    mupdf.ColorSpace.DeviceRGB,
    false,
    true
  )
  const img = pixmap.asPNG()
  pixmap.destroy()
  const base64String = Buffer.from(img).toString('base64')
  return 'data:image/png;base64, ' + base64String
}

// GET /search?query={query}
app.get('/search', (req: Request, res: Response) => {
  const query = req.query.query as string
  if (!document) {
    return res.status(404).send({ error: 'Document not found.' })
  }
  const results = []
  const pageCount = document.countPages()
  for (let i = 0; i < pageCount; i++) {
    const page = document.loadPage(i)
    const pageWidth = page.getBounds()[2] - page.getBounds()[0]
    const pageHeight = page.getBounds()[3] - page.getBounds()[1]
    const text = JSON.parse(
      page.toStructuredText('preserve-whitespace').asJSON()
    )
    const matches = searchText(text, query)
    results.push({
      page: i + 1,
      results: matches,
      pageWidth,
      pageHeight,
    })
  }
  res.json(results)
})

function searchText(text: any, query: string): any[] {
  if (!query.trim()) {
    return []
  }

  const matches: any[] = []
  text.blocks.forEach((block: any) => {
    block.lines.forEach((line: any) => {
      const lineText = line.text
      if (lineText.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ text: lineText, bbox: line.bbox })
      }
    })
  })
  return matches
}

// POST /pages/{pageNumber}/rotate
app.post('/pages/:pageNumber/rotate', (req: Request, res: Response) => {
  const pageNumber = Number(req.params.pageNumber)
  const rotation = req.body.rotation
  if (!document) {
    return res.status(404).send({ error: 'Document not found.' })
  }

  const page = document.loadPage(pageNumber - 1) as mupdf.PDFPage
  const pageObj = page.getObject()
  const currentRotation = pageObj.getInheritable('Rotate') || 0
  pageObj.put('Rotate', (currentRotation + rotation) % 360)

  res.sendStatus(200)
})
