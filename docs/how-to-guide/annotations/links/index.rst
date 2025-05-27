.. _Node_How_To_Guide_Annotations_Links:

Managing Links
===============================

Links are a special kind of annotation which are not related to the :mupdf:`PDFAnnotation` class. Instead they use the :mupdf:`Link` class.

Getting Page Links
------------------------

Links can be retrieved with the :meth:`getLinks` method on a :ref:`page <Node_How_To_Guide_Page>` instance, assuming the page contains a link then it can be investigated as follows:

|example_tag|

.. code-block:: javascript

    let links = page.getLinks()

    if (links.length) {
        let link = links[0]
        let linkBounds = link.getBounds()
        let linkURI = link.getURI()
        let linkIsExternal = link.isExternal()
    }

.. note::

    The resulting array contains an array of :mupdf:`Link` objects which have their own bounds and ``uri`` for the link.

    If there are no links then an empty array is returned.

Creating Links
-------------------

To create a link use :meth:`insertLink` from the :mupdf:`PDFPage` class.

There are two fundamental kinds of links:

- External **URI** links to websites
- Internal document links

Adding an external link is relatively simple, for example, this would add a link area with a bounding box of ``100x30`` at the top left of the document which hyperlinked to ``https://mupdfjs.readthedocs.io``.

|example_tag|

.. code-block:: javascript

    page.createLink([ 10, 10, 100, 40 ], "https://mupdfjs.readthedocs.io")

For an internal document link we need to understand a little about the :mupdf:`LinkDestination` and create a suitable object to represent our needs for the link.

We then need to format the link destination object with :meth:`formatLinkURI` and create the link.

For example, this would add a link with a bounding box of ``100x100`` at the top left of the page which would link to page 2 of the document (because page numbers are zero-indexed).

|example_tag|

.. code-block:: javascript

    page.createLink([x, y, x + width, y + height], document.formatLinkURI({ type: "Fit", page: 1 }))

Resolving Internal Links
----------------------------

Sometimes when we retrieve a link object it may be an internal link. Use :meth:`resolveLinkDestination` to a :mupdf:`LinkDestination` do the following:

|example_tag|

.. code-block:: javascript

    let linkDestinationObject = document.resolveLinkDestination(my_link)

Deleting Links
--------------------

Use the ``deleteLink`` method on a :mupdf:`PDFPage` instance as follows:

|example_tag|

.. code-block:: javascript

    page.deleteLink(link)
