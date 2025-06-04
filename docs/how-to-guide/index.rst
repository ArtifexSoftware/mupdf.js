.. _How_To_Guide:

How To Guide
===================

The code samples in this **"How To Guide"** assume that you are working with `Node.js`_ in the root folder of your project and you have :ref:`Installed MuPDF.js via NPM <npm_install>`.

`Node.js`_ is a runtime environment which allows you to run **JavaScript** outside the of the web browser. It is commonly used for server-side **JavaScript** solutions and **RESTful APIs**.

Additionally the following requirements should be defined in your **TypeScript** / **JavaScript** file header:

.. code-block:: javascript

    import * as fs from "node:fs"
    import * as mupdf from "mupdf"

.. toctree::
    :maxdepth: 2

    files
    document
    page
    annotations/index
    destroy
    glossary