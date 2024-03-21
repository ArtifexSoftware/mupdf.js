"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPage();
  }, []);

  async function fetchPage() {
    const res = await fetch("http://localhost:8080/documents");
    const data = await res.json();
    setDocuments(data);
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) {
      console.error("No file selected.");
      return;
    }
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
      } else {
        console.error("Upload Failed:", res.statusText);
      }
    } catch (error) {
      console.error("Upload Failed:", error);
    }
    fetchPage();
  };

  return (
    <main className="flex flex-col justify-start">
      <header className="sticky top-0 bg-slate-700">
        <nav className="flex flex-wrap justify-start p-1.5">
          <button
            className="border border-solid border-white rounded p-1.5 m-1 bg-sky-600"
            onClick={() => fileInputRef.current?.click()}
          >
            Document Upload
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
              accept=".pdf"
            />
          </button>
        </nav>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="rounded-lg shadow-md p-4 m-4 bg-white">
            <p className="text-gray-600">docId: {doc.docId}</p>
            <h3 className="text-gray-600">fileName: {doc.fileName}</h3>
            <p className="text-gray-600">pageCount: {doc.pageCount}</p>
            <button
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
              onClick={() => {}}
            >
              Open Document
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
