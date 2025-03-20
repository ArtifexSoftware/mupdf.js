Tasks Module
########

The ``mupdf/tasks`` module contains miscellaneous functions to help migrating from older versions.

You can use these functions as a temporary fix, but you should ideally stop
depending on this module and start using the official MuPDF library directly,
as the code here is not actively maintained.

Functions
===========

.. method:: tasks.createBlankDocument(width:number = 595, height:number = 842)

    Creates and returns a one paged :doc:`PDFDocument`. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg width: `number`. Width of document. 
    :arg height: `number`. Height of document.

    :return: `PDFDocument`.

    |example_tag|

    .. code-block:: javascript

        let document = tasks.createBlankDocument()

.. method:: tasks.newPage(document, pno: number = -1, width: number = 595, height: number = 842)

    Creates and returns a :doc:`PDFPage` at a given place location in a document. If no width or height is supplied then the default values for an A4 sized document will be used.

    :arg pno: `number`. The page location in the document to insert the page `0` = start of document, `-1` = end of document.
    :arg width: `number`. Width of document. 
    :arg height: `number`. Height of document.

    :return: :doc:`PDFPage`.

.. method:: tasks.copyPage(document, pno: number, to: number = -1)

    Copys a page from one index to another in the document.

    :arg pno: `number`. The page location in the document to copy the page from, `0` = start of document, `-1` = end of document.
    :arg to: `number`. The page location in the document to copy the page to, `0` = start of document, `-1` = end of document.



.. method:: tasks.deletePages(document, ...args: any[])

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


.. method:: tasks.split(document, range: number[] | undefined)

    Splits a document into multiple documents with defined page ranges and returns a new set of documents.
    
    Supply a range of page numbers to be considered for how to split the document pages.

    For example if you wanted to split out the first two pages of a document then use: `[0,2]` - this supplies the page indicies to be used - page's referenced by `0` & `1` will be in one document, all pages from index `2` will be in the other document.

    :arg range: `number[]` or `undefined`. Page indicies for operation. If `undefined` then the document splits the document pages into single page document instances (one page for each document).

    :return: `PDFDocument[]`.

    |example_tag|

    .. code-block:: javascript
        
        // split out 3 documents, the first two pages, then page three, then everything from page 4 onwards
        var documents = tasks.split(document, [0, 2, 3])

    .. note::

        Remember page indexes are zero-indexed! i.e. Page 1 = index `0`!


.. method:: tasks.merge(targetPDF: PDFDocument, sourcePDF: PDFDocument, fromPage: number = 0, toPage: number = -1, startAt: number = -1, rotate: 0 | 90 | 180 | 270 = 0, copyLinks: boolean = true, copyAnnotations: boolean = true) 

    Merges two documents together with options.

    :arg sourcePDF: :doc:`PDFDocument`. The source :title:`PDF` to merge into the document instance.
    :arg fromPage: `number`. The start page, defaults to the first page of the document (`0`).
    :arg toPage: `number`. The end page, defaults to the last page of the document (`-1)`.
    :arg startAt: `number`. Where to insert the `sourcePDF` pages in the document instance, defaults to the last page (`-1)`.
    :arg rotate: `number`. Sets rotstion of inserted pages, defaults to no rotation (`0`).
    :arg copyLinks: `boolean`. Whether to copy document links from the `sourcePDF` or not, defaults to `true`.
    :arg copyAnnotations: `boolean`. Whether to copy document annotations from the `sourcePDF` or not, defaults to `true`.

    |example_tag|

    .. code-block:: javascript

        // merge another document (sourcePDF) onto page 2 of our document instance
        tasks.merge(document, sourcePDF, 0, -1, 1);


.. method:: tasks.attachFile(document, name: string, data: Buffer | ArrayBuffer | Uint8Array, options?: {filename?: string; creationDate?: Date; modificationDate?: Date;})

    Attach a file to a document by supplying a name and buffer of data.

    :arg name: `string`. The name of the file.
    :arg data: `Buffer | ArrayBuffer | Uint8Array`. Data for file.
    :arg options: `{filename?: string; creationDate?: Date; modificationDate?: Date;}`. Optional metadata.

        - `filename`. Optionally supply a file name separately from the previous `name` parameter. (Defaults to `name` if not supplied)
        - `creationDate`. Optionally supply a JavaScript `Date` object for the creation date. (Defaults to "now" `Date()` if not supplied))
        - `modificationDate`. Optionally supply a JavaScript `Date` object for the modification date. (Defaults to "now" `Date()` if not supplied))

    |example_tag|

    .. code-block:: javascript

        const content = "Test content";
        const buffer = new Buffer();
        buffer.writeLine(content);
        tasks.attachFile(pdfDocument, "test.txt", buffer);

