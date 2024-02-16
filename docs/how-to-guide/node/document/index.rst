.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Document:



Working with Documents
=========================

The **Document** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`.


.. _Node_How_To_Guide_Document_Core_API:

Core API
----------------------------------

Once you have a **Document** instance you are free to use the **Core JavaScript API** methods as you wish, please see the :ref:`Core_API` methods for the `Document Class`_ for full details.

Below details some common operations you may need.

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
    


Merge Documents
-----------------------------


Split a Document
-----------------------------

The following exmaple would split a **PDF** document's pages into separate **PDF** files.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)

        // create a new blank PDF Document
        const pdf = new mupdf.PDFDocument()

        // insert the page at the start of the document
        pdf.insertPage(0, page)

        // save new pdf document
        
        i++;
    }


.. include:: ../../../footer.rst




.. _authenticate password return values: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#authenticatePassword