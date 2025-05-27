
.. _Node_How_To_Guide_Annotations_Text:



Text
===============================


Adding Text
-----------------

When it comes to *adding new text* annotations there are three types of annotation to consider:

- ``Text`` - an annotation which looks like a note icon on the page - the text is displayed inside the note. You can also change the look of the icon with :meth:`setIcon` for this annotation if required.
- ``FreeText`` - an annotation with the text freely visible on the page.
- ``Caret`` - an annotation which looks like an "insertion point" icon in between letters - the text is displayed inside the icon.

Sample code
~~~~~~~~~~~~~~~~~~~~

This code sample does the following:

- Loads a file called "test.pdf" and returns a document instance.
- Loads the first page and the adds the following annotations to it:
    - A ``Text`` annotation with text contents at `(50,50)` on the page.
    - A ``FreeText`` annotation with text contents and a default appearance with `PDFAnnotation.setDefaultAppearance` of "Helvetica" size `16` in green color at `(0,0)` on the page.
    - A ``Caret`` annotation with text contents at `(100,50)` on the page.
- Updates the annotations with `PDFAnnotation.update` to ensure they display correctly.
- Saves the document as a new **PDF** file.


|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")
    let document = mupdf.PDFDocument.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)

    // note
    let note = page.createAnnotation("Text")
    note.setContents("I'm a note!")
    note.setRect([50,50,0,0])

    // free text
    let freeText = page.createAnnotation("FreeText")
    freeText.setContents("I'm free text!")
    freeText.setDefaultAppearance("Helv", 16, [0,1,0]);
    freeText.setRect([0,0,200,50])

    // caret
    let caret = page.createAnnotation("Caret")
    caret.setContents("I'm a caret!")
    caret.setRect([100,50,0,0])

    note.update()
    freeText.update()
    caret.update()

    // Save the changes to a new file.
    fs.writeFileSync("output-text.pdf", document.saveToBuffer("incremental").asUint8Array())


.. note::

    For both the `Text` & `Caret` annotations in the example above we only set the upper left `x` and upper right `y` numbers for the `setRect` method (i.e. array in format `[ulx,uly,lrx,lry]`). 
    
    In this way we are treating it like an `x` & `y` point. This is because an icon is placed at that position to represent the annotation.


.. _Node_How_To_Guide_Annotations_Decorating_Text:

Decorating Text
-------------------------

There are four keys to decorate text as follows:

- `Highlight`
- `Underline`
- `Squiggly`
- `StrikeOut`

By using these keys along with the `createAnnotation` method and a set of :ref:`QuadPoints <Glossary_Quads>` to represent the areas of text which we want to decorate we can markup text with our desired decoration type.

The following example would add a yellow highlight text annotation over two lines of text:

|example_tag|

.. code-block:: javascript

    let fileData = fs.readFileSync("test.pdf")
    let document = mupdf.PDFDocument.openDocument(fileData, "application/pdf")
    let page = document.loadPage(0)
    let annotation = page.createAnnotation("Highlight")
    annotation.setColor([1, 1, 0])
    annotation.setQuadPoints([
            [
                20, 65,
                230, 65,
                20, 85,
                230, 85,
            ],
            [
                20, 90,
                230, 90,
                20, 110,
                230, 110,
            ],
        ])

    annotation.update()

    // Save the changes to a new file.
    fs.writeFileSync("output-hl-text.pdf", document.saveToBuffer("incremental").asUint8Array())



Redacting Text
-----------------

Se the section on :ref:`Node_How_To_Guide_Annotations_Redactions` for details.


