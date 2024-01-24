# The MuPDF.js Viewer


This project contains a very simple demo of a **PDF** viewer using the **MuPDF.js** Library.

## IMPORTANT

You **CANNOT** run this from the file system!

Modern web browsers refuse to load and run scripts from the file system, so
this project must be served up by a web server.

- In the top directory of your **mupdf.js** repository checkout start a stand-alone web server:

```bash
python -m http.server
```

*This will start a local server instance with the top level folder of your checkout as root.*


- Then open the viewer in a browser with the following URL:

	[http://localhost:8000/viewer/mupdf-view.html](http://localhost:8000/viewer/mupdf-view.html)


## View a PDF file

Use the **File -> Open File** control at the top left of the web page and select a **PDF** file.


## Shutting down the server

To shut down your **Python** server instance just do:

	^C (control+c)