.. method:: tasks.insertText(document, page, value:string, point: Point, fontName:string = "Times-Roman", fontSize:number = 18, graphics: {strokeColor:Color, fillColor:Color, strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1})
    
    Inserts text onto a page at the given point along with styling options. 

    :arg value: `string`. The value of the text. 
    :arg point: `Point`. The :ref:`Point <Glossary_Points>` coordinate for the text.
    :arg fontName: `string`. Defaults to "Times-Roman"
    :arg fontSize: `number`. Font size, default is 18 points.
    :arg graphics: `{strokeColor:Color, fillColor:Color, strokeThickness:number}`. An object with three keys to set the graphics styling for the text.

        - `strokeColor`. :ref:`Color <Glossary_Colors>` for the color of the text border (or stroke).
        - `fillColor`. :ref:`Color <Glossary_Colors>`  for the color of the text fill (or body)
        - `strokeThickness`. `number`. `0` or above to set the stroke thickness in points. Floating point numbers are accepted.

    |example_tag|

    .. code-block:: javascript

        tasks.insertText(doc, page, "HELLO WORLD!", 
                       [0,0], 
                       "Times-Roman", 
                       65, 
                       {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:1.5});



.. method:: tasks.insertImage(document, page, data: {image:Image, name:string}, metrics: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) 

    Inserts an image onto a page with a given name and within the given rectangle.

    :arg data: `{image:Image, name:string}`. Object containing an :doc:`Image` and the name for the image (note this should ideally be unique for the page).
    :arg metrics: `{x?:number, y?:number, width?:number, height?:number}`. An optional object used to define the position and size for the image. If these values are `undefined` then `x` = `0`, `y` = `0`, `width` = *inherent image width*, `height` = *inherent image height*. 

    |example_tag|

    .. code-block:: javascript

        const imageData = fs.readFileSync("logo.png"));
        let logo = new mupdf.Image(imageData);
        tasks.insertImage(document, page, {image:logo, name:"MyLogo"}, 
                                {x:0, y:0, width:200, height:200});


.. _Classes_PDFPage_deleteResourcesXObject:

.. method:: tasks.deletePageResourcesXObject(ref:string)

    Deletes a **PDF** :doc:`XObject` resources by `name` key.

    :arg ref: `string`

    .. note:: 

        Use :meth:`tasks.getPageResourcesXObjects` to find :doc:`XObject` `name` keys which you may want to delete.


.. method:: tasks.addAnnotation(page, type: CreatableAnnotationType, metrics: {x:number, y:number, width:number, height:number}, author?:string, contents?:string)

    Creates an annotation of your choice from the set in :ref:`CreatableAnnotationType <Glossary_CreatableAnnotationType>` at a location on the page defined by the `metrics`.

    This method also has options for defining the author and contents of the annotation.

    :arg type: `CreatableAnnotationType`.
    :arg metrics: `{x:number, y:number, width:number, height:number}`.
    :arg author: `string` | `null`. The annotation author.
    :arg contents: `string`. The annotation contents. See :meth:`setContents`.

    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let myNote = tasks.addAnnotation(page, "Text", {x:100, y:200, width:300, height:50}, null, "Hello World!");


.. method:: tasks.addRedaction(page, metrics: {x:number, y:number, width:number, height:number})

    Creates a redaction annotation at a location on the page defined by the `metrics`.

    :arg metrics: `{x:number, y:number, width:number, height:number}`.

    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let redactionAnnotation = tasks.addRedaction(page, {x:100, y:200, width:300, height:50})

..  method:: tasks.rotatePage(page, r:number)

    Rotating a page allows for 90 increment rotations on a page. 
    
    If you send a rotation value which is not one of postive or negative `0`, `90`, `180`, `270` then this method will do nothing.

    :arg r: `number`. The rotation value to apply to the page.

    |example_tag|

    .. code-block:: javascript

        // rotate a page 90 degrees anti-clockwise
        tasks.rotatePage(page, -90)

    .. note::

        Positive rotation values are clockwise, negative are anti-clockwise.

