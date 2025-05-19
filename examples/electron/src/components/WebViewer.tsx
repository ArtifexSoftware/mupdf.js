import { useMupdf } from "@/hooks/useMupdf.hook";
import { useEffect, useState } from "react";

export default function WebViewer(props: { file: string | URL | Request; }) {

    const [_docLoaded, setDocLoaded] = useState(false);

    const { isWorkerInitialized, renderPage, loadDocument, countPages } =
        useMupdf();
    const [pageImages, setPageImages] = useState<string[]>([]);

    // ===> This is a demo effect which uses hooks <===
    // ===> from useMupdf to load and display the first page <===
    // ===> of the pdf as an image. <===
    useEffect(() => {

        if (!isWorkerInitialized) {
            return;
        }

        // load the document and then load the pages
        const init = async () => {
            const response = await fetch(props.file);
            const arrayBuffer = await response.arrayBuffer();
            await loadDocument(arrayBuffer)
            setDocLoaded(true);
            await loadPages().catch(console.error);
        }
        
        const loadPages = async () => {

            let pageStack = new Array<string>();
            const totalPages: number | void = await countPages().catch(console.error);
            
            if (totalPages) {
                for (let i:number = 0; i < totalPages; ++i) {
                    let pngData = await renderPage(i).catch(console.error);

                    if (pngData) {
                        pageStack.push(URL.createObjectURL(new Blob([pngData], { type: "image/png" })));
                    
                        if (pageStack.length == totalPages) {
                            setPageImages(pageStack);
                        }
                    }
                }
            }
        }

        init();
        
    }, [isWorkerInitialized, loadDocument, renderPage]);

    return <div id="pages">
     { pageImages.map((image, i) => {
       return <div key={i}><img src={image} /></div>;
     }) }
    </div>
}
