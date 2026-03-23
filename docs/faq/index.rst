.. _FAQ:

Frequently Asked Questions
############################

.. raw:: html

    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>

    :root {
        --bg: #fff;
        --surface: #f8f9fa;
        --surface-hover: #e9ecef;
        --border: #dee2e6;
        --text: #0f1117;
        --muted: #6c757d;
        --accent: #d97706;
        --accent-dim: rgba(217,119,6,0.08);
        --code-bg: #f5f5f5;
        --green: #16a34a;
        --blue: #2563eb;
        --red: #dc2626;
        --purple: #9333ea;
        --bgTransparent: rgba(255, 255, 255, 0.95);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg: #0f1117;
            --surface: #181a24;
            --surface-hover: #1e2130;
            --border: #2a2d3e;
            --text: #d8d8e0;
            --muted: #9898a8;
            --accent: #e8943a;
            --accent-dim: rgba(232,148,58,0.12);
            --code-bg: #141620;
            --green: #4ade80;
            --blue: #60a5fa;
            --red: #f87171;
            --purple: #c084fc;
            --bgTransparent: rgba(15,17,23,0.95);
        }
    }

    body[data-theme="light"] {
        --bg: #fff;
        --surface: #f8f9fa;
        --surface-hover: #e9ecef;
        --border: #dee2e6;
        --text: #0f1117;
        --muted: #6c757d;
        --accent: #d97706;
        --accent-dim: rgba(217,119,6,0.08);
        --code-bg: #f5f5f5;
        --green: #16a34a;
        --blue: #2563eb;
        --red: #dc2626;
        --purple: #9333ea;
        --bgTransparent: rgba(255, 255, 255, 0.95);
    }
    
    body[data-theme="dark"] {
        --bg: #0f1117;
        --surface: #181a24;
        --surface-hover: #1e2130;
        --border: #2a2d3e;
        --text: #d8d8e0;
        --muted: #9898a8;
        --accent: #e8943a;
        --accent-dim: rgba(232,148,58,0.12);
        --code-bg: #141620;
        --green: #4ade80;
        --blue: #60a5fa;
        --red: #f87171;
        --purple: #c084fc;
        --bgTransparent: rgba(15,17,23,0.95);
    }

    

    .toc-drawer {
        display: none !important;
    }

    .main .content { 
        width:100% !important;
    }

    .main .content .container {
        padding-top:0 !important;
        margin-top:0 !important;
    } 

    #nav {
        position: sticky;
        top: 0;
        background: var(--bgTransparent);
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: 'IBM Plex Sans', -apple-system, sans-serif;
        background: var(--bg);
        color: var(--text);
        font-size: 15px;
        line-height: 1.75;
        -webkit-font-smoothing: antialiased;
    }

    .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 60px 24px;
    }

    /* Header */
    .header {
        margin-bottom: 56px;
        padding-bottom: 40px;
        border-bottom: 1px solid var(--border);
    }

    .header h1 {
        font-size: 32px;
        font-weight: 600;
        letter-spacing: -0.5px;
        margin-bottom: 12px;
    }

    .header .subtitle {
        font-size: 16px;
        color: var(--muted);
        line-height: 1.7;
        max-width: 700px;
    }

    .header .meta {
        margin-top: 16px;
        display: flex;
        gap: 24px;
        font-size: 13px;
        color: var(--muted);
    }

    .header .meta .stat {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .header .meta .stat strong {
        color: var(--accent);
        font-weight: 600;
    }

    /* Navigation */
    .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 48px;
    }

    .nav a {
        display: inline-block;
        padding: 6px 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 6px;
        color: var(--muted);
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.15s;
    }

    .nav a:hover {
        color: var(--text);
        border-color: var(--accent);
        background: var(--accent-dim);
    }

    /* Section */
    .section {
        margin-bottom: 56px;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 28px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border);
    }

    .section-header h2 {
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.3px;
    }

    .section-header .count {
        font-size: 12px;
        color: var(--accent);
        background: var(--accent-dim);
        padding: 2px 10px;
        border-radius: 12px;
        font-weight: 600;
    }

    /* FAQ Item */
    .faq {
        margin-bottom: 20px;
        border: 1px solid var(--border);
        border-radius: 10px;
        overflow: hidden;
        transition: border-color 0.15s;
    }

    .faq:hover { border-color: #3a3d52; }

    .faq-q {
        padding: 18px 22px;
        background: var(--surface);
        cursor: pointer;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        user-select: none;
    }

    .faq-q:hover { background: var(--surface-hover); }

    .faq-q .marker {
        color: var(--accent);
        font-weight: 600;
        font-size: 15px;
        flex-shrink: 0;
        margin-top: 1px;
    }

    .faq-q .question {
        font-weight: 500;
        font-size: 15px;
        line-height: 1.6;
        flex: 1;
    }

    .faq-q .toggle {
        color: var(--muted);
        font-size: 18px;
        flex-shrink: 0;
        transition: transform 0.2s;
        margin-top: 1px;
    }

    .faq.open .faq-q .toggle { transform: rotate(45deg); }

    .faq-a {
        display: none;
        padding: 20px 22px 22px 48px;
        border-top: 1px solid var(--border);
        background: var(--bg);
    }

    .faq.open .faq-a { display: block; }

    .faq-a p {
        margin-bottom: 14px;
        color: var(--text);
        line-height: 1.8;
    }

    .faq-a p:last-child { margin-bottom: 0; }

    .faq-a code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        background: var(--code-bg);
        border: 1px solid var(--border);
        padding: 2px 6px;
        border-radius: 4px;
        color: var(--accent);
    }

    .faq-a pre {
        background: var(--code-bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 16px 18px;
        margin: 14px 0;
        overflow-x: auto;
    }

    .faq-a pre code {
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        line-height: 1.7;
        color: var(--text);
    }

    .faq-a .tip {
        background: var(--accent-dim);
        border-left: 3px solid var(--accent);
        padding: 12px 16px;
        border-radius: 0 6px 6px 0;
        margin: 14px 0;
        font-size: 14px;
        color: var(--text);
    }

    .faq-a .tip strong { color: var(--accent); }

    .faq-a a {
        color: var(--blue);
        text-decoration: none;
        border-bottom: 1px solid transparent;
    }

    .faq-a a:hover { border-bottom-color: var(--blue); }

    .faq-a .source {
        font-size: 12px;
        color: var(--muted);
        margin-top: 12px;
        font-style: italic;
    }

  

    @media (max-width: 640px) {
        .container { padding: 32px 16px; }
        .header h1 { font-size: 24px; }
        .nav { gap: 6px; }
        .nav a { font-size: 12px; padding: 5px 10px; }
    }

    </style>

    <div class="container">

        <div class="header">
      

        <div class="nav" id="nav">
        <a href="#overview">Overview</a>
        <a href="#installation">Installation</a>
        <a href="#nodejs">Node.js Usage</a>
        <a href="#browser">Browser Usage</a>
        <a href="#documents">Documents & Pages</a>
        <a href="#text">Text & Search</a>
        <a href="#annotations">Annotations</a>
        <a href="#editing">PDF Editing</a>
        <a href="#licensing">Licensing</a>
        </div>

        <!-- ===== OVERVIEW ===== -->
        <div class="section" id="overview">
        <div class="section-header">
        <h2>Overview</h2>
  
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What is MuPDF.js and how does it work?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js is the official JavaScript/TypeScript binding for MuPDF from Artifex Software. It's powered by WebAssembly (WASM), which means the actual MuPDF C library is compiled to run in JavaScript environments.</p>
            <p>This enables:</p>
            <p>• <strong>Browser-side PDF processing:</strong> Render PDFs using HTML5 Canvas without server round-trips</p>
            <p>• <strong>Node.js server processing:</strong> Headless PDF manipulation for backend services</p>
            <p>• <strong>Cross-platform:</strong> Works anywhere JavaScript runs — Node, Bun, Deno, browsers</p>
            <p>The API provides document loading, page rendering, text extraction, annotations, and PDF manipulation.</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What can MuPDF.js do?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p><strong>Document Operations:</strong></p>
            <p>• Open PDF files</p>
            <p>• Merge, split, and rearrange pages</p>
            <p>• Crop and rotate pages</p>
            <p>• Save modified documents</p>
            <p><strong>Rendering:</strong></p>
            <p>• Render pages to image format</p>
            <p>• Render to HTML5 Canvas in browsers</p>
            <p>• Control resolution and zoom</p>
            <p><strong>Content Extraction:</strong></p>
            <p>• Extract text with position information</p>
            <p>• Search for text across documents</p>
            <p>• Get document structure and metadata</p>
            <p><strong>Annotations:</strong></p>
            <p>• Create highlights, notes, and drawings</p>
            <p>• Modify existing annotations</p>
            <p>• Support for redaction annotations</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How does MuPDF.js compare to PDF.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p><strong>MuPDF.js advantages:</strong></p>
            <p>• Fast, accurate rendering</p>
            <p>• Full PDF editing capabilities (annotations, merging, etc.)</p>
            <p>• Better font handling and text extraction</p>
            <p><strong>PDF.js advantages:</strong></p>
            <p>• Pure JavaScript (no WASM dependency)</p>
            <p>• Mozilla-backed, widely used</p>
            <p>• Smaller bundle size</p>
            <p>• More permissive license (Apache 2.0)</p>
            <p>Choose MuPDF.js when you need high-fidelity rendering, editing capabilities, or advanced text extraction. Choose PDF.js for simpler viewing scenarios where bundle size matters.</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">Is there an older "mupdf-js" package? What's the difference?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>Yes, there was a community package called <code>mupdf-js</code> (note the hyphen). That package is now deprecated in favor of the official <code>mupdf</code> package from Artifex.</p>
            <pre><code>
        // OLD (deprecated)
        // npm install mupdf-js
        import { createMuPdf } from "mupdf-js";

        // NEW (official, recommended)
        // npm install mupdf
        import mupdf from "mupdf";</code></pre>
            <p>The official package is actively maintained by Artifex and has a more complete API.</p>
        </div>
        </div>

        </div>

        <!-- ===== INSTALLATION ===== -->
        <div class="section" id="installation">
        <div class="section-header">
        <h2>Installation & Setup</h2>

        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I install MuPDF.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>npm install mupdf</code></pre>
            <p>Or with yarn:</p>
            <pre><code>yarn add mupdf</code></pre>
            <p>Or with pnpm:</p>
            <pre><code>pnpm add mupdf</code></pre>
            <p>The package includes the WebAssembly binary and TypeScript definitions.</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What JavaScript environments are supported?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js works in any environment that supports WebAssembly:</p>
            <p>• <strong>Node.js:</strong> 14+ (recommended: 18+)</p>
            <p>• <strong>Bun:</strong> Full support</p>
            <p>• <strong>Deno:</strong> With npm compatibility</p>
            <p>• <strong>Browsers:</strong> Chrome, Firefox, Safari, Edge (all modern versions)</p>
            <p>The module is ESM-only, so use <code>import</code> syntax, not <code>require()</code>.</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I use MuPDF.js with TypeScript?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js includes TypeScript definitions out of the box:</p>
            <pre><code>
        import mupdf from "mupdf";
        import type { Document, Page, Pixmap } from "mupdf";

        const doc: Document = mupdf.Document.openDocument(buffer, "application/pdf");
        const page: Page = doc.loadPage(0);
        const pixmap: Pixmap = page.toPixmap(
            mupdf.Matrix.identity,
            mupdf.ColorSpace.DeviceRGB,
            false,
            true
        );</code></pre>
            <p>No additional <code>@types</code> package needed.</p>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I use MuPDF.js with frameworks like React, Vue, or Next.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js works with modern frameworks. Key considerations:</p>
            <p><strong>Client-side rendering:</strong> Load the WASM module asynchronously</p>
            <p><strong>Server-side (Next.js):</strong> Use in API routes or with dynamic imports</p>
            <pre><code>
        // React component example
        import { useEffect, useState, useRef } from 'react';

        export default function PdfViewer({ pdfUrl }) {
            const canvasRef = useRef(null);
            
            useEffect(() =&gt; {
                async function renderPdf() {
                    const mupdf = await import('mupdf');
                    const response = await fetch(pdfUrl);
                    const buffer = await response.arrayBuffer();
                    
                    const doc = mupdf.Document.openDocument(
                        new Uint8Array(buffer), 
                        "application/pdf"
                    );
                    const page = doc.loadPage(0);
                    // ... render to canvas
                }
                renderPdf();
            }, [pdfUrl]);
            
            return &lt;canvas ref={canvasRef} /&gt;;
        }</code></pre>

        <p>For examples see: <a href="../apps/">Building Web apps</a>.</p>
        </div>
        </div>

        </div>

        <!-- ===== NODEJS ===== -->
        <div class="section" id="nodejs">
        <div class="section-header">
        <h2>Node.js Usage</h2>
    
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I open a PDF file in Node.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        import * as fs from "fs";
        import mupdf from "mupdf";

        // Read file as buffer
        const buffer = fs.readFileSync("input.pdf");

        // Open document
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");

        console.log(`Pages: ${doc.countPages()}`);

        // Always close when done
        doc.destroy();</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I render a PDF page to a PNG file?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        import * as fs from "fs";
        import mupdf from "mupdf";

        const buffer = fs.readFileSync("input.pdf");
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");
        const page = doc.loadPage(0);

        // Create pixmap at 2x zoom (144 DPI)
        const matrix = mupdf.Matrix.scale(2, 2);
        const pixmap = page.toPixmap(
            matrix,
            mupdf.ColorSpace.DeviceRGB,
            false,  // no alpha
            true    // include annotations
        );

        // Save as PNG
        const pngData = pixmap.asPNG();
        fs.writeFileSync("page1.png", pngData);

        // Cleanup
        pixmap.destroy();
        page.destroy();
        doc.destroy();</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I build a REST API for PDF processing?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            See: <a href="../apps/server-side/nextjs.html">Next.js Client/Server Example</a>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I handle memory management in Node.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js uses WebAssembly memory which isn't automatically garbage collected. Always call <code>destroy()</code> on objects when done:</p>
            <pre><code>
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");
        try {
            const page = doc.loadPage(0);
            try {
                const pixmap = page.toPixmap(/*...*/);
                try {
                    // Use pixmap...
                    const png = pixmap.asPNG();
                } finally {
                    pixmap.destroy();
                }
            } finally {
                page.destroy();
            }
        } finally {
            doc.destroy();
        }</code></pre>
            <p>For high-throughput servers, monitor memory usage and implement proper cleanup in error handlers.</p>
        </div>
        </div>

        </div>

        <!-- ===== BROWSER ===== -->
        <div class="section" id="browser">
        <div class="section-header">
        <h2>Browser Usage</h2>
      
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I render a PDF to an HTML5 Canvas?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        &lt;canvas id="pdfCanvas"&gt;&lt;/canvas&gt;
        &lt;script type="module"&gt;
        import mupdf from "mupdf";

        async function renderPdf(url) {
            // Fetch PDF
            const response = await fetch(url);
            const buffer = await response.arrayBuffer();
            
            // Open document
            const doc = mupdf.Document.openDocument(
                new Uint8Array(buffer),
                "application/pdf"
            );
            
            const page = doc.loadPage(0);
            const [, , width, height] = page.getBounds();
            
            // Create pixmap
            const scale = window.devicePixelRatio || 1;
            const matrix = mupdf.Matrix.scale(scale, scale);
            const pixmap = page.toPixmap(matrix, mupdf.ColorSpace.DeviceRGB, false, true);
            
            // Draw to canvas
            const canvas = document.getElementById("pdfCanvas");
            canvas.width = width * scale;
            canvas.height = height * scale;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            
            const ctx = canvas.getContext("2d");
            const imageData = new ImageData(
                new Uint8ClampedArray(pixmap.getPixels()),
                pixmap.getWidth(),
                pixmap.getHeight()
            );
            ctx.putImageData(imageData, 0, 0);
            
            // Cleanup
            pixmap.destroy();
            page.destroy();
            doc.destroy();
        }

        renderPdf("/sample.pdf");
        &lt;/script&gt;</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I handle user-uploaded PDF files?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        &lt;input type="file" id="fileInput" accept=".pdf" /&gt;

        &lt;script type="module"&gt;
            import mupdf from "mupdf";

            document.getElementById("fileInput").addEventListener("change", async (e) =&gt; {
                const file = e.target.files[0];
                if (!file) return;
                
                // Read file as ArrayBuffer
                const buffer = await file.arrayBuffer();
                
                // Open with MuPDF
                const doc = mupdf.Document.openDocument(
                    new Uint8Array(buffer),
                    "application/pdf"
                );
                
                console.log(`Loaded: ${file.name}, ${doc.countPages()} pages`);
                
                // Process document...
            });
        &lt;/script&gt;</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I build a page navigation system?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        let doc = null;
        let currentPage = 0;

        async function loadDocument(buffer) {
            doc = mupdf.Document.openDocument(new Uint8Array(buffer), "application/pdf");
            currentPage = 0;
            renderCurrentPage();
            updateUI();
        }

        function renderCurrentPage() {
            const page = doc.loadPage(currentPage);
            // ... render to canvas
            page.destroy();
        }

        function nextPage() {
            if (currentPage &lt; doc.countPages() - 1) {
                currentPage++;
                renderCurrentPage();
                updateUI();
            }
        }

        function prevPage() {
            if (currentPage &gt; 0) {
                currentPage--;
                renderCurrentPage();
                updateUI();
            }
        }

        function goToPage(num) {
            if (num &gt;= 0 && num &lt; doc.countPages()) {
                currentPage = num;
                renderCurrentPage();
                updateUI();
            }
        }

        function updateUI() {
            document.getElementById("pageInfo").textContent = 
                `Page ${currentPage + 1} of ${doc.countPages()}`;
        }</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What's the bundle size of MuPDF.js?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>The MuPDF.js package includes:</p>
            <p>• <strong>JavaScript wrapper:</strong> ~50KB (minified)</p>
            <p>• <strong>WebAssembly binary:</strong> ~8-12MB</p>
            <p>The WASM binary is loaded asynchronously and can be cached by browsers. For production:</p>
            <p>• Serve WASM with proper caching headers</p>
            <p>• Consider lazy-loading MuPDF only when needed</p>
            <p>• Use a CDN for the WASM file</p>
            <div class="tip"><strong>Tip:</strong> The WASM binary compresses well (gzip/brotli reduces it to ~3-4MB over the wire).</div>
        </div>
        </div>

        </div>

        <!-- ===== DOCUMENTS ===== -->
        <div class="section" id="documents">
        <div class="section-header">
        <h2>Documents & Pages</h2>

        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I get document information and metadata?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");

        // Page count
        console.log(`Pages: ${doc.countPages()}`);

        // Metadata
        console.log(`Title: ${doc.getMetaData("info:Title")}`);
        console.log(`Author: ${doc.getMetaData("info:Author")}`);
        console.log(`Subject: ${doc.getMetaData("info:Subject")}`);
        console.log(`Creator: ${doc.getMetaData("info:Creator")}`);
        console.log(`Producer: ${doc.getMetaData("info:Producer")}`);
        console.log(`CreationDate: ${doc.getMetaData("info:CreationDate")}`);

        // Check document type
        console.log(`Is PDF: ${doc.isPDF()}`);

        // Get outline (bookmarks/TOC)
        const outline = doc.loadOutline();
        if (outline) {
            function printOutline(items, indent = 0) {
                for (const item of items) {
                    console.log(" ".repeat(indent) + item.title);
                    if (item.down) printOutline(item.down, indent + 2);
                }
            }
            printOutline(outline);
        }</code></pre>
        </div>
        </div>



        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I control rendering resolution/DPI?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const page = doc.loadPage(0);

        // Default is 72 DPI
        // Scale factor = desired DPI / 72

        // 150 DPI
        const matrix150 = mupdf.Matrix.scale(150/72, 150/72);

        // 300 DPI
        const matrix300 = mupdf.Matrix.scale(300/72, 300/72);

        // Create pixmap at specific DPI
        const pixmap = page.toPixmap(
            matrix300,
            mupdf.ColorSpace.DeviceRGB,
            false,  // alpha
            true    // annotations
        );

        console.log(`Output size: ${pixmap.getWidth()} x ${pixmap.getHeight()} pixels`);</code></pre>
        </div>
        </div>


        </div>

        <!-- ===== TEXT ===== -->
        <div class="section" id="text">
        <div class="section-header">
        <h2>Text Extraction & Search</h2>
  
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I extract text from a page?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const page = doc.loadPage(0);

        // Get structured text
        const stext = page.toStructuredText();

        // Extract as plain text
        const text = stext.asText();
        console.log(text);

        // Or iterate through blocks, lines, characters
        for (const block of stext.getBlocks()) {
            if (block.type === "text") {
                for (const line of block.lines) {
                    console.log(`Line at y=${line.bbox[1]}: ${line.text}`);
                }
            }
        }

        stext.destroy();
        page.destroy();</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I search for text in a document?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const page = doc.loadPage(0);
        const stext = page.toStructuredText();

        // Search for text, returns array of quads (quadrilaterals)
        const hits = stext.search("search term");

        console.log(`Found ${hits.length} matches`);

        for (const quad of hits) {
            // quad contains 4 points defining the match location
            // [x0,y0, x1,y1, x2,y2, x3,y3] - clockwise from top-left
            console.log(`Match at: ${quad}`);
        }

        // Use quads to highlight matches
        // (see Annotations section)

        stext.destroy();
        page.destroy();</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I extract text from all pages?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");

        let fullText = "";

        for (let i = 0; i &lt; doc.countPages(); i++) {
            const page = doc.loadPage(i);
            const stext = page.toStructuredText();
            
            fullText += `\n--- Page ${i + 1} ---\n`;
            fullText += stext.asText();
            
            stext.destroy();
            page.destroy();
        }

        console.log(fullText);
        doc.destroy();</code></pre>
        </div>
        </div>

        </div>

        <!-- ===== ANNOTATIONS ===== -->
        <div class="section" id="annotations">
        <div class="section-header">
        <h2>Annotations</h2>

        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I add a highlight annotation?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const doc = mupdf.Document.openDocument(buffer, "application/pdf");
        const pdfDoc = doc.asPDF();
        const page = pdfDoc.loadPage(0);

        // Search for text to highlight
        const stext = page.toStructuredText();
        const quads = stext.search("important text");

        if (quads.length &gt; 0) {
            // Create highlight annotation
            const annot = page.createAnnotation("Highlight");
            annot.setQuadPoints(quads);
            annot.setColor([1, 1, 0]);  // Yellow
            annot.update();
        }

        // Save document
        const outputBuffer = pdfDoc.saveToBuffer("incremental");
        fs.writeFileSync("highlighted.pdf", outputBuffer);

        stext.destroy();
        page.destroy();
        doc.destroy();</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What annotation types can I create?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js supports creating these annotation types:</p>
            <p>• <strong>Text markup:</strong> Highlight, Underline, StrikeOut, Squiggly</p>
            <p>• <strong>Text:</strong> Text (sticky note), FreeText</p>
            <p>• <strong>Drawing:</strong> Line, Square, Circle, Polygon, PolyLine, Ink</p>
            <p>• <strong>Other:</strong> Stamp, FileAttachment, Redact</p>
            <pre><code>
        // Examples
        const highlight = page.createAnnotation("Highlight");
        const note = page.createAnnotation("Text");
        const freetext = page.createAnnotation("FreeText");
        const line = page.createAnnotation("Line");
        const redact = page.createAnnotation("Redact");</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I add a text note (sticky note)?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        page = pdfDoc.loadPage(0);

        const annot = page.createAnnotation("Text");
        annot.setRect([100, 100, 120, 120]);  // Icon position
        annot.setContents("This is a note comment");
        annot.setColor([1, 1, 0]);  // Yellow icon
        annot.update();

        const outputBuffer = pdfDoc.saveToBuffer("incremental");
        fs.writeFileSync("with_note.pdf", outputBuffer);</code></pre>
        </div>
        </div>

        </div>

        <!-- ===== EDITING ===== -->
        <div class="section" id="editing">
        <div class="section-header">
        <h2>PDF Editing</h2>
  
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I add a FreeText annotation (text box)?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const page = pdfDoc.loadPage(0);

        const annot = page.createAnnotation("FreeText");
        annot.setRect([100, 100, 300, 150]);
        annot.setContents("This is editable text");
        annot.setDefaultAppearance("Helv", 12, [0, 0, 0]);  // Font, size, color
        annot.update();

        pdfDoc.saveToBuffer("incremental");</code></pre>
        </div>
        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">How do I apply redactions?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <pre><code>
        const page = pdfDoc.loadPage(0);

        // Create redaction annotation
        const redact = page.createAnnotation("Redact");
        redact.setRect([100, 200, 300, 220]);  // Area to redact
        redact.update();

        // Apply all redactions (permanently removes content)
        page.applyRedactions();

        // Save - redacted content is permanently removed
        const outputBuffer = pdfDoc.saveToBuffer("");
        fs.writeFileSync("redacted.pdf", outputBuffer);</code></pre>
            <div class="tip"><strong>Warning:</strong> <code>applyRedactions()</code> permanently removes content. The original data cannot be recovered.</div>
        </div>
        </div>

        </div>

        <!-- ===== LICENSING ===== -->
        <div class="section" id="licensing">
        <div class="section-header">
        <h2>Licensing</h2>

        </div>

        <div class="faq">
        <div class="faq-q"><span class="marker">Q</span><span class="question">What license is MuPDF.js under?</span><span class="toggle">+</span></div>
        <div class="faq-a">
            <p>MuPDF.js is available under two licenses:</p>
            <p><strong>AGPL v3:</strong> Free for open-source projects. If you distribute software using MuPDF.js or provide it as a network service, you must release your source code under AGPL.</p>
            <p><strong>Commercial License:</strong> For proprietary applications, SaaS products, or when you can't comply with AGPL. Contact Artifex for pricing.</p>
            <p>The licensing applies to both the JavaScript wrapper and the underlying MuPDF WASM binary.</p>
            <p><a href="https://artifex.com/contact/mupdf-js" target="_blank">Contact Artifex for more details</a>.</p>
        </div>
        </div>

 

        </div>


    </div>

    <script>
    document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
        q.parentElement.classList.toggle('open');
    });
    });
    </script>

