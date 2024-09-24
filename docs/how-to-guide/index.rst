.. include:: ../header.rst

.. _How_To_Guide:

How To Guide
===================

The code samples in this **"How To Guide"** assume that you are working with `Node.js`_ in the root folder of your project and you have :ref:`Installed MuPDF.js via NPM <npm_install>`.

`Node.js`_ is a runtime environment which allows you to run **JavaScript** outside the of the web browser. It is commonly used for server-side **JavaScript** solutions and **RESTful APIs**.

Additionally the following requirements should be defined in your **TypeScript** / **JavaScript** file header:

.. code-block:: javascript

    import * as fs from "fs"
    import * as mupdfjs from "mupdfjs"

----

|node_js_logo|

.. toctree::
    :caption: How to with Node.js
    :maxdepth: 2

    node/typescript/index.rst
    node/files/index.rst
    node/document/index.rst
    node/page/index.rst
    node/annotations/index.rst




.. toctree::
    :caption: Migrating from mupdf-js
    :maxdepth: 1

    migration/index.rst


.. toctree::
    :caption: Glossary
    :maxdepth: 1

    coordinate-system/index.rst
    destroy/index.rst


.. include:: ../footer.rst



