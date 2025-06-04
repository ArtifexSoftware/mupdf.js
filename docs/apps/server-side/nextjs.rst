Next.js
==========

The two projects in `examples/nextjs <https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples/nextjs>`_  together form the two halves
of a server-side web app.

Thin Client Side
----------------

The browser half of the project in `examples/nextjs/nextjs-client <https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples/nextjs/nextjs-client>`_ talks to the server side using a REST API.

Server Side
-----------

The server half of the project in `examples/nextjs/rest-server <https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples/nextjs/rest-server>`_  does the heavy lifting with MuPDF.js and provides
a REST API for the client side to call.

Getting Started
---------------


Start the REST server
~~~~~~~~~~~~~~~~~~~~~~~

At the root of your ``rest-server`` code checkout install the dependencies and start the server with:

.. code-block::

    npm install
    npm run build
    npm run start


Start the client
~~~~~~~~~~~~~~~~~~~

At the root of your ``nextjs-client`` code checkout install the dependencies and start the client with:

.. code-block::
    
	npm install
	npm run dev

Run the browser
-------------------

All being well and you will now be running both client and server instances!
Now  visit http://localhost:3000 to see the REST API Console. 
This UI allows you to test the MuPDF.js API against the supplied ``test.pdf`` file.


Changing the input file
-----------------------

If you want to change your input file then update the reference in the client side on `page.tsx <https://github.com/ArtifexSoftware/mupdf.js/blob/master/examples/nextjs/nextjs-client/app/page.tsx#L5>`_ and ensure that your
new PDF is placed within the `public folder of the REST server component <https://github.com/ArtifexSoftware/mupdf.js/tree/master/examples/nextjs/rest-server/public>`_.