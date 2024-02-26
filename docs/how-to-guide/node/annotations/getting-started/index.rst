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

    let annot = pdfPage.createAnnotation("Text")


Annotation Types
~~~~~~~~~~~~~~~~~~~~~

For annotation *creation* the list of supported types is as follows:

**Annotation types**

.. note::

    Annotation types are also referred to as "subtypes".


.. list-table::
   :header-rows: 1

   * - **Name**
     - **Creation supported**
     - **Notes**
   * - :ref:`Text <Node_How_To_Guide_Annotations_Text>`
     - Yes
     - This is what a "Note" style annotation looks like.
   * - Link
     - No
     - Please use `Page.createLink <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#mutool-run-js-api-page-create-link>`_.
   * - :ref:`FreeText <Node_How_To_Guide_Annotations_Text>`
     - Yes
     - Not to be confused with "Text", free text is displayed straight on the **PDF** page.
   * - Square
     - Yes
     -
   * - Circle
     - Yes
     -
   * - Polygon
     - Yes
     -
   * - PolyLine
     - Yes
     -
   * - Highlight
     - Yes
     -
   * - Underline
     - Yes
     -
   * - Squiggly
     - Yes
     -
   * - StrikeOut
     - Yes
     -
   * - Redact
     - Yes
     -
   * - Stamp
     - Yes
     -
   * - Caret
     - Yes
     -
   * - Ink
     - Yes
     -
   * - Popup
     - No
     -
   * - FileAttachment
     - Yes
     -
   * - Sound
     - Yes
     -
   * - Movie
     - Yes
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


Annotation Properties
--------------------------------------------

List the common properties ...

- Setting size and position with `setRect`.

"Cour", "Helv", "TiRo"


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


.. _Node_How_To_Delete_and_Annotation:

Delete an Annotation
--------------------------



.. include:: ../../node-footer.rst
.. include:: ../../../../footer.rst


