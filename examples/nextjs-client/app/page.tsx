"use client";

import { useRef, useState } from "react";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8080/document", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log("Upload Success");
      } else {
        console.error("Upload Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Upload Failed:", error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      await handleFileUpload(file);
    }
  };

  const handleSearch = async () => {
    if (searchQuery === "") {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/document/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: searchQuery }),
      });
      if (!res.ok) {
        throw new Error("Search request failed");
      }
      const data = await res.json();
      console.log("Search result:", data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleGetMetadata = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/metadata");
      if (res.ok) {
        const metadata = await res.json();
        console.log("Metadata:", metadata);
      } else {
        console.error("Get metadata failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get metadata failed:", error);
    }
  };

  const handleGetPageCount = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page-count");
      if (res.ok) {
        const pageCount = await res.json();
        console.log("Page count:", pageCount);
      } else {
        console.error("Get page count failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get page count failed:", error);
    }
  };

  const handleGetImages = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/images");
      if (res.ok) {
        const images = await res.json();
        console.log("Images:", images);
      } else {
        console.error("Get images failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get images failed:", error);
    }
  };

  const handleGetAnnotations = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/annotations");
      if (res.ok) {
        const annotations = await res.json();
        console.log("Annotations:", annotations);
      } else {
        console.error("Get annotations failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get annotations failed:", error);
    }
  };

  const handleGetLinks = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/links");
      if (res.ok) {
        const links = await res.json();
        console.log("Links:", links);
      } else {
        console.error("Get links failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get links failed:", error);
    }
  };

  const handleBakeDocument = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/bake", {
        method: "POST",
      });
      if (res.ok) {
        console.log("Document baked successfully");
      } else {
        console.error("Bake document failed:", res.statusText);
      }
    } catch (error) {
      console.error("Bake document failed:", error);
    }
  };

  const handleSplitDocument = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/split", {
        method: "POST",
      });
      if (res.ok) {
        const splitDocuments = await res.json();
        console.log("Split documents:", splitDocuments);
      } else {
        console.error("Split document failed:", res.statusText);
      }
    } catch (error) {
      console.error("Split document failed:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={() => fileInputRef.current?.click()}
          >
            PDF Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetMetadata}
          >
            Get Metadata
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPageCount}
          >
            Get Page Count
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetImages}
          >
            Get Images
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetAnnotations}
          >
            Get Annotations
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetLinks}
          >
            Get Links
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleBakeDocument}
          >
            Bake Document
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleSplitDocument}
          >
            Split Document
          </button>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
