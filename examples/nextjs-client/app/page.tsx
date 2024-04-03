"use client";

import { useEffect, useRef, useState } from "react";
import Page from "./_components/Page";

type SearchResult = {
  page: number;
  results: {
    x: number;
    y: number;
    w: number;
    h: number;
  }[];
  pageWidth: number;
  pageHeight: number;
};

type Document = {
  docId: string;
  fileName: string;
  pageCount: number;
};

type Page = {
  pageNumber: number;
  text: any;
  image: string;
};

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    const res = await fetch(
      `http://localhost:8080/documents/${selectedDocument}/search?query=${searchQuery}`
    );
    const data = await res.json();
    setSearchResults(data);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    const res = await fetch("http://localhost:8080/documents");
    const data = await res.json();
    setDocuments(data);
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/documents", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Upload Success:", data);
        fetchDocuments();
        setSelectedDocument(data.docId);
        await fetchPages(data.docId);
      } else {
        console.error("Upload Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Upload Failed:", error);
    }
    setIsLoading(false);
  };

  const fetchPages = async (docId: string) => {
    setIsLoading(true);
    const res = await fetch(`http://localhost:8080/documents/${docId}/pages`);
    const data = await res.json();
    setPages(data);
    setCurrentPage(0);
    setIsLoading(false);
  };

  const handleDocumentClick = async (docId: string) => {
    setSelectedDocument(docId);
    await fetchPages(docId);
  };

  const handleDocumentDelete = async (docId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/documents/${docId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Delete Success");
        fetchDocuments();
        setSelectedDocument(null);
        setPages([]);
        setCurrentPage(0);
      } else {
        console.error("Delete Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Delete Failed:", error);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      handleFileUpload(file);
    }
  };

  const currentSearchResults = searchResults.find(
    (result) => result.page === currentPage + 1
  );

  return (
    <main
      className="flex flex-col min-h-screen bg-gray-900"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={dropzoneRef}
    >
      {isLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <header className="bg-gray-700">
        <nav className="container mx-auto flex justify-between items-center py-4">
          <div>
            <h1 className="text-white text-xl font-bold">Simple PDF Viewer</h1>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-l-md focus:ring-2 "
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button
              className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-r-md hover:bg-blue-700 focus:ring-2 focus:bg-blue-600"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload PDF
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files?.length) {
                    handleFileUpload(event.target.files[0]);
                  }
                }}
                style={{ display: "none" }}
                accept=".pdf"
              />
            </button>
          </div>
        </nav>
      </header>
      <div className="container mx-auto flex flex-grow">
        <div className="w-1/5 p-4 border-r border-gray-500">
          <h2 className="text-lg font-bold mb-4">Documents</h2>
          <ul>
            {documents.map((doc) => (
              <li
                key={doc.docId}
                className={`cursor-pointer mb-2 p-2 flex justify-between items-center rounded-lg transition-colors duration-150 ${
                  selectedDocument === doc.docId
                    ? "bg-blue-600"
                    : "hover:bg-blue-900"
                }`}
                onClick={() => handleDocumentClick(doc.docId)}
              >
                <div>{doc.fileName}</div>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDocumentDelete(doc.docId);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-4/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-bold mr-4">Pages</h2>
              {selectedDocument && (
                <div className="flex items-center">
                  <button
                    className="bg-gray-700 text-white px-2 py-1 rounded-l-md"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                  >
                    &lt;
                  </button>
                  <span className="bg-gray-700 text-white px-4 py-1">
                    {currentPage + 1} / {pages.length}
                  </span>
                  <button
                    className="bg-gray-700 text-white px-2 py-1 rounded-r-md"
                    onClick={handleNextPage}
                    disabled={currentPage === pages.length - 1}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
          {selectedDocument && (
            <div className="flex justify-center items-center">
              <Page
                page={pages[currentPage]?.image}
                pageNumber={currentPage}
                searchResults={currentSearchResults}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
