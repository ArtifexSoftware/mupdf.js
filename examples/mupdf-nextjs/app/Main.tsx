'use client';
import React, {useState} from 'react'
import Page from './Page'

export default function Main() {

    const [message, setMessage] = useState("Welcome")
    const [page, setPage] = useState("/images/logo.png")

    function loadDocumentPage(pageNumber:number) {
      fetch("http://localhost:8080/mupdfjs/openFile?" + new URLSearchParams({
        pageNumber: String(pageNumber),
        pdf: 'test.pdf', // note this file exists in the root of the "examples/rest-server" folder for convenience
      })).then(
        response => response.json() 
      ).then(
        data => {
          setMessage(data.title + " loaded with " + data.pageCount + " pages" + " | Showing page " + String(pageNumber))
          setPage(data.pageImageData)
          console.log(`page= ${page}`)
        }
      )
  };

  return (

    <main className="flex flex-col justify-start">
      <header className="sticky top-0 bg-slate-700">
          <nav className="flex justify-between p-1.5">
              <button className="border border-solid border-white rounded p-1.5 bg-sky-600" onClick={() => loadDocumentPage(1)}>Load page 1 of document</button>
              <div>{message}</div>
          </nav>
      </header>
      <Page page={page} />
    </main>

  )
  
}

