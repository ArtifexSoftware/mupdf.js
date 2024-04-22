"use client";

import { useState } from "react";

const testDocument = "http://localhost:8080/test.pdf"

const apiEndpoints = [
  {
    name: "Check Needs Password",
    endpoint: "/document/needs-password",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Authenticate Password",
    endpoint: "/document/authenticate-password",
    method: "POST",
    defaultBody: { password: "password" },
  },
  {
    name: "Get Metadata",
    endpoint: "/document/metadata",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Set Metadata",
    endpoint: "/document/metadata",
    method: "POST",
    defaultBody: { key: "info:Author", value: "John Doe" },
  },
  {
    name: "Get Page Count",
    endpoint: "/document/page-count",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Merge Documents",
    endpoint: "/document/merge",
    method: "POST",
    defaultBody: {
      urls: [
        testDocument,
        testDocument,
      ],
    },
  },
  {
    name: "Split Document",
    endpoint: "/document/split",
    method: "POST",
    defaultBody: {},
  },
  {
    name: "Get Images",
    endpoint: "/document/images",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Get Annotations",
    endpoint: "/document/annotations",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Bake Document",
    endpoint: "/document/bake",
    method: "POST",
    defaultBody: {},
  },
  {
    name: "Search",
    endpoint: "/document/search",
    method: "POST",
    defaultBody: { searchTerm: "example" },
  },
  {
    name: "Get Links",
    endpoint: "/document/links",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Embed File",
    endpoint: "/document/embed-file",
    method: "POST",
    defaultBody: { embedUrl: testDocument },
  },
  {
    name: "Get Page Bounds",
    endpoint: "/document/page/0/bounds",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Get Page Pixmap",
    endpoint: "/document/page/0/pixmap",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Get Page Structured Text",
    endpoint: "/document/page/0/structured-text",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Get Page Images",
    endpoint: "/document/page/0/images",
    method: "GET",
    defaultBody: {},
  },
  {
    name: "Add Page Text",
    endpoint: "/document/page/0/add-text",
    method: "POST",
    defaultBody: {
      text: "Added Text",
      x: 100,
      y: 100,
      fontFamily: "Helvetica",
      fontSize: 12,
    },
  },
  {
    name: "Add Page Image",
    endpoint: "/document/page/0/add-image",
    method: "POST",
    defaultBody: {
      imageUrl: "/image.jpg",
      x: 100,
      y: 100,
      width: 200,
      height: 200,
    },
  },
  {
    name: "Copy Page",
    endpoint: "/document/page/0/copy",
    method: "POST",
    defaultBody: {},
  },
  {
    name: "Delete Page",
    endpoint: "/document/page/0/delete",
    method: "DELETE",
    defaultBody: {},
  },
  {
    name: "Rotate Page",
    endpoint: "/document/page/0/rotate",
    method: "POST",
    defaultBody: { degrees: 90 },
  },
  {
    name: "Crop Page",
    endpoint: "/document/page/0/crop",
    method: "POST",
    defaultBody: { x: 0, y: 0, width: 500, height: 500 },
  },
];

export default function Home() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(apiEndpoints[0].defaultBody, null, 2)
  );
  const [response, setResponse] = useState("");

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const endpoint = apiEndpoints.find((ep) => ep.name === selectedName);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setRequestBody(JSON.stringify(endpoint.defaultBody, null, 2));
    }
  };

  const handleExecute = async () => {
    let url = `http://localhost:8080${selectedEndpoint.endpoint}`;
    const method = selectedEndpoint.method;
    const body = method === "GET" ? undefined : JSON.parse(requestBody);
    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (method !== "GET") {
      requestOptions.body = JSON.stringify({
        url: testDocument,
        ...body,
      });
    } else {
      const queryParams = new URLSearchParams({
        url: testDocument,
        ...body,
      }).toString();
      url += `?${queryParams}`;
    }

    try {
      const res = await fetch(url, requestOptions);

      if (res.ok) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setResponse(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-gray-800 text-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">REST API Console</h1>
        <div className="mb-4">
          <label htmlFor="endpoint" className="block mb-2">
            Select Endpoint:
          </label>
          <select
            id="endpoint"
            className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedEndpoint.name}
            onChange={handleEndpointChange}
          >
            {apiEndpoints.map((endpoint) => (
              <option key={endpoint.name} value={endpoint.name}>
                {endpoint.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="requestBody" className="block mb-2">
            Request Body (JSON):
          </label>
          <textarea
            id="requestBody"
            className="w-full px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
          ></textarea>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleExecute}
        >
          Execute
        </button>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Request:</h2>
          <pre className="bg-gray-700 rounded-md p-4 overflow-auto">
            {selectedEndpoint.method} {selectedEndpoint.endpoint}
            <br />
            <br />
            PDF URL: {testDocument}
            {requestBody && (
              <>
                <br />
                <br />
                {requestBody}
              </>
            )}
          </pre>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Response:</h2>
          <pre className="bg-gray-700 rounded-md p-4 overflow-auto">
            {response}
          </pre>
        </div>
      </div>
    </div>
  );
}
