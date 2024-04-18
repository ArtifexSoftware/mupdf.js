import cors from 'cors'
import express, { Request, Response } from 'express'
import * as fs from 'fs'
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

// GET /document/needs-password
app.get('/document/needs-password', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const needsPassword = document.needsPassword()
  res.json({ needsPassword })
})

// POST /document/authenticate-password
app.post('/document/authenticate-password', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const { password } = req.body
  const result = document.authenticatePassword(password)
  res.json({ result })
})

// GET /document/metadata
app.get('/document/metadata', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const format = document.getMetaData('format')
  const modificationDate = document.getMetaData('info:ModDate')
  const author = document.getMetaData('info:Author')

  res.json({ format, modificationDate, author })
})

// POST /document/metadata
app.post('/document/metadata', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const { key, value } = req.body
  document.setMetaData(key, value)
  res.sendStatus(200)
})

// GET /document/page-count
app.get('/document/page-count', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageCount = document.countPages()
  res.json({ pageCount })
})

// GET /document/page/:pageNumber
app.get('/document/page/:pageNumber', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber)
  res.json(page)
})

// GET /document/structured-text
app.get('/document/structured-text', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const result = []
  let i = 0
  while (i < document.countPages()) {
    const page = document.loadPage(i)
    const json = page.toStructuredText('preserve-whitespace').asJSON()
    result.push(json)
    i++
  }

  res.json(result)
})

// GET /document/images
app.get('/document/images', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

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
})

// GET /document/annotations
app.get('/document/annotations', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const result = []
  let i = 0
  while (i < document.countPages()) {
    const page = document.loadPage(i) as mupdf.PDFPage // TODO: Type inference isn't working.
    const annots = page.getAnnotations()
    result.push(...annots)
    i++
  }

  res.json(result)
})

// POST /document/bake
app.post('/document/bake', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }
  const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.
  pdfDocument.bake()
  res.sendStatus(200)
})

// POST /document/search
app.post('/document/search', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const { searchTerm } = req.body

  const results = []
  let i = 0
  while (i < document.countPages()) {
    const page = document.loadPage(i)
    const pageResults = page.search(searchTerm)
    results.push(pageResults)
    i++
  }

  res.json(results)
})

// GET /document/links
app.get('/document/links', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const links = []
  let i = 0
  while (i < document.countPages()) {
    const page = document.loadPage(i)
    const pageLinks = page.getLinks()
    links.push(...pageLinks)
    i++
  }

  res.json(links)
})

// POST /document/embed-file
app.post(
  '/document/embed-file',
  upload.single('file'),
  (req: Request, res: Response) => {
    if (!document) {
      return res.status(404).send('No document found')
    }
    const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

    if (!req.file) {
      return res.status(400).send('File is required')
    }

    const embedMe = mupdf.Document.openDocument(
      req.file.buffer,
      'application/pdf'
    ) as mupdf.PDFDocument // TODO: Type inference isn't working.
    const page = pdfDocument.loadPage(0)
    const annotation = page.createAnnotation('FileAttachment')

    annotation.setRect([50, 50, 100, 100])

    const buffer = embedMe.saveToBuffer('compress')

    const fileSpecObject = pdfDocument.addEmbeddedFile(
      req.file.originalname,
      req.file.mimetype,
      buffer,
      new Date(),
      new Date(),
      false
    )
    annotation.setFileSpec(fileSpecObject)
    const outputBuffer = pdfDocument.saveToBuffer('incremental')
    fs.writeFileSync('output.pdf', outputBuffer.asUint8Array())
    res.sendStatus(200)
  }
)

// GET /document/page/:pageNumber/bounds
app.get('/document/page/:pageNumber/bounds', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber)
  const bounds = page.getBounds()

  res.json({ bounds })
})

// GET /document/page/:pageNumber/pixmap
app.get('/document/page/:pageNumber/pixmap', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber)
  const pixmap = page.toPixmap(
    mupdf.Matrix.identity,
    mupdf.ColorSpace.DeviceRGB,
    false,
    true
  )
  const pngImage = pixmap.asPNG()
  const base64Image = Buffer.from(pngImage).toString('base64')

  res.json({ base64Image })
})

// GET /document/page/:pageNumber/structured-text
app.get(
  '/document/page/:pageNumber/structured-text',
  (req: Request, res: Response) => {
    if (!document) {
      return res.status(404).send('No document found')
    }

    const pageNumber = parseInt(req.params.pageNumber)
    const page = document.loadPage(pageNumber) as mupdf.PDFPage // TODO: Type inference isn't working.
    const json = page.toStructuredText('preserve-whitespace').asJSON()

    res.json(json)
  }
)

// GET /document/page/:pageNumber/images
app.get('/document/page/:pageNumber/images', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber)

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
})

