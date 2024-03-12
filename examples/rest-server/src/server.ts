import cors from 'cors'
import express, { Request, Response } from 'express'
import fs from 'fs'
const mupdf = require('mupdf')

const app = express()
const PORT = 8080

interface MuPDFDocument {
  countPages: () => number
  loadPage: (pageNumber: number) => any
  saveToBuffer: (incremental: string) => any
  needsPassword: () => number
  authenticatePassword: (password: string) => number
  getMetaData: (key: string) => string
  setMetaData: (key: string, value: string) => void
}

interface MuPDFPage {
  getBounds: () => any
}

app.use(cors())

// Serve static files from the 'public' directory
// http://localhost:8080/public/test.pdf will serve the file 'public/test.pdf'
app.use('/public', express.static('public'))
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})

app.get('/mupdfjs', (req: Request, res: Response) => {
  res.json({ result: 'Hello World!' })
})

// MuPDF document
let document: MuPDFDocument | null = null
// MuPDF page
const page: MuPDFPage | null = null

/////// Working with Files ///////

// Open a local PDF file
app.get('/mupdfjs/openLocalFile', (req: Request, res: Response) => {
  const data = fs.readFileSync(req.query.pdf as string)
  document = mupdf.Document.openDocument(data, 'application/pdf')
  res.json({
    result: 'success',
    title: req.query.pdf,
    pageImageData: getPageImage(req.query.pageNumber as string, 300),
    pageCount: document?.countPages(),
  })
})

// Open a remote PDF file (using a URL, ex: http://localhost:8080/public/test.pdf)
app.get('/mupdfjs/openRemoteFile', async (req: Request, res: Response) => {
  await loadRemoteFile(req.query.url as string)
  res.json({
    result: 'success',
    title: req.query.url,
    pageImageData: getPageImage(req.query.pageNumber as string, 300),
    pageCount: document?.countPages(),
  })
})

async function loadRemoteFile(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    console.error(`Cannot fetch document: ${response.statusText}`)
    return
  }
  const data = await response.arrayBuffer()
  document = mupdf.Document.openDocument(data, url)
}

// Saving the document to a local file
app.post('/mupdfjs/savePdf', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  fs.writeFileSync(
    'output.pdf',
    document.saveToBuffer('incremental').asUint8Array()
  )
  res.send({ message: 'Document saved successfully' })
})

function getPageImage(pageNumber: string, dpi: number): string | undefined {
  const pageNum = Number(pageNumber)
  console.log(`getPageImage: ${pageNum}`)
  if (document == null) {
    return
  }
  const docToScreen = mupdf.Matrix.scale(dpi / 72, dpi / 72)
  const page = document.loadPage(pageNum - 1)
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

/////// Working with Documents ///////
app.get('/mupdfjs/needsPassword', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  const needsPassword = document.needsPassword()
  res.json({ needsPassword })
})

app.post('/mupdfjs/authenticatePassword', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  console.log(req.body)
  const password = req.body.password
  const auth = document.authenticatePassword(password)
  if (auth) {
    res.json({ result: 'Authentication successful' })
  } else {
    res.status(401).json({ result: 'Authentication failed' })
  }
})

app.get('/mupdfjs/metadata', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  const format = document.getMetaData('format')
  const modificationDate = document.getMetaData('info:ModDate')
  const author = document.getMetaData('info:Author')
  const creator = document.getMetaData('info:Creator')
  const title = document.getMetaData('info:Title')
  const subject = document.getMetaData('info:Subject')
  const producer = document.getMetaData('info:Producer')
  const keywords = document.getMetaData('info:Keywords')
  const creationDate = document.getMetaData('info:CreationDate')

  res.json({
    format,
    modificationDate,
    author,
    creator,
    title,
    subject,
    producer,
    keywords,
    creationDate,
  })
})

// TODO: Implement the metadata update
app.post('/mupdfjs/metadata', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  const metadata = req.body
  try {
    Object.keys(metadata).forEach((key) => {
      console.log(document)
      console.log(key)
      document?.setMetaData(key, metadata[key])
    })
    res.json({ result: 'Metadata updated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update metadata' })
  }
})

app.get('/mupdfjs/countPages', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  res.json({ result: document.countPages() })
})

// TODO: The following endpoints are not implemented yet
app.post('/mupdfjs/merge', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  res.json({ result: '' })
})

// TODO: The following endpoints are not implemented yet
app.post('/mupdfjs/split', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  res.json({ result: '' })
})

app.get('/mupdfjs/text', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  try {
    const allText = []
    for (let i = 0; i < document.countPages(); i++) {
      const page = document.loadPage(i)
      const json = page.toStructuredText('preserve-whitespace').asJSON()
      allText.push(JSON.parse(json))
    }
    res.json({ result: allText })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to extract text from document' })
  }
})

app.get('/mupdfjs/images', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  try {
    const allImages = []
    for (let i = 0; i < document.countPages(); i++) {
      const page = document.loadPage(i)
      const images: { bbox: any; matrix: any; image: any }[] = []
      page.toStructuredText('preserve-images').walk({
        onImageBlock: (bbox: any, matrix: any, image: any) => {
          images.push({ bbox, matrix, image })
        },
      })
      allImages.push({ page: i, images })
    }
    res.json({ result: allImages })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to extract images from document' })
  }
})

app.get('/mupdfjs/annotations', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }

  try {
    const allAnnotations = []
    for (let i = 0; i < document.countPages(); i++) {
      const page = document.loadPage(i)
      const annots = page.getAnnotations()
      allAnnotations.push({ page: i, annotations: annots })
    }

    res.json({ result: allAnnotations })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Failed to extract annotations from document' })
  }
})

app.get('/mupdfjs/search', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  const searchPhrase = req.query.phrase
  if (!searchPhrase) {
    res.status(400).json({ error: 'Search phrase is required' })
    return
  }
  try {
    const searchResults = []
    for (let i = 0; i < document.countPages(); i++) {
      const page = document.loadPage(i)
      const results = page.search(searchPhrase)
      if (results && results.length > 0) {
        searchResults.push({ page: i, results })
      }
    }
    res.json({ result: searchResults })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to search the document' })
  }
})

app.get('/mupdfjs/links', (req: Request, res: Response) => {
  if (document == null) {
    res.status(404).json({ result: 'No document' })
    return
  }
  try {
    const allLinks = []
    for (let i = 0; i < document.countPages(); i++) {
      const page = document.loadPage(i)
      const links = page.getLinks()
      allLinks.push({ page: i, links })
    }
    res.json({ result: allLinks })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to extract links from document' })
  }
})
