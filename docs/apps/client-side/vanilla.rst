Vanilla
=======

You can build a simple web app without using any frameworks at all. Just use plain old *vanilla* JS!

The `examples/simple-viewer <https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples/simple-viewer>`_ project shows how to create a simple
document viewer that runs MuPDF.js in a Web Worker.

The Worker runs on a background thread to do the heavy lifting, and
inserts rendered images and text in the DOM as pages scroll into view.

Getting Started
---------------

Once you have checked out the example from our `Github repository <https://github.com/ArtifexSoftware/mupdf.js>`_ 
then do the following:


Initialize the project
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

	npm install

Start the server
~~~~~~~~~~~~~~~~~~~~~~

To start the HTTP server and open your browser to the viewer:

.. code-block:: bash

	npm start


Once opened in the browser use the File option in the UI to open a PDF file.

