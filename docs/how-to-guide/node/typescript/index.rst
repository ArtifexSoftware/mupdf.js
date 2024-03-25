.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_TypeScript:

Developing with TypeScript
======================================

If you are using **TypeScript** for your development you should note the following:

- Install `@types/node <https://www.npmjs.com/package/@types/node>`_ for the type definitions
- To ensure you can work with the `mupdf` module either work with `mts` files in **TypeScript** or add to your `package.json` the following:

.. code-block:: json

    "type":"module"

- When compiling the **TypeScript** to **JavaScript** use `nodenext`, for example assuming you have a file called `test/mjs` then do the following:

.. code-block:: shell

    tsc -m nodenext test.mts


IDE auto-completion
------------------------

If using **Visual Studio Code** the **MuPDF TypeScript API** (derived from `node_modules/mupdf/dist/mupdf.d.ts`) should be exposed for your use and IDE code prompts will suggest available methods against `mupdf` objects.





.. include:: ../../../footer.rst



