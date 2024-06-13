.. include:: ../../../../header.rst
.. include:: ../../node-header.rst

.. _Node_How_To_Guide_Annotations_Links:



Managing Links
===============================

Links are a special kind of annotation which are not related to the PDFAnnotation_ class. Instead they use the Link_ class.


Getting Page Links
------------------------

Links can be retrieved with the `getLinks` method on a :ref:`page <Node_How_To_Guide_Page>` instance, assuming the page contains a link then it can be investigated as follows:

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

    The resulting array contains an array of `Link`_ objects which have their own bounds and `uri` for the link.

    If there are no links then an empty array is returned.


Creating Links
-------------------

To create a link use the `createLink <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#createLink>`_ method.

There are two fundamental kinds of links:

- External **URI** links to websites
- Internal document links

Adding an external link is relatively simple, for example, this would add a link area with a bounding box of `100x100` at the top left of the document which hyperlinked to `https://mupdfjs.readthedocs.io`.


|example_tag|

.. code-block:: javascript

    page.createLink([0,0,100,100], "https://mupdfjs.readthedocs.io")


For an internal document link we need to understand a little about the `Link Destination Object`_ and create a suitable object to represent our needs for the link.

We then need to `format the link destination object <https://mupdf.readthedocs.io/en/latest/mutool-object-document.html#formatLinkURI>`_ and create the link.

For example, this would add a link with a bounding box of `100x100` at the top left of the page which would link to page 2 of the document (because page numbers are zero-indexed).

|example_tag|

.. code-block:: javascript

    page.createLink([0,0,100,100], document.formatLinkURI({ type: "Fit", page: 1 }))


Resolving Internal Links
----------------------------

Sometimes when we retrieve a link object it may be an internal link. To `resolve a link <https://mupdf.readthedocs.io/en/latest/mutool-object-document.html#resolveLinkDestination>`_ to a `Link Destination Object`_ do the following:

|example_tag|

.. code-block:: javascript
    
    let linkDestinationObject = document.resolveLinkDestination(my_link)



Deleting Links
--------------------

Use the `deleteLink <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#deleteLink>`_ method on a :ref:`page <Node_How_To_Guide_Page>` instance as follows:

|example_tag|

.. code-block:: javascript

    page.deleteLink(link)




.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst
