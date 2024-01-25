'use client';
import React, {useState} from 'react'
import Page from './Page'

export default function Main() {

    const [message, setMessage] = useState("Welcome")
    const [page, setPage] = useState()

    function loadDocumentPage(pageNumber:number) {
    fetch("http://localhost:8080/api/openFile?" + new URLSearchParams({
      pageNumber: String(pageNumber),
      pdf: 'mupdf_explored.pdf', // note this file exists in the root of the "node-server" folder for convenience
    })).then(
      response => response.json() 
    ).then(
      data => {
        setMessage(data.title + " loaded with " + data.pageCount + " pages")
        setPage(data.pageImageData)
        console.log(`page= ${page}`)
      }
    )
  };

  return (

    <main className="flex flex-col justify-start">
      <header className="sticky top-0 bg-slate-900">
          <nav className="flex justify-between">
              <button onClick={() => loadDocumentPage(1)}>Load page 1 of document</button>
              <div>{message}</div>
          </nav>
      </header>
      <Page page={page} />
    </main>

  )
  
}

