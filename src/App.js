import logo from './logo.svg';
import './App.css';
import { useEffect , useState} from 'react';



function App() {
  const [Viewer, setViewer] = useState()

  useEffect(()=>{
    (async ()=> {
      const module = await import ("./viewer.js")
      console.log(module)
      setViewer(module)
    })()
    
  },[])

  return (
    <div className="App">
      <header id="menubar-panel">
        <details>
          <summary>File</summary>
          <menu>
            <li onClick={()=>document.getElementById('open-file-input').click()}>Open File...</li>
          </menu>
        </details>
        <details>
          <summary>Edit</summary>
          <menu>
            <li onClick={() => Viewer.show_search_panel()}>Search...</li>
          </menu>
        </details>
        <details>
          <summary>View</summary>
          <menu>
            <li onClick={()=>Viewer.toggle_fullscreen()}>Fullscreen</li>
              <li onClick={()=>Viewer.toggle_outline_panel()}>Outline</li>
                <li onClick={()=>Viewer.zoom_to(48)}>50%</li>
                  <li onClick={()=>Viewer.zoom_to(72)}>75% (72 dpi)</li>
                    <li onClick={()=>Viewer.zoom_to(96)}>100% (96 dpi)</li>
                      <li onClick={()=>Viewer.zoom_to(120)}>125%</li>
                        <li onClick={()=>Viewer.zoom_to(144)}>150%</li>
                          <li onClick={()=>Viewer.zoom_to(192)}>200%</li>
                          </menu>
                        </details>
                      </header>

                      <aside id="outline-panel" style={{display:"none"}}>
                        <ul id="outline">
                          {
                          // <!-- outline inserted here -->
                          }
                        </ul>
                      </aside>

                      <main id="page-panel">
                        <div id="message">
                          Loading MuPDF.js...
                        </div>
                        <div id="pages">
                          {
                          //<!-- pages inserted here -->
                          }
                        </div>
                      </main>

                      <footer id="search-panel" style={{display:"none"}}>
                        <input
                          id="search-input"
                          type="search"
                          size="40"
                          placeholder="Search..."
                        />
                          <button onClick={()=>Viewer.run_search(-1, 1)}>Prev</button>
                          <button onClick={()=>Viewer.run_search(1, 1)}>Next</button>
                          {//TODO add back the style
                          }
                          <div id="search-status" ></div>
                          <button onClick={()=>Viewer.hide_search_panel()}>X</button>
                      </footer>

                      {
                      // <!-- hidden input for file dialog -->
                      }
                      <input
                        style={{display: "none"}}
                        id="open-file-input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(event) => Viewer.open_document_from_file(event.target.files[0])}
                      />
                      </div>
                      );
}

                      export default App;