// POST /document/page/:pageNumber/add-text
app.post(
  '/document/page/:pageNumber/add-text',
  (req: Request, res: Response) => {
    if (!document) {
      return res.status(404).send('No document found')
    }

    const pageNumber = parseInt(req.params.pageNumber)
    const page = document.loadPage(pageNumber) as mupdf.PDFPage // TODO: Type inference isn't working.
    const pageObj = page.getObject()

    const { text, x, y, fontFamily, fontSize } = req.body

    const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

    const font = pdfDocument.addSimpleFont(new mupdf.Font(fontFamily))

    let resources = pageObj.get('Resources')
    if (!resources.isDictionary())
      pageObj.put('Resources', (resources = pdfDocument.newDictionary()))

    let resFonts = resources.get('Font')
    if (!resFonts.isDictionary())
      resources.put('Font', (resFonts = pdfDocument.newDictionary()))

    resFonts.put('F1', font)

    // const extra_contents = pdfDocument.addStream(
    //   `BT /F1 ${fontSize} Tf 1 0 0 1 ${x} ${y} Tm (${text}) Tj ET`
    // )

    // const pageContents = pageObj.get('Contents')
    // if (pageContents.isArray()) {
    //   pageContents.push(extra_contents)
    // } else {
    //   const newPageContents = pdfDocument.newArray()
    //   newPageContents.push(pageContents)
    //   newPageContents.push(extra_contents)
    //   pageObj.put('Contents', newPageContents)
    // }

    res.sendStatus(200)
  }
)

// POST /document/page/:pageNumber/add-image
app.post(
  '/document/page/:pageNumber/add-image',
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!document) {
      return res.status(404).send('No document found')
    }
    const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

    const pageNumber = parseInt(req.params.pageNumber)
    const page = pdfDocument.loadPage(pageNumber)
    const pageObj = page.getObject()

    if (!req.file) {
      return res.status(400).send('Image file is required')
    }

    const image = pdfDocument.addImage(new mupdf.Image(req.file.buffer))
    const { x, y, width, height } = req.body

    let resources = pageObj.get('Resources')
    if (!resources.isDictionary())
      pageObj.put('Resources', (resources = pdfDocument.newDictionary()))

    let resXobj = resources.get('XObject')
    if (!resXobj.isDictionary())
      resources.put('XObject', (resXobj = pdfDocument.newDictionary()))

    resXobj.put('Image', image)

    // const extra_contents = pdfDocument.addStream(
    //   `q ${width} 0 0 ${height} ${x} ${y} cm /Image Do Q`
    // )

    // const pageContents = pageObj.get('Contents')
    // if (pageContents.isArray()) {
    //   pageContents.push(extra_contents)
    // } else {
    //   const newPageContents = pdfDocument.newArray()
    //   newPageContents.push(pageContents)
    //   newPageContents.push(extra_contents)
    //   pageObj.put('Contents', newPageContents)
    // }

    res.sendStatus(200)
  }
)

// POST /document/page/:pageNumber/copy
app.post('/document/page/:pageNumber/copy', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }
  const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

  const pageNumber = parseInt(req.params.pageNumber)

  const newDocument = new mupdf.PDFDocument()
  newDocument.graftPage(0, pdfDocument, pageNumber)

  const buffer = newDocument.saveToBuffer('compress')
  res.contentType('application/pdf')
  res.end(buffer.asUint8Array(), 'binary')
})

// DELETE /document/page/:pageNumber/delete
app.delete(
  '/document/page/:pageNumber/delete',
  (req: Request, res: Response) => {
    if (!document) {
      return res.status(404).send('No document found')
    }
    const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

    const pageNumber = parseInt(req.params.pageNumber)
    pdfDocument.deletePage(pageNumber)

    res.sendStatus(200)
  }
)

// POST /document/page/:pageNumber/rotate
app.post('/document/page/:pageNumber/rotate', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber) as mupdf.PDFPage // TODO: Type inference isn't working.
  const pageObj = page.getObject()

  const { degrees } = req.body
  const rotate = pageObj.getInheritable('Rotate')
  pageObj.put('Rotate', rotate + degrees)

  res.sendStatus(200)
})

// POST /document/page/:pageNumber/crop
app.post('/document/page/:pageNumber/crop', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pageNumber = parseInt(req.params.pageNumber)
  const page = document.loadPage(pageNumber) as mupdf.PDFPage // TODO: Type inference isn't working.

  const { x, y, width, height } = req.body
  page.setPageBox('CropBox', [x, y, x + width, y + height])

  res.sendStatus(200)
})

// POST /document/split
app.post('/document/split', (req: Request, res: Response) => {
  if (!document) {
    return res.status(404).send('No document found')
  }

  const pdfDocument = document as mupdf.PDFDocument // TODO: Type inference isn't working.

  const splitDocuments: any[] = []

  for (let i = 0; i < document.countPages(); i++) {
    const newDoc = new mupdf.PDFDocument()
    newDoc.graftPage(0, pdfDocument, i)
    const buffer = newDoc.saveToBuffer('compress')
    splitDocuments.push(buffer)
  }

  res.contentType('application/json')
  res.json(splitDocuments.map((buffer) => buffer.toString('base64')))
})

// POST /document/merge
app.post(
  '/document/merge',
  upload.array('files'),
  (req: Request, res: Response) => {
    if (!req.files || (Array.isArray(req.files) && req.files.length < 2)) {
      return res.status(400).send('At least two files are required')
    }

    const dstDoc = new mupdf.PDFDocument()

    for (const file of req.files as Express.Multer.File[]) {
      const srcDoc = mupdf.Document.openDocument(
        file.buffer,
        'application/pdf'
      ) as mupdf.PDFDocument
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
    res.contentType('application/pdf')
    res.end(buffer.asUint8Array(), 'binary')
  }
)
