"use client";

import { useRef, useState } from "react";
import Page from "./_components/Page";

export type SearchResult = {
  page: number;
  results: {
    bbox: { x: number; y: number; w: number; h: number };
    text: string;
  }[];
  pageWidth: number;
  pageHeight: number;
};

type Page = {
  pageNumber: number;
  text: any;
  image: string;
};

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (searchQuery === "") {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/search?query=${searchQuery}`
      );
      if (!res.ok) {
        throw new Error("Search request failed");
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/document", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log("Upload Success");
        await fetchPages(0);
      } else {
        console.error("Upload Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Upload Failed:", error);
    }
    setIsLoading(false);
  };

  const fetchPages = async (currentPageNumber: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/pages`);
      if (!res.ok) {
        throw new Error("Failed to fetch pages");
      }
      const data = await res.json();
      setPages(data);
      setCurrentPage(currentPageNumber);
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentDelete = async () => {
    try {
      const res = await fetch(`http://localhost:8080/document`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Delete Success");
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

  const handleRotatePage = async (rotation: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/pages/${currentPage + 1}/rotate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rotation }),
        }
      );

      if (!res.ok) {
        throw new Error("Rotate request failed");
      }

      await fetchPages(currentPage);
    } catch (error) {
      console.error("Rotate failed:", error);
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
        <div className="w-full p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {pages.length > 0 && (
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
                  <div className="flex items-center">
                    <button
                      className="bg-gray-700 text-white px-2 py-1 rounded-md ml-2"
                      onClick={() => handleRotatePage(90)}
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
                          d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                        />
                      </svg>
                    </button>
                    <button
                      className="bg-gray-700 text-white px-2 py-1 rounded-md ml-2"
                      onClick={() => handleRotatePage(-90)}
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
                          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                className="text-red-600 hover:text-red-800"
                onClick={handleDocumentDelete}
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
          {pages.length > 0 && (
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
