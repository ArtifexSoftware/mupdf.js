
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

To provide a password use the `authenticatePassword` method as follows:


|example_tag|

.. code-block:: javascript

    let auth = document.authenticatePassword("abracadabra")

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
    let page = document.loadPage(0)
    

Extracting Document Text
-----------------------------

To get the text for an entire document we can retrieve :doc:`../../../classes/StructuredText` objects as `JSON` for each page as follows:


|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        const json = page.toStructuredText("preserve-whitespace").asJSON()
        console.log(`json=${json}`)
        i++
    }

:doc:`../../../classes/StructuredText` contains objects from a page that have been analyzed and grouped into blocks, lines and spans. As such the `JSON` returned is *structured* and contains positional data and font data alongside text values, e.g.:

|example_tag|

.. literalinclude:: ../structured-text-example.json
   :language: json


Extracting Document Annotations
-----------------------------------

We can retrieve :ref:`Annotation objects <Node_How_To_Guide_Annotations>` from document pages by querying each page with :meth:`getAnnotations`.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(0)
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










