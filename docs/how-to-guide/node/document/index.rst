.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Document:



Working with Documents
=========================

.. A **Document** instance has access to the :ref:`Core JavaScript API <https://mupdf.readthedocs.io/en/latest/mupdf-js.html>`. Once you have a **Document** instance you are free to use the **Core JavaScript API** methods as you wish, please see the `Document Class`_ methods in the `Core API`_ for *full details*.

.. _Node_How_To_Guide_Document_Core_API:
..
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

To provide a password use the `authenticate` method as follows:


|example_tag|

.. code-block:: javascript

    let auth = document.authenticate("abracadabra")

See the :ref:`authenticate password return values <authenticate password return values>` for what the return value means.

Document Metadata
---------------------------


Get Metadata
"""""""""""""""""""""

You can get metadata for a document using the :meth:`getMetaData` method. 

The common keys are: `format`, `encryption`, `info:ModDate`, and `info:Title`.


|example_tag|

.. code-block:: javascript

    const format = document.getMetaData("format")
    const modificationDate = document.getMetaData("info:ModDate")
    const author = document.getMetaData("info:Author")


Set Metadata
"""""""""""""""""""""

You can set metadata for a document using the :meth:`setMetaData` method. 


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

To load a :ref:`page <Node_How_To_Guide_Page>` of a :ref:`document <Node_How_To_Guide_Document>` use the :ref:`PDFPage constructor <Classes_PDFPage>` method to return a page instance. 

|example_tag|

.. code-block:: javascript

    // load the 1st page of the document
    let page = new mupdfjs.PDFPage(document, 0)
    


Merging Documents
-----------------------------

|TODO|



To merge documents we need to use the core `GraftObject`_ method and copy objects from documents into a new **PDF** document (the new document will be the result of the merge).

See the script below for an implementation, this can be found in `examples/tools/pdf-merge.js`.

|example_tag|

.. literalinclude:: ../../../../examples/tools/pdf-merge.js
   :language: javascript
   :name: examples/tools/pdf-merge.js


Splitting a Document
-----------------------------

|TODO|

To split a document we can take the :ref:`pages <Node_How_To_Guide_Page>` we want to use and create new documents from them with the `graftPage` method in the order we require.

The following example would split all of a **PDF** document's :ref:`pages <Node_How_To_Guide_Page>` into separate single page **PDF** files.

This script can be found in `examples/tools/split-pages.js`.

|example_tag|

.. literalinclude:: ../../../../examples/tools/split-pages.js
   :language: javascript
   :emphasize-lines: 16
   :name: examples/tools/split-pages.js

Extracting Document Text
-----------------------------

To get the text for an entire document we can retrieve StructuredText_ objects as `JSON` for each page as follows:


|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = new mupdfjs.PDFPage(document, i)
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
        const page = new mupdfjs.PDFPage(document, i)
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


Extracting Document Annotations
-----------------------------------

We can retrieve :ref:`Annotation objects <Node_How_To_Guide_Annotations>` from document pages by querying each page.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = new mupdfjs.PDFPage(document, i)
        const annots = page.getAnnotations()
        console.log(`Page=${page}, Annotations=${annots}`)
        i++
    }


"Baking" a Document
---------------------------

If you need to "bake" your document's annotations and/or widgets you can use the `bake` method as follows:

|example_tag|

.. code-block:: javascript

    document.bake()

.. note::
    
    See the `bake method in the core MuPDF JavaScript API <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#bake>`_ for full explanation & details.

Searching a Document
------------------------------------------

To search a document we can look at each :ref:`page <Node_How_To_Guide_Page>` and use the `search <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#search>`_ method as follows:


|example_tag|

.. code-block:: javascript

    let results = page.search("my search phrase")


.. note::

    The resulting array contains numbers which are a sequence of `[ulx, uly, urx, ury, llx, lly, lrx, lry]` which defines each rectangle for each result. These type of rectangles are known as QuadPoints_ in the **PDF** specification.

    For example, the following would represent a search result with two results showing one "QuadPoint" (or "Quad") for each result:

|example_tag|

.. code-block:: json

    [
        [
            [
                97.44780731201172,
                32.626708984375,
                114.12963104248047,
                32.626708984375,
                97.44780731201172,
                46.032958984375,
                114.12963104248047,
                46.032958984375
            ]
        ],
        [
            [
                62.767799377441406,
                68.626708984375,
                79.44963073730469,
                68.626708984375,
                62.767799377441406,
                82.032958984375,
                79.44963073730469,
                82.032958984375
            ]
        ]
    ]


Getting Document Links
------------------------------------------

To get document links (if any) we can look at each :ref:`page <Node_How_To_Guide_Page>` and use the `getLinks <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#getLinks>`_ method as follows:

.. code-block:: javascript

    let links = page.getLinks()

.. note:: 

    The resulting array contains an array of `Link`_ objects which have their own bounds and `uri` for the link.


Embedding Files
--------------------------

Embedding files uses the :ref:`addEmbeddedFile <Node_How_To_Guide_Annotations_Embedding_Files>` method on the document instance.







.. include:: ../node-footer.rst
.. include:: ../../../footer.rst

