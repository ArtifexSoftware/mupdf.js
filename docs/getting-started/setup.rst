.. _Getting_Started:

Setup with NPM
===================

You can try **MuPDF.js** by using NPM & Node.js.

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

    import * as mupdf from "mupdf"
    console.log(mupdf)

3. Run the Test
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Then, on the command line for the project folder, run the test script with `node`:

.. code-block:: bash

    node test.mjs

This will print the `mupdf` object to the output - you are now ready to :ref:`use it! <How_To_Guide_With_Node>`

4. Create **HTML** & **JS** Test Files
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Just to try things out we can create a couple of test files to see if we can see the `mupdf` object in the browser.

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

    import * as mupdf from "../../dist/mupdf.js"

    for (var name in mupdf) {
        console.log(`mupdf.${name}=${mupdf[name]}`)
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