Examples
==============

Splitting a Document
-----------------------------

To split a document's pages into new documents use the :meth:`split` method. Supply an array of page indicies that you want to use for the splitting operation.

|example_tag|

.. code-block:: javascript

    let documents = tasks.split(document, [0,2,3])

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
    let sourcePDF = tasks.createBlankDocument()
    let page = sourcPDF.loadPage(0)
    tasks.insertText(sourcePDF, page, "HELLO WORLD", 
                        [0,0], 
                        "Times-Roman", 
                        20, 
                        {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:0.5})
    // now merge this document onto page 2 of our document and rotate it by 90 degrees
    tasks.merge(document, sourcePDF, 0, -1, 1, 90);

Extracting Document Images
----------------------------------


To get the images for an entire document use the :meth:`getImages` method on each :ref:`page <Node_How_To_Guide_Page>`.

|example_tag|

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        let imageStack = tasks.getPageImages(page)
        i++
    }


The following example would extract all the images from a document and save them as individual files:

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        let imageStack = tasks.getPageImages()

        for (var j in imageStack) {
            var image = imageStack[j].image;
            var pixmap = image.toPixmap();
            let raster = pixmap.asJPEG(80);
            fs.writeFileSync('page-'+i+'-image-'+j+'.jpg', raster);
        }

        i++
    }

Attaching a File to a Document
-----------------------------------

Use the :meth:`attachFile` method on a document instance with a supplied name and :doc:`../../../classes/Buffer` for the data.

|example_tag|

.. code-block:: javascript

    const content = "Test content";
    const buffer = new mupdf.Buffer();
    buffer.writeLine(content);
    tasks.attachFile(doc, "test.txt", buffer);






Adding Text to Pages
-------------------------------

The following script creates a blank **PDF** document, adds some styled text to the top of the document using the :meth:`tasks.insertText` method, and then saves the result to a file.

|example_tag|

.. code-block:: javascript

    let document = tasks.createBlankDocument()
    let page = document.loadPage(0) // get the 1st page of the document
    tasks.insertText(document, page, "HELLO WORLD", 
                    [0,0], 
                    "Times-Roman", 
                    20, 
                    {
                        strokeColor:[0,0,0,1], 
                        fillColor:[1,0,0,0.75], 
                        strokeThickness:0.5
                    }
                    )

    fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())


Adding Images to Pages
-------------------------------

The following script creates a blank **PDF** document, adds an :ref:`Image <Classes_Image>` to the top of the document using the :meth:`tasks.insertImage` method, and then saves the result to a file.

|example_tag|

.. code-block:: javascript

    let image = new mupdf.Image(fs.readFileSync("logo.png"))
    tasks.insertImage(document, page, {image:image, name:"MyLogo"})

    fs.writeFileSync("output.pdf", document.saveToBuffer("").asUint8Array())

.. note::

    See :ref:`coordinate space and PDFObject <How_To_Guide_Coordinate_System_PDF>` for more about how the image is sized and positioned with the `addStream` method.


Adding Pages
---------------

Use the :meth:`tasks.newPage` method to add pages to a document, you can choose where to insert the page in the document and the metrics for the new page.

|example_tag|

The code below creates a blank document with a default A4 sized page and then adds a new 300x500 point sized page at the end of the document.

.. code-block:: javascript
    
    // Create a blank document with a blank page
    let document = tasks.createBlankDocument()

    // Add a page to the end of the document
    tasks.newPage(document, -1, 300, 500)




Copying Pages
-----------------

To copy a page we can use the :meth:`tasks.copyPage` method and insert it as a new page of the document.

|example_tag|

.. code-block:: javascript

    tasks.copyPage(document, 0,-1)

Rotating Pages
---------------------

Rotating a page with :meth:`tasks.rotatePage` allows for 90 increment rotations on a page.

|example_tag|

.. code-block:: javascript

    // rotate a page 90 degrees anti-clockwise
    tasks.rotatePage(page, -90)

.. note::

    Positive rotation values are clockwise, negative are anti-clockwise.


