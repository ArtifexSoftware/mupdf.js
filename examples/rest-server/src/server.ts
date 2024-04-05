import cors from 'cors'
import express, { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import * as mupdf from 'mupdf'

const app = express()
const PORT = 8080
const upload = multer({ storage: multer.memoryStorage() })

// Set up a simple in-memory document storage
const testData = fs.readFileSync('public/test.pdf')
const documentsStorage: { [key: string]: mupdf.Document } = {
  '1652922957123': mupdf.Document.openDocument(testData, 'application/pdf'),
}

app.use(cors())
app.use(express.json())
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})

// GET /documents
app.get('/documents', (req: Request, res: Response) => {
  const documents = Object.keys(documentsStorage).map((docId) => {
    const document = documentsStorage[docId]
    return {
      docId,
      fileName: document.getMetaData('info:Title') || 'Untitled',
      pageCount: document.countPages(),
    }
  })
  res.json(documents)
})

// POST /documents
app.post('/documents', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('File is required')
  }
  const buffer = req.file.buffer
  const docId = Date.now().toString()
  const document = mupdf.Document.openDocument(buffer, 'application/pdf')
  documentsStorage[docId] = document
  res.json({ docId })
})

// GET /documents/{docId}
app.get('/documents/:docId', (req: Request, res: Response) => {
  const docId = req.params.docId
  const document = documentsStorage[docId]
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

// DELETE /documents/{docId}
app.delete('/documents/:docId', (req: Request, res: Response) => {
  const docId = req.params.docId
  if (documentsStorage[docId]) {
    delete documentsStorage[docId]
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})

// GET /documents/{docId}/pages
app.get('/documents/:docId/pages', async (req: Request, res: Response) => {
  const docId = req.params.docId
  const document = documentsStorage[docId]
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

// GET /documents/{docId}/pages/{pageNumber}
app.get(
  '/documents/:docId/pages/:pageNumber',
  async (req: Request, res: Response) => {
    const docId = req.params.docId
    const pageNumber = Number(req.params.pageNumber)
    const document = documentsStorage[docId]
    if (!document) {
      return res.status(404).send({ error: 'Document not found.' })
    }

    const page: mupdf.PDFPage = document.loadPage(
      pageNumber - 1
    ) as mupdf.PDFPage
    const text = JSON.parse(
      page.toStructuredText('preserve-whitespace').asJSON()
    )
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
  }
)

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

// GET /documents/{docId}/search?query={query}
app.get('/documents/:docId/search', (req: Request, res: Response) => {
  const docId = req.params.docId
  const query = req.query.query as string
  const document = documentsStorage[docId]
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

// GET /documents/{docId}/split
app.post('/documents/:docId/split', (req: Request, res: Response) => {
  const docId = req.params.docId
  const startPage = req.body.startPage
  const endPage = req.body.endPage
  const document = documentsStorage[docId]
  if (!document) {
    return res.status(404).send({ error: 'Document not found.' })
  }

  const pdfDocument = document as mupdf.PDFDocument
  const newDoc = new mupdf.PDFDocument()
  for (let i = startPage - 1; i < endPage; i++) {
    newDoc.graftPage(i - startPage + 1, pdfDocument, i)
  }

  const newDocId = Date.now().toString()
  documentsStorage[newDocId] = newDoc

  res.json({ docId: newDocId })
})

// GET /documents/{docId1}/merge/{docId2}
app.post('/documents/:docId1/merge/:docId2', (req: Request, res: Response) => {
  const docId1 = req.params.docId1
  const docId2 = req.params.docId2
  const doc1 = documentsStorage[docId1]
  const doc2 = documentsStorage[docId2]
  if (!doc1 || !doc2) {
    return res.status(404).send({ error: 'One or both documents not found.' })
  }

  const pdfDoc1 = doc1 as mupdf.PDFDocument
  const pdfDoc2 = doc2 as mupdf.PDFDocument

  const newDoc = new mupdf.PDFDocument()
  let i = 0
  while (i < pdfDoc1.countPages()) {
    newDoc.graftPage(i, pdfDoc1, i)
    i++
  }
  i = 0
  while (i < pdfDoc2.countPages()) {
    newDoc.graftPage(newDoc.countPages(), pdfDoc2, i)
    i++
  }

  const newDocId = Date.now().toString()
  documentsStorage[newDocId] = newDoc

  res.json({ docId: newDocId })
})
