import "@/App.css";
import { useMupdf } from "@/hooks/useMupdf.hook";
import { useEffect, useState } from "react";

function App() {
  const { isWorkerInitialized, renderPage, loadDocument, currentPage } =
    useMupdf();
  const [pageImgUrl, setPageImgUrl] = useState<string | null>(null);

  // ===> This is a demo effect which uses hooks <===
  // ===> from useMupdf to load and display the first page <===
  // ===> of the pdf as an image. <===
  useEffect(() => {
    if (!isWorkerInitialized) {
      return;
    }

    const loadAndRender = async () => {
      const response = await fetch("/test.pdf");
      const arrayBuffer = await response.arrayBuffer();
      await loadDocument(arrayBuffer);
      const pngData = await renderPage(currentPage);
      setPageImgUrl(
        URL.createObjectURL(new Blob([pngData], { type: "image/png" }))
      );
    };

    loadAndRender().catch(console.error);
  }, [currentPage, isWorkerInitialized, loadDocument, renderPage]);

  return <>{pageImgUrl && <img src={pageImgUrl} />}</>;
}

export default App;
