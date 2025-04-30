import * as fs from 'fs'
const mupdf: any = require('mupdf')

const data: Buffer = fs.readFileSync('public/test.pdf')

let document: any = null

function loadDocument(): void {
  try {
    document = mupdf.Document.openDocument(data, 'application/pdf')
    console.log(`loadDocument(): success`)
  } catch (err: any) {
    console.log(`loadDocument(): ${err.message}`)
  }
}

function countPages(): void {
  try {
    const pageCount: number = document.countPages()
    console.log(`countPages(): success. Page count: ${pageCount}`)
  } catch (err: any) {
    console.log(`countPages(): ${err.message}`)
  }
}

loadDocument()
countPages()
