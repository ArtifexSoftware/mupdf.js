.. include:: ../../header.rst

.. _How_To_Guide_With_Node:
.. _How_To_With_Node_JS:

|node_js_logo|

Node.js
===========================

`Node.js`_ is a runtime environment which allows you to run **JavaScript** outside the of the web browser. It is commonly used for server-side **JavaScript** solutions and **RESTful APIs**.

The code samples in this **"How To Guide"** assume that you are working in the root folder of your project and you have :ref:`Installed MuPDF.js via NPM <npm_install>`.

Additionally the following requirements should be defined in your **JavaScript** file header:

.. code-block:: javascript

    const mupdf = require("mupdf")
    const fs = require("fs")


----


Table of Contents
-------------------

.. toctree::
    :caption: Node.js
    :maxdepth: 2

    loading-files/index.rst
    document/index.rst
    page/index.rst
    annotations/index.rst




.. include:: ../../footer.rst


