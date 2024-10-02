.. include:: ../header.rst

.. _Classes_PDFDocument:

PDFDocument
===================


|static_method_tag|

.. method:: createBlankDocument(width:number = 595, height:number = 842)

    Creates and returns a one paged :doc:`PDFDocument`. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg width: `number`. Width of document. 
    :arg height: `number`. Height of document.

    :return: `PDFDocument`.

    |example_tag|

    .. code-block:: javascript

        let document = mupdfjs.PDFDocument.createBlankDocument()


|instance_method_tag|

.. method:: newPage(pno: number = -1, width: number = 595, height: number = 842)

    Creates and returns a :doc:`PDFPage` at a given place location in a document. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg pno: `number`. The page location in the document to insert the page `0` = start of document, `-1` = end of document.
    :arg width: `number`. Width of document. 
    :arg height: `number`. Height of document.

    :return: :doc:`PDFPage`.

.. method:: copyPage(pno: number, to: number = -1)

    Copys a page from one index to another in the document.

    :arg pno: `number`. The page location in the document to copy the page from, `0` = start of document, `-1` = end of document.
    :arg to: `number`. The page location in the document to copy the page to, `0` = start of document, `-1` = end of document.


.. method:: graftPage(insertIndex:number, doc:PDFDocument, pnoIndexToCopy:number)

    :arg insertIndex: `number`. The page location in the document to copy the page to, `0` = start of document, `-1` = end of document.
    :arg doc: :doc:`PDFDocument`. The document to copy from.
    :arg pnoIndexToCopy: `number`. The page location in the document to copy the page to, `0` = start of document, note you cannot specify `-1` here for the end of the document as the page tree may not be ready. Therefore the page to copy must be explicity defined.


.. method:: deletePage(index:number)

    Deletes a page at a specific index. Zero-indexed.

    :arg index: `number`. `0` = first page of document.


.. method:: deletePages(...args: any[])

    A convenience method for deleting a range of pages.
    
    :arg ...args: `any[]`.

    **Using a range**

    Use `number, number` to delete a range of pages including the start and end index.

    **Using keywords**

    Use `{fromPage:number, toPage:number}` to delete a range of pages between the `fromPage` and the `toPage` (and including the `fromPage` and the `toPage`).

    For example if you called: `document.deletePages({fromPage:2, toPage:5})` it would delete pages at indexes 2,3,4 & 5.

    **Using a set**

    Use `[number, ...]` to define the pages you want to delete.

    For example if you called: `document.deletePages([0, 4, 6, 7])` it would delete pages at indexes 0,4,6 & 7.

    .. note::

        Remember pages indexes are **zero-indexed**! Thus `document.deletePages({fromPage:1, toPage:3})` is actually deleting from page 2 of your document.



.. method:: needsPassword()

    Returns `true` if a password is required to open a password protected PDF.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var needsPassword = document.needsPassword();

.. _authenticate password return values:

.. method:: authenticate(password:string)

    Returns a bitfield value against the password authentication result.

    :arg password: `string`. The password to attempt authentication with.
    :return: `number`.

    **Return values**

    .. list-table::
        :header-rows: 1

        * - **Bitfield value**
          - **Description**
        * - `0`
          - Failed
        * - `1`
          - No password needed
        * - `2`
          - Is User password and is okay
        * - `4`
          - Is Owner password and is okay
        * - `6`
          - Is both User & Owner password and is okay

    |example_tag|

    .. code-block:: javascript

        var auth = document.authenticate("abracadabra");


.. method:: hasPermission(permission:string)

    Returns `true` if the document has permission for the supplied `permission` parameter.

    :arg permission: `string` The permission to seek for, e.g. "edit".
    :return: `boolean`.


    **Permission strings**

    .. list-table::
        :header-rows: 1

        * - **String**
          - **Description**
        * - ``print``
          - Can print
        * - ``edit``
          - Can edit
        * - ``copy``
          - Can copy
        * - ``annotate``
          - Can annotate
        * - ``form``
          - Can fill out forms
        * - ``accessibility``
          - Can copy for accessibility
        * - ``assemble``
          - Can manage document pages
        * - ``print-hq``
          - Can print high-quality


    |example_tag|

    .. code-block:: javascript

        var canEdit = document.hasPermission("edit");


.. method:: getMetaData(key:string)

    Return various meta data information. The common keys are: `format`, `encryption`, `info:ModDate`, and `info:Title`.

    :arg key: `string`.
    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var format = document.getMetaData("format");
        var modificationDate = doc.getMetaData("info:ModDate");
        var author = doc.getMetaData("info:Author");


.. method:: setMetaData(key:string, value:string)

    Set document meta data information field to a new value.

    :arg key: `string`.
    :arg value: `string`.

    |example_tag|

    .. code-block:: javascript

        document.setMetaData("info:Author", "My Name");



.. method:: countPages()

    Count the number of pages in the document.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var numPages = document.countPages();



.. method:: loadOutline()

    Returns an array with the outline (also known as "table of contents" or "bookmarks"). In the array is an object for each heading with the property 'title', and a property 'page' containing the page number. If the object has a 'down' property, it contains an array with all the sub-headings for that entry.

    :return: `[...]`.


    |example_tag|

    .. code-block:: javascript

        var outline = document.loadOutline();


.. method:: outlineIterator()

    Returns an :doc:`OutlineIterator` for the document outline.

    :return: :doc:`OutlineIterator`.

    |example_tag|

    .. code-block:: javascript

        var obj = document.outlineIterator();


.. method:: resolveLink(uri:string)

    Resolve a document internal link :title:`URI` to a page index.

    :arg uri: `string`.
    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var pageNumber = document.resolveLink(uri);



.. method:: resolveLinkDestination(uri:string)

    Resolve a document internal link :title:`URI` to a link destination.

    :arg uri: `string`.
    :return: :ref:`Link destination <Glossary_Object_Protocols_Link_Destination_Object>`.

    |example_tag|

    .. code-block:: javascript

        var linkDestination = document.resolveLinkDestination(uri);


.. method:: formatLinkURI(linkDestination:object)

    Format a document internal link destination object to a :title:`URI` string suitable for :meth:`createLink`.

    :arg linkDestination: `object`. :ref:`Link destination <Glossary_Object_Protocols_Link_Destination_Object>`.
    :return: `string`.


    |example_tag|

    .. code-block:: javascript

        var uri = document.formatLinkURI({chapter:0, page:42,
                type:"FitV", x:0, y:0, width:100, height:50, zoom:1});
        document.createLink([0,0,100,100], uri);


|TODO|

.. method:: getPageLabels()


.. method:: setPageLabelsArray()


.. method:: getPageNumbers()


.. include:: footer.rst
.. include:: ../footer.rst



