import cors from 'cors'
import express, { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
const mupdf = require('mupdf')

const app = express()
const PORT = 8080
const upload = multer({ storage: multer.memoryStorage() })

// Set up a simple in-memory document storage
const testData = fs.readFileSync('public/test.pdf')
const documentsStorage: { [key: string]: MuPDFDocument } = {
  '1652922957123': mupdf.Document.openDocument(testData, 'application/pdf'),
}

interface MuPDFDocument {
  countPages: () => number
  loadPage: (pageNumber: number) => any
  saveToBuffer: (incremental: string) => any
  needsPassword: () => number
  authenticatePassword: (password: string) => number
  getMetaData: (key: string) => string
  setMetaData: (key: string, value: string) => void
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

    const page = document.loadPage(pageNumber - 1)
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
  document: MuPDFDocument,
  pageNumber: number,
  dpi: number
): string | undefined {
  if (document == null) {
    return
  }
  const docToScreen = mupdf.Matrix.scale(dpi / 72, dpi / 72)
  const page = document.loadPage(pageNumber - 1)
  const pixmap = page.toPixmap(
    docToScreen,
    mupdf.ColorSpace.DeviceRGB,
    false,
    true
  )
  const img = pixmap.asPNG()
  pixmap.destroy()
  const base64Image = Buffer.from(img, 'binary').toString('base64')
  return 'data:image/png;base64, ' + base64Image
}
