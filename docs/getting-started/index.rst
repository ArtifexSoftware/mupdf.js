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


1. **NPM** Install
~~~~~~~~~~~~~~~~~~~~

From the command line, go to the project folder you want to work from and install via **NPM** as follows:

.. code-block:: bash

    npm install mupdf

This will then install the dependency you need to work with **MuPDF.js** in your `package.json` file.

2. Create a Test File 
~~~~~~~~~~~~~~~~~~~~~~~

To verify your installation you can create a file, e.g. `test.js` with the following script:

.. code-block:: javascript

    const mupdf = require("mupdf")
    console.log(mupdf)


3. Run the Test
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Then, on the command line for the project folder, run the test script with `node`:

.. code-block:: bash

    node test.js

This will print the `mupdf` object to the output - you are now ready to use it!

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

On the root of your checkout run:

.. code-block:: bash

    make

This will then update the `lib` folder with the required **Wasm** library and associated **JavaScript** file.

4. Create a Simple **HTML** & **JS** Test Files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Just to try things out we can create a couple of test files to see if we can see the `mupdf` object in the browser.

- Create a file called `test.html` and populate it as follows:

.. code-block:: html

    <html>
        <script>
            const worker = new Worker("worker.js")
        </script>
    </html>

- Create a file called `worker.js` and populate it as follows:


.. code-block:: javascript

    "use strict"

    // Import the Wasm module.
    globalThis.__filename = "lib/mupdf-wasm.js"
    importScripts("lib/mupdf-wasm.js")

    // Import the MuPDF bindings.
    importScripts("lib/mupdf.js")

    for (var i in mupdf) {
        console.log(`mupdf=${mupdf[i]}`)
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


