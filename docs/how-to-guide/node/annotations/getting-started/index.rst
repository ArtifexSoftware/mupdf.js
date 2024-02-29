.. include:: ../../../../header.rst
.. include:: ../../node-header.rst

.. _Node_How_To_Guide_Annotations_Getting_Started:



Getting Started
=======================================


.. _Node_How_To_Guide_Annotations_Getting_Started_Annotation_Creation:

Create an Annotation
----------------------

To create an annotation use the `createAnnotation`_ method on the `PDFPage`_ class.

For example, assuming you have acquired an instance of a `PDFPage`_, to create a text annotation do the following:

|example_tag|

.. code-block:: javascript

    let annotation = page.createAnnotation("Text")


.. _Node_How_To_Guide_Annotations_Getting_Started_Annotation_Deletion:

Delete an Annotation
--------------------------

To delete an annotation use the `deleteAnnotation`_ method on the `PDFPage`_ class.

|example_tag|

.. code-block:: javascript

    page.deleteAnnotation(annotation)


Annotation Types
--------------------------------------------

For annotation *creation* the list of supported types is as follows:

**Annotation types**

.. list-table::
   :header-rows: 1

   * - **Name**
     - **Creation supported**
     - **Notes**
   * - :ref:`Text <Node_How_To_Guide_Annotations_Text>`
     - Yes
     - This is what a "Note" style annotation looks like.
   * - :ref:`Link <Node_How_To_Guide_Annotations_Links>`
     - Yes
     - 
   * - :ref:`FreeText <Node_How_To_Guide_Annotations_Text>`
     - Yes
     - Not to be confused with the "Text" type, "FreeText" is displayed straight on the **PDF** page.
   * - :ref:`Square <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes>`
     - Yes
     -
   * - :ref:`Circle <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes>`
     - Yes
     -
   * - :ref:`Line <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes>`
     - Yes
     -
   * - :ref:`Polygon <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes>`
     - Yes
     -
   * - :ref:`PolyLine <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Shapes>`
     - Yes
     -
   * - :ref:`Highlight <Node_How_To_Guide_Annotations_Decorating_Text>`
     - Yes
     - 
   * - :ref:`Underline <Node_How_To_Guide_Annotations_Decorating_Text>`
     - Yes
     - 
   * - :ref:`Squiggly <Node_How_To_Guide_Annotations_Decorating_Text>`
     - Yes
     - 
   * - :ref:`StrikeOut <Node_How_To_Guide_Annotations_Decorating_Text>`
     - Yes
     - 
   * - :ref:`Redact <Node_How_To_Guide_Annotations_Redactions>`
     - Yes
     -
   * - :ref:`Stamp <Node_How_To_Guide_Annotations_Stamps>`
     - Yes
     -
   * - :ref:`Caret <Node_How_To_Guide_Annotations_Text>`
     - Yes
     - 
   * - :ref:`Ink <Node_How_To_Guide_Annotations_Drawing_and_Shapes_Drawing>`
     - Yes
     -
   * - :ref:`FileAttachment <Node_How_To_Guide_Annotations_Embedding_Files>`
     - Yes
     -
   * - Sound
     - No
     -
   * - Movie
     - No
     -
   * - Popup
     - No
     -
   * - RichMedia
     - No
     -
   * - Widget
     - No
     -
   * - Screen
     - No
     -
   * - PrinterMark
     - No
     -
   * - TrapNet
     - No
     -
   * - Watermark
     - No
     -
   * - 3D
     - No
     -
   * - Projection
     - No
     -


.. note::

    Annotation types are also referred to as "subtypes".





.. _Node_How_To_Get_All_Annotations:

Get All Annotations for a Document
------------------------------------------

The following code queries all the pages of a :ref:`document <Node_How_To_Guide_Document>` to retrieve the annotations on each :ref:`page <Node_How_To_Guide_Page>`.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        const annots = page.getAnnotations()
        console.log(`Page=${page}, Annotations=${annots}`)
        i++
    }

----


Common Annotation Methods
--------------------------------------------

The following list shows some of the most commonly used methods to work with annotations. This list is *not exhaustive* - see the `PDFAnnotation class`_ for the full **API**. 


Get the Annotation Type
~~~~~~~~~~~~~~~~~~~~~~~~~~~

- `getType <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#id42>`_



Position and Size 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- `getBounds <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#id35>`_
- `hasRect <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#hasRect>`_
- `getRect <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getRect>`_
- `hasRect <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setRect>`_


Author
~~~~~~~~~~


- `hasAuthor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#hasAuthor>`_
- `getAuthor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getAuthor>`_
- `setAuthor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setAuthor>`_


Getting/Setting Annotation Date
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


- `getCreationDate <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getCreationDate>`_
- `setCreationDate <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setCreationDate>`_
- `getModificationDate <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getModificationDate>`_
- `setModificationDate <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setModificationDate>`_

Graphics and Drawing
~~~~~~~~~~~~~~~~~~~~~~~~~~

**Obtain a Pixmap from an annotation**


- `toPixmap <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#id37>`_

**Icon properties**


- `hasIcon <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#hasIcon>`_
- `getIcon <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getIcon>`_
- `setIcon <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setIcon>`_


**Color and opacity**


- `getColor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getColor>`_
- `setColor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setColor>`_
- `hasInteriorColor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#hasInteriorColor>`_
- `getInteriorColor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getInteriorColor>`_
- `setInteriorColor <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setInteriorColor>`_
- `getOpacity <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#getOpacity>`_
- `setOpacity <https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setOpacity>`_





.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst


