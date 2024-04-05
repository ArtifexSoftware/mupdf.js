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
  const [splitStartPage, setSplitStartPage] = useState(1);
  const [splitEndPage, setSplitEndPage] = useState(1);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedMergeDocIds, setSelectedMergeDocIds] = useState<string[]>([]);

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

  const handleDocumentSplit = async (startPage: number, endPage: number) => {
    if (!selectedDocument) return;

    try {
      const res = await fetch(
        `http://localhost:8080/documents/${selectedDocument}/split`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startPage, endPage }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Split Success:", data);
        fetchDocuments();
      } else {
        console.error("Split Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Split Failed:", error);
    }
  };

  const handleDocumentMerge = async (docId1: string, docId2: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/documents/${docId1}/merge/${docId2}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Merge Success:", data);
        fetchDocuments();
      } else {
        console.error("Merge Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Merge Failed:", error);
    }
  };

  return (
    <main
      className="flex flex-col min-h-screen bg-gray-900"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={dropzoneRef}
    >
      {/* Loading */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {/* Split Dialog */}
      {showSplitDialog && (
        <div className="fixed w-screen h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="mb-4">
              <input
                type="number"
                id="splitStartPage"
                min="1"
                max={pages.length}
                className="px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 mr-4"
                value={splitStartPage}
                onChange={(e) => setSplitStartPage(Number(e.target.value))}
              />
              <input
                type="number"
                id="splitEndPage"
                min="1"
                max={pages.length}
                className="px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2"
                value={splitEndPage}
                onChange={(e) => setSplitEndPage(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:bg-blue-600 mr-2"
                onClick={() => {
                  handleDocumentSplit(splitStartPage, splitEndPage);
                  setShowSplitDialog(false);
                }}
              >
                Split
              </button>
              <button
                className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:bg-gray-100"
                onClick={() => setShowSplitDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Dialog */}
      {showMergeDialog && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg">
            <ul className="max-h-40 overflow-y-auto border rounded-lg p-2 text-black mb-4">
              {documents.map((doc) => (
                <li
                  key={doc.docId}
                  className={`cursor-pointer mb-2 p-2 flex justify-between items-center rounded-lg transition-colors duration-150 ${
                    selectedMergeDocIds.includes(doc.docId)
                      ? "bg-blue-700"
                      : "hover:bg-blue-600"
                  }`}
                  onClick={() => {
                    if (selectedMergeDocIds.includes(doc.docId)) {
                      setSelectedMergeDocIds(
                        selectedMergeDocIds.filter((id) => id !== doc.docId)
                      );
                    } else if (selectedMergeDocIds.length < 2) {
                      setSelectedMergeDocIds([
                        ...selectedMergeDocIds,
                        doc.docId,
                      ]);
                    }
                  }}
                >
                  <div>{doc.fileName}</div>
                </li>
              ))}
            </ul>
            <div className="flex">
              <button
                className="px-4 py-2 text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:ring-2 focus:bg-blue-600 mr-2"
                onClick={async () => {
                  if (selectedMergeDocIds.length === 2) {
                    await handleDocumentMerge(
                      selectedMergeDocIds[0],
                      selectedMergeDocIds[1]
                    );
                    setShowMergeDialog(false);
                    setSelectedMergeDocIds([]);
                  }
                }}
                disabled={selectedMergeDocIds.length !== 2}
              >
                Merge
              </button>
              <button
                className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-2 focus:bg-gray-100"
                onClick={() => {
                  setShowMergeDialog(false);
                  setSelectedMergeDocIds([]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
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
        </nav>
      </header>
      <div className="container mx-auto flex flex-grow">
        <div className="w-1/5 p-4 border-r border-gray-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Documents</h2>
            <div className="flex items-center">
              <button
                className="text-green-500 hover:text-green-700 mr-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                  />
                </svg>
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
              <button
                className={`text-green-500 ${
                  selectedDocument
                    ? "hover:text-green-700"
                    : "opacity-50 cursor-not-allowed"
                } mr-2`}
                onClick={() => setShowMergeDialog(true)}
                disabled={!selectedDocument}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </button>
              <button
                className={`text-green-500 ${
                  selectedDocument
                    ? "hover:text-green-700"
                    : "opacity-50 cursor-not-allowed"
                } mr-2`}
                onClick={() => setShowSplitDialog(true)}
                disabled={!selectedDocument}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
                  />
                </svg>
              </button>
              <button
                className={`text-red-600 ${
                  selectedDocument
                    ? "hover:text-red-800"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (selectedDocument) {
                    handleDocumentDelete(selectedDocument);
                  }
                }}
                disabled={!selectedDocument}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
          <ul>
            {documents.map((doc) => (
              <li
                key={doc.docId}
                className={`cursor-pointer mb-2 p-2 flex justify-between items-center rounded-lg transition-colors duration-150 ${
                  selectedDocument === doc.docId
                    ? "bg-blue-700"
                    : "hover:bg-blue-600"
                }`}
                onClick={() => handleDocumentClick(doc.docId)}
              >
                <div>{doc.fileName}</div>
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
