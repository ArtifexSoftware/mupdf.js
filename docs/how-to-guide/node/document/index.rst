.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Document:



Working with Documents
=========================

.. _Node_How_To_Guide_Document_Core_API:

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
    

Splitting a Document
-----------------------------

To split a document's pages into new documents use the :meth:`split` method. Supply an array of page indicies that you want to use for the splitting operation.

|example_tag|

.. code-block:: javascript

    let documents = document.split([0,2,3])

The example above would return three new documents from a **10 page PDF** as the following:

- Document containing pages 1 & 2 (from index `0`)
- Document containing page 3 (from index `2`)
- Document containing pages 4-10 (from final index `3`)




Merging Documents
-----------------------------

To merge documents we can use the :meth:`merge` method.

See the script below for an example implementation.

|example_tag|

.. code-block:: javascript

    // create a blank document and add some text
    let sourcePDF = mupdfjs.PDFDocument.createBlankDocument()
    let page = new mupdfjs.PDFPage(sourcePDF, 0)
    page.insertText("HELLO WORLD", 
                        [0,0], 
                        "Times-Roman", 
                        20, 
                        {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:0.5})
    // now merge this document onto page 2 of our document and rotate it by 90 degrees
    document.merge(sourcePDF, 0, -1, 1, 90);


Extracting Document Text
-----------------------------

To get the text for an entire document we can retrieve :doc:`../../../classes/StructuredText` objects as `JSON` for each page as follows:


|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = new mupdfjs.PDFPage(document, i)
        const json = page.toStructuredText("preserve-whitespace").asJSON()
        console.log(`json=${json}`)
        i++
    }

:doc:`../../../classes/StructuredText` contains objects from a page that have been analyzed and grouped into blocks, lines and spans. As such the `JSON` returned is *structured* and contains positional data and font data alongside text values, e.g.:

|example_tag|

.. literalinclude:: ../structured-text-example.json
   :language: json


Extracting Document Images
----------------------------------


To get the images for an entire document use the :meth:`getImages` method on each :ref:`page <Node_How_To_Guide_Page>`.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = new mupdfjs.PDFPage(document, i)
        let images = page.getImages()
        i++
    }

Extracting Document Annotations
-----------------------------------

We can retrieve :ref:`Annotation objects <Node_How_To_Guide_Annotations>` from document pages by querying each page with :meth:`getAnnotations`.

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

If you need to flatten your document's annotations and/or widgets this is known as "baking".

You can use the :meth:`bake` method as follows:

|example_tag|

.. code-block:: javascript

    document.bake()


.. _Node_How_To_Attach_File_To_Document:

Attaching a File to a Document
-----------------------------------

Use the :meth:`attachFile` method on a document instance with a supplied name and :doc:`../../../classes/Buffer` for the data.

|example_tag|

.. code-block:: javascript

    const content = "Test content";
    const buffer = new mupdfjs.Buffer();
    buffer.writeLine(content);
    doc.attachFile("test.txt", buffer);


Removing a File from a Document
----------------------------------------------------------------------

Use the :meth:`deleteEmbeddedFile` method on a document instance to remove an attached file.

|example_tag|

.. code-block:: javascript

    document.deleteEmbeddedFile("test.txt")


Searching a Document
------------------------------------------

To search a document we can look at each :ref:`page <Node_How_To_Guide_Page>` and use the :meth:`search` method as follows:


|example_tag|

.. code-block:: javascript

    let results = page.search("my search phrase")


.. note::

    The resulting array contains numbers which are a sequence of `[ulx, uly, urx, ury, llx, lly, lrx, lry]` which defines each rectangle for each result. These type of rectangles are known as :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>` in the :title:`PDF` specification.

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

To get document links (if any) we can look at each :ref:`page <Node_How_To_Guide_Page>` and use the :meth:`getLinks` method as follows:

.. code-block:: javascript

    let links = page.getLinks()

.. note:: 

    The resulting array contains an array of :doc:`../../../classes/Link` objects which have their own bounds and `uri` for the link.









.. include:: ../node-footer.rst
.. include:: ../../../footer.rst

