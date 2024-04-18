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

  const handleNeedsPassword = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/needs-password");
      if (res.ok) {
        const data = await res.json();
        console.log("Needs Password:", data.needsPassword);
      } else {
        console.error("Needs Password failed:", res.statusText);
      }
    } catch (error) {
      console.error("Needs Password failed:", error);
    }
  };

  const handleAuthenticatePassword = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/document/authenticate-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: "password" }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Authenticate Password:", data.result);
      } else {
        console.error("Authenticate Password failed:", res.statusText);
      }
    } catch (error) {
      console.error("Authenticate Password failed:", error);
    }
  };

  const handleSetMetadata = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: "info:Author", value: "John Doe" }),
      });
      if (res.ok) {
        console.log("Set Metadata succeeded");
      } else {
        console.error("Set Metadata failed:", res.statusText);
      }
    } catch (error) {
      console.error("Set Metadata failed:", error);
    }
  };

  const handleEmbedFile = async () => {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob(["Embedded File Content"], { type: "text/plain" }),
      "embed.txt"
    );
    try {
      const res = await fetch("http://localhost:8080/document/embed-file", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        console.log("Embed File succeeded");
      } else {
        console.error("Embed File failed:", res.statusText);
      }
    } catch (error) {
      console.error("Embed File failed:", error);
    }
  };

  const handleGetPageBounds = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/bounds");
      if (res.ok) {
        const data = await res.json();
        console.log("Page Bounds:", data.bounds);
      } else {
        console.error("Get Page Bounds failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get Page Bounds failed:", error);
    }
  };

  const handleGetPagePixmap = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/pixmap");
      if (res.ok) {
        const data = await res.json();
        console.log("Page Pixmap:", data.base64Image);
      } else {
        console.error("Get Page Pixmap failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get Page Pixmap failed:", error);
    }
  };

  const handleGetPageStructuredText = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/document/page/0/structured-text"
      );
      if (res.ok) {
        const data = await res.json();
        console.log("Page Structured Text:", data);
      } else {
        console.error("Get Page Structured Text failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get Page Structured Text failed:", error);
    }
  };

  const handleGetPageImages = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/images");
      if (res.ok) {
        const data = await res.json();
        console.log("Page Images:", data);
      } else {
        console.error("Get Page Images failed:", res.statusText);
      }
    } catch (error) {
      console.error("Get Page Images failed:", error);
    }
  };

  const handleAddPageText = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/document/page/0/add-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: "Added Text",
            x: 100,
            y: 100,
            fontFamily: "Helvetica",
            fontSize: 12,
          }),
        }
      );
      if (res.ok) {
        console.log("Add Page Text succeeded");
      } else {
        console.error("Add Page Text failed:", res.statusText);
      }
    } catch (error) {
      console.error("Add Page Text failed:", error);
    }
  };

  const handleAddPageImage = async () => {
    const formData = new FormData();
    formData.append(
      "image",
      new Blob(["Image Content"], { type: "image/jpeg" }),
      "image.jpg"
    );
    formData.append("x", "100");
    formData.append("y", "100");
    formData.append("width", "200");
    formData.append("height", "200");
    try {
      const res = await fetch(
        "http://localhost:8080/document/page/0/add-image",
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        console.log("Add Page Image succeeded");
      } else {
        console.error("Add Page Image failed:", res.statusText);
      }
    } catch (error) {
      console.error("Add Page Image failed:", error);
    }
  };

  const handleCopyPage = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/copy", {
        method: "POST",
      });
      if (res.ok) {
        console.log("Copy Page succeeded");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url);
      } else {
        console.error("Copy Page failed:", res.statusText);
      }
    } catch (error) {
      console.error("Copy Page failed:", error);
    }
  };

  const handleDeletePage = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Delete Page succeeded");
      } else {
        console.error("Delete Page failed:", res.statusText);
      }
    } catch (error) {
      console.error("Delete Page failed:", error);
    }
  };

  const handleRotatePage = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/rotate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ degrees: 90 }),
      });
      if (res.ok) {
        console.log("Rotate Page succeeded");
      } else {
        console.error("Rotate Page failed:", res.statusText);
      }
    } catch (error) {
      console.error("Rotate Page failed:", error);
    }
  };

  const handleCropPage = async () => {
    try {
      const res = await fetch("http://localhost:8080/document/page/0/crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ x: 0, y: 0, width: 500, height: 500 }),
      });
      if (res.ok) {
        console.log("Crop Page succeeded");
      } else {
        console.error("Crop Page failed:", res.statusText);
      }
    } catch (error) {
      console.error("Crop Page failed:", error);
    }
  };

  const handleMergeDocuments = async () => {
    const fileInput1 = document.createElement("input");
    fileInput1.type = "file";
    fileInput1.accept = "application/pdf";
    fileInput1.onchange = async (event) => {
      const file1 = (event.target as HTMLInputElement).files?.[0];
      if (file1) {
        const fileInput2 = document.createElement("input");
        fileInput2.type = "file";
        fileInput2.accept = "application/pdf";
        fileInput2.onchange = async (event) => {
          const file2 = (event.target as HTMLInputElement).files?.[0];
          if (file2) {
            const formData = new FormData();
            formData.append("files", file1, file1.name);
            formData.append("files", file2, file2.name);
            try {
              const res = await fetch("http://localhost:8080/document/merge", {
                method: "POST",
                body: formData,
              });
              if (res.ok) {
                console.log("Merge Documents succeeded");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                window.open(url);
              } else {
                console.error("Merge Documents failed:", res.statusText);
              }
            } catch (error) {
              console.error("Merge Documents failed:", error);
            }
          }
        };
        fileInput2.click();
      }
    };
    fileInput1.click();
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
            onClick={handleNeedsPassword}
          >
            Check Needs Password
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleAuthenticatePassword}
          >
            Authenticate Password
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetMetadata}
          >
            Get Metadata
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleSetMetadata}
          >
            Set Metadata
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPageCount}
          >
            Get Page Count
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleMergeDocuments}
          >
            Merge Documents
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleSplitDocument}
          >
            Split Document
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
            onClick={handleBakeDocument}
          >
            Bake Document
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
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetLinks}
          >
            Get Links
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleEmbedFile}
          >
            Embed File
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPageBounds}
          >
            Get Page Bounds
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPagePixmap}
          >
            Get Page Pixmap
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPageStructuredText}
          >
            Get Page Structured Text
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleGetPageImages}
          >
            Get Page Images
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleAddPageText}
          >
            Add Page Text
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleAddPageImage}
          >
            Add Page Image
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleCopyPage}
          >
            Copy Page
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleDeletePage}
          >
            Delete Page
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleRotatePage}
          >
            Rotate Page
          </button>
          <button
            className="w-full py-3 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleCropPage}
          >
            Crop Page
          </button>
        </div>
      </div>
    </div>
  );
}
