.. include:: ../header.rst

.. _Getting_Started:

Getting Started
===================

Fundamentally you can try **MuPDF.js** in two ways:

- With :ref:`NPM & Node <Getting_Started_With NPM and Node>`
- With :ref:`Repository Source Code Files <Getting_Started_With Repository Source Code Files>`


.. _Getting_Started_With NPM and Node:

Getting Started with **NPM** & **Node**
---------------------------------------------

.. note::

    This assumes you have `Node JS & NPM`_ installed on your system and have a basic knowledge of it!


.. _npm_install:

1. **NPM** Install
~~~~~~~~~~~~~~~~~~~~

From the command line, go to the project folder you want to work from and install via **NPM** as follows:

.. code-block:: bash

    npm install mupdf

This will then install the dependency you need to work with **MuPDF.js** in your `package.json` file.

2. Create a Test File 
~~~~~~~~~~~~~~~~~~~~~~~

To verify your installation you can create a file, e.g. `test.mjs` with the following script:

.. code-block:: javascript

    import * as mupdfjs from "mupdf/mupdfjs"
    console.log(mupdfjs)


3. Run the Test
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Then, on the command line for the project folder, run the test script with `node`:

.. code-block:: bash

    node test.mjs

This will print the `mupdfjs` object to the output - you are now ready to :ref:`use it! <How_To_Guide_With_Node>`

|

----

|

.. _With the Source Code Files:

Getting Started with the Repository Source Code Files
--------------------------------------------------------


.. note::

    This assumes you have `Git`_ & `Python`_ installed on your system and have a basic knowledge of it!


.. _Getting_Started_With Repository Source Code Files:


1. Checkout the Repository
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Check out the `MuPDF.js repository on Github`_ as follows: 

.. code-block:: bash
    
    git clone git@github.com:ArtifexSoftware/mupdf.js.git



2. Initialize the Submodules
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash
    
    git submodule update --init --recursive

This will then create the `libmupdf` folder which is required to build the **MuPDF** libraries.



3. Build the **MuPDF** libraries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. note:: 
    
    Check the `BUILDING.md <https://github.com/ArtifexSoftware/mupdf.js/blob/master/BUILDING.md>`_ file for full details!

On the root of your checkout run:

.. code-block:: bash

    make

This will then create the `dist` folder with the required **Wasm** library and associated **TypeScript** & **JavaScript** files.


3.1. Building smaller WASM builds
""""""""""""""""""""""""""""""""""

Please note the `build.sh` file includes build options which can configure what you might want to include in your WASM build from MuPDF

The line which defines this with the `MUPDF_OPTS` variable, e.g.:

`MUPDF_OPTS="-Os -DTOFU -DTOFU_CJK_EXT -DFZ_ENABLE_XPS=0 -DFZ_ENABLE_SVG=0 -DFZ_ENABLE_CBZ=0 -DFZ_ENABLE_IMG=0 -DFZ_ENABLE_HTML=0 -DFZ_ENABLE_EPUB=0 -DFZ_ENABLE_JS=0 -DFZ_ENABLE_OCR_OUTPUT=0 -DFZ_ENABLE_DOCX_OUTPUT=0 -DFZ_ENABLE_ODT_OUTPUT=0"`

You can adjust these definitions to suit the kind of WASM build you need (note: of course this affects the file size of the resulting `mupdf-wasm.wasm`).

Generally the more `-DTOFU` type options you give then the fewer fonts are included.

**Defining settings building with specific font sets**

.. list-table::
        :header-rows: 1
        :widths: 50,50

        * - **Name**
          - **Description**
        * - `-DTOFU`
          - To avoid all noto fonts except CJK
        * - `-DTOFU_CJK`
          - To skip the CJK font (this implicitly enables `-DTOFU_CJK_EXT` and `-DTOFU_CJK_LANG`)
        * - `-DTOFU_CJK_EXT`
          - To skip CJK Extension A (this implicitly enables `-DTOFU_CJK_LANG`)
        * - `-DTOFU_CJK_LANG`
          - To skip CJK language specific fonts
        * - `-DTOFU_EMOJI`
          - To skip the Emoji font
        * - `-DTOFU_HISTORIC`
          - To skip the ancient/historic font
        * - `-DTOFU_SYMBOL`
          - To skip the symbol font
        * - `-DTOFU_SIL`
          - To skip the SIL fonts


.. note::

    If you do change the build options, then ensure to run `make clean` before `make` to get up-to-date build results in the `dist` folder.

4. Create **HTML** & **JS** Test Files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Just to try things out we can create a couple of test files to see if we can see the `mupdfjs` object in the browser.

- Create a file called `test.html` and populate it as follows:

.. code-block:: html

    <html>
        <script>
            const worker = new Worker("worker.js", { type: "module" });
        </script>
    </html>

- Create a file called `worker.js` and populate it as follows:


.. code-block:: javascript

    "use strict"

    import * as mupdfjs from "../../dist/mupdfjs.js"

    for (var i in mupdfjs) {
        console.log(`mupdfjs=${mupdfjs[i]}`)
    }

Ensure to save the files in the root of the your git checkout so the library files can be accessed.

5. Start a Server with **Python** 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because we are relying on web workers to run local **JavaScript** files we need to run the `test.html` in a server context.

Start a local server with **Python** as follows:

.. code-block:: bash
    
    python -m http.server


6. Open the **HTML** Test File
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


Finally, open in a browser with the following **URL**:

`http://localhost:8000/test.html`_


Inspect the `console` log in your browser and you should see the internals of the **MuPDF** object printed out - you are now ready to use it!



.. include:: ../footer.rst


