import "@/App.css";
import { useMupdf } from "@/hooks/useMupdf.hook";
import { useEffect, useState } from "react";

function App() {

  const [docLoaded, setDocLoaded] = useState(false);

  const { isWorkerInitialized, renderPage, loadDocument, currentPage, countPages } =
    useMupdf();
  const [pageImages, setPageImages] = useState<any>([]);

  // ===> This is a demo effect which uses hooks <===
  // ===> from useMupdf to load and display the first page <===
  // ===> of the pdf as an image. <===
  useEffect(() => {

    if (!isWorkerInitialized) {
      return;
    }

    // load the document and then load the pages
    const init = async () => {
        console.log("init")
        const response = await fetch("/test.pdf");
        const arrayBuffer = await response.arrayBuffer();
        await loadDocument(arrayBuffer)
        setDocLoaded(true);
        await loadPages().catch(console.error);
    }
    

    const loadPages = async () => {
        
        console.log("load pages");
        let pageStack = new Array();
        //const totalPages = 1; // this works, but is not what we want :)
        const totalPages = await countPages();
        
	    for (let i:number = 0; i < totalPages; ++i) {
            setTimeout(() => timerRenderPage(i), 10*i)
        }

        async function timerRenderPage(i:number) {
            console.log("timerRenderPage",i)
            let pngData = await renderPage(i)
            pageStack.push(URL.createObjectURL(new Blob([pngData], { type: "image/png" })));
            
            if (pageStack.length == totalPages) {
                setPageImages(pageStack);
            }
        }
        
    }

    init();
    
  }, [isWorkerInitialized, loadDocument, renderPage]);

  return <div id="pages">
  { pageImages.map((item:any, i) => {
    return <div key={i}><img src={item} /></div>;
  }) }
</div>

}

export default App;
