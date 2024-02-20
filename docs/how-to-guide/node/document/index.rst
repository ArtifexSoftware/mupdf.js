.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Document:



Working with Documents
=========================

A **Document** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`.


.. _Node_How_To_Guide_Document_Core_API:

Core API
----------------------------------

Once you have a **Document** instance you are free to use the **Core JavaScript API** methods as you wish, please see the `Document Class`_ methods in the `Core API`_ for *full details*.

|

----

**Below details some common operations you may need.**


Passwords & Security
--------------------------

A document may require a password if it is protected. To check this use the `needsPassword` method as follows:

|example_tag|

.. code-block:: javascript

    let needsPassword = document.needsPassword()


To provide a password use the `authenticatePassword` method as follows:

|example_tag|

.. code-block:: javascript

    let auth = document.authenticatePassword("abracadabra")

See the `authenticate password return values`_ for what the return value means.

Document Metadata
---------------------------


Get Metadata
"""""""""""""""""""""

You can get metadata for a document using the `getMetaData` method. 

The common keys are: `format`, `encryption`, `info:ModDate`, and `info:Title`.


|example_tag|

.. code-block:: javascript

    const format = document.getMetaData("format")
    const modificationDate = document.getMetaData("info:ModDate")
    const author = document.getMetaData("info:Author")


Set Metadata
"""""""""""""""""""""

You can set metadata for a document using the `setMetaData` method. 


|example_tag|

.. code-block:: javascript

    document.setMetaData("info:Author", "Jane Doe")


Get the Document Page Count
---------------------------------

Count the number of :ref:`pages <Node_How_To_Guide_Page>` in the document.


|example_tag|

.. code-block:: javascript

    const numPages = document.countPages()



Load a Page of a Document
-------------------------------------------

To load a :ref:`page <Node_How_To_Guide_Page>` of a document use the `loadPage` method. 


.. note::
    
    The parameter for the page number passed to `loadPage` is zero-indexed.


|example_tag|

.. code-block:: javascript

    // loads the 1st page of the document
    const page = document.loadPage(0) 
    


Merging Documents
-----------------------------

To merge documents we need to use the core `GraftObject`_ method and copy objects from documents into a new **PDF** document (the new document will be the result of the merge).

See the script below for an implementation, this can be found in `examples/tools/pdf-merge.js`.


.. literalinclude:: ../../../../examples/tools/pdf-merge.js
   :language: javascript
   :emphasize-lines: 18-25,30
   :name: examples/tools/pdf-merge.js


Splitting a Document
-----------------------------

To split a document we should take the :ref:`pages <Node_How_To_Guide_Page>` we want to use and create new documents from them in the order we require.

The following example would split all of a **PDF** document's :ref:`pages <Node_How_To_Guide_Page>` into separate single page **PDF** files.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)

        // create a new blank PDF Document
        const pdfDocument = new mupdf.PDFDocument()

        // insert the page at the start of the document
        pdfDocument.insertPage(0, page)

        // save new pdf document in a buffer
        const buffer = pdfDocument.saveToBuffer()
        
        i++;
    }


Extracting Document Text
-----------------------------

To get the text for an entire document we can retrieve StructuredText_ objects as `JSON` for each page as follows:


|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        const json = page.toStructuredText("preserve-whitespace").asJSON()
        console.log(`json=${json}`)
        i++
    }

StructuredText_ contains objects from a page that have been analyzed and grouped into blocks, lines and spans. As such the `JSON` returned is *structured* and contains positional data and font data alongside text values, e.g.:

|example_tag|

.. literalinclude:: ../structured-text-example.json
   :language: json


Extracting Document Images
----------------------------------


To get the images for an entire document we can retrieve StructuredText_ objects and `walk <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#walk>`_ through it looking for images as follows:

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        page.toStructuredText("preserve-images").walk({
            onImageBlock(bbox, matrix, image) {
                // Image found!
                console.log(`onImageBlock, bbox=${bbox}, transform=${transform}, image=${image}`);
            }
        })
        i++
    }


.. note::

    When we obtain StructuredText_ using `toStructuredText` decoding images **does not** happen by default - we have to pass through the `"preserve-images"` parameter. This is because decoding images takes a bit more processing power, so we only do it if requested.



.. include:: ../../../footer.rst




.. _authenticate password return values: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#authenticatePassword