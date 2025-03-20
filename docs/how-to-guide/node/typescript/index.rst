.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_TypeScript:

Developing with TypeScript
======================================

If you are using **TypeScript** for your development you should create a `tsconfig.json` file at the root of your project with the minimal configuration:

.. code-block:: json

    {
        "compilerOptions": {
            "module": "nodenext"
        }
    }

- To ensure you can work with the `mupdf` module either work with `mts` files in **TypeScript** or use `ts` files and add to your `package.json` the following:

.. code-block:: json

    "type": "module"

- When compiling the **TypeScript** to **JavaScript** use the following to trigger the compiler:

.. code-block:: shell

    tsc


IDE auto-completion
------------------------

If using **Visual Studio Code** the **MuPDF TypeScript API** (derived from `node_modules/mupdf/dist/mupdf.d.ts`) should be exposed for your use and IDE code prompts will suggest available methods against `mupdf` objects.





.. include:: ../../../footer.rst



