.. include:: ../header.rst

.. _Classes_PDFPage:

PDFPage
===================


|constructor_tag|

.. method:: PDFPage(doc: PDFDocument, pno: number)

    Returns a `PDFPage` from a supplied document and page number.

    :arg doc: :doc:`PDFDocument`.
    :arg pno: `number`. Note: zero-indexed! - to get page `1` of the document use `0` here!

    :return: `PDFPage`.

    |example_tag|

    .. code-block:: javascript

        let page = new mupdfjs.PDFPage(doc, 0); // returns the first page of the document


|instance_method_tag|

.. method:: getBounds()

    Returns a :ref:`rectangle <Glossary_Rectangles>` containing the page dimensions.

    :return: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var rect = page.getBounds();



.. method:: toStructuredText(options:string)

    Extract the text on the page into a :doc:`StructuredText` object. 

    :arg options: `string`. A comma separated list of flags: 

        - `preserve-ligatures`
        - `preserve-whitespace`
        - `preserve-spans`
        - `preserve-images`

    :return: :doc:`StructuredText`.

    |example_tag|

    .. code-block:: javascript

        let sText = page.toStructuredText("preserve-whitespace");

.. method:: toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha: boolean = false, showExtras: boolean = true, usage: string = "View", box: PageBox = "CropBox")

    Render the page into a `Pixmap` using the given `colorspace` and `alpha` while applying the `matrix`. Rendering of annotations/widgets can be disabled. A page can be rendered for e.g. "View" or "Print" usage.

    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.
    :arg colorspace: `ColorSpace`.
    :arg alpha: `boolean`.
    :arg renderExtra: `boolean`. Whether annotations and widgets should be rendered.
    :arg usage: `string`. "View" or "Print".
    :arg box: :ref:`PageBox <Glossary_PageBox>`. Default is "CropBox".

    :return: `Pixmap`.

    |example_tag|

    .. code-block:: javascript

        var pixmap = pdfPage.toPixmap(mupdfjs.Matrix.identity,
                                      mupdfjs.ColorSpace.DeviceRGB,
                                      true,
                                      false,
                                      "View",
                                      "CropBox");


.. method:: toDisplayList(showExtras = true)

    Record the contents on the page into a :doc:`DisplayList`. 
    
    If `showExtras` is *true* then the operation will include any page annotations and/or widgets.

    :arg showExtras: `boolean`. Default is *true*.

    :return: :doc:`DisplayList`. 


    |example_tag|

    .. code-block:: javascript

        var displayList = page.toDisplayList();


.. method:: insertText(value:string, point: Point, fontName:string = "Times-Roman", fontSize:number = 18, graphics: {strokeColor:Color, fillColor:Color, strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1})
    
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

        mupdfJSPage.insertText("HELLO WORLD!", 
                       [0,0], 
                       "Times-Roman", 
                       65, 
                       {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:1.5});



.. method:: insertImage(data: {image:Image, name:string}, metrics: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) 

    Inserts an image onto a page with a given name and within the given rectangle.

    :arg data: `{image:Image, name:string}`. Object containing an :doc:`Image` and the name for the image (note this should ideally be unique for the page).
    :arg metrics: `{x?:number, y?:number, width?:number, height?:number}`. An optional object used to define the position and size for the image. If these values are `undefined` then `x` = `0`, `y` = `0`, `width` = *inherent image width*, `height` = *inherent image height*. 

    |example_tag|

    .. code-block:: javascript

        const imageData = fs.readFileSync("logo.png"));
        let logo:mupdfjs.Image = new mupdfjs.Image(imageData);
        mupdfJSPage.insertImage({image:logo, name:"MyLogo"}, 
                                {x:0, y:0, width:200, height:200});





.. method:: createAnnotation(type: PDFAnnotationType)

    Create a new blank annotation of a given :ref:`type <Glossary_Annotation_Types>`.

    :arg type: :ref:`PDFAnnotationType <Glossary_Annotation_Types>` representing :ref:`annotation type <Glossary_Annotation_Types>`.
    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let annotation = page.createAnnotation("Text");


.. method:: createLink(rect: Rect, destinationUri: string)

    Create a new link within the rectangle on the page, linking to the destination URI string.

    To create links to other pages within the document see the :meth:`formatLinkURI` method.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.
    :arg destinationUri: `string` containing URI.
    :return: :doc:`Link`.

    |example_tag|

    .. code-block:: javascript

        // create a link to an external URL
        var link = page.createLink([0,0,100,100], "https://example.com");

        // create a link to another page in the document
        var link = page.createLink(rectobj, "#page=1&view=FitV,0");



.. method:: delete(ref:PDFAnnotation | PDFWidget | Link | string)

    Deletes a :doc:`PDFAnnotation`, :doc:`PDFWidget`, :doc:`Link` instance or a **PDF** :doc:`PDFObject` by `xref` key.

    :arg ref: :doc:`PDFAnnotation` | :doc:`PDFWidget` | :doc:`Link` | `string`

    .. note:: 

        Use :meth:`getResourcesXrefObjects` to find :doc:`PDFObject` `xref` keys which you may want to delete.

    |example_tag|

    .. code-block:: javascript

        let annots = getAnnotations();
        page.delete(annots[0]);

    
.. method:: search(needle:string, maxHits:number = 500)


    Search the page text for all instances of the `needle` value, and return an array of search hits.
    
    Each search hit is an array of :ref:`Quadpoints <Glossary_Quads>` corresponding to all characters in the search hit.

    :arg needle: `string`.
    :arg maxHits: `number`. Defaults to 500 unless otherwise specified.
    :return: `Quad[][]`.

    |example_tag|

    .. code-block:: javascript

        let results = page.search("my search phrase");


    .. note::

        The array contents are `[ulx, uly, urx, ury, llx, lly, lrx, lry]` for each result. These sets of numbers are known as :ref:`quadpoints <Glossary_Quads>` or "Quads" in the :title:`PDF` specification.




.. method:: update()

    Loop through all annotations of the page and update them. Returns true if re-rendering is needed because at least one annotation was changed (due to either events or :title:`JavaScript` actions or annotation editing).

    |example_tag|

    .. code-block:: javascript

        pdfPage.update();

.. method:: addRedaction(metrics: {x:number, y:number, width:number, height:number})

    Creates a redaction annotation at a location on the page defined by the `metrics`.

    :arg metrics: `{x:number, y:number, width:number, height:number}`.

    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let redactionAnnotation = page.addRedaction({x:100, y:200, width:300, height:50})


.. method:: applyRedactions(blackBoxes: boolean | number = true, imageMethod: number = PDFPage.REDACT_IMAGE_PIXELS)

    Applies redactions to the page.

    :arg blackBoxes: `boolean` | `number`.  Whether to use black boxes at each redaction or not.
    :arg imageMethod: `number`. Default is `PDFPage.REDACT_IMAGE_PIXELS`.

        - `PDFPage.REDACT_IMAGE_NONE` for no redactions.
        - `PDFPage.REDACT_IMAGE_REMOVE` to redact entire images.
        - `PDFPage.REDACT_IMAGE_PIXELS` for redacting just the covered pixels.

    .. note::

        Redactions are secure as they remove the affected content completely.

    |example_tag|

    .. code-block:: javascript

        pdfPage.applyRedactions(true, mupdfjs.PDFPage.REDACT_IMAGE_REMOVE);



.. method:: getAnnotations()

    Returns an array of all annotations on the page.

    :return: `PDFAnnotation[]`.

    |example_tag|

    .. code-block:: javascript

        let annots = pdfPage.getAnnotations();

.. method:: getWidgets()

    Returns an array of all widgets on the page.

    :return: `PDFWidget[]`.

    |example_tag|

    .. code-block:: javascript

        let widgets = pdfPage.getWidgets();


.. method:: getImages()

    Returns an array of the page's images along with their bounding box and transform matrix.

    :return: `{bbox:Rect, matrix:Matrix, image:Image}[]`.

    .. code-block:: javascript

        let images = page.getImages();

.. method:: getLinks()

    Returns an array of all :ref:`links <Classes_Link>` on the page.

    :return: `Link[]`.

    |example_tag|

    .. code-block:: javascript

        let links = page.getLinks();


.. method:: getObject()

    Get the underlying :doc:`PDFObject` for a :doc:`PDFPage`.

    :return: :doc:`PDFObject`.

    |example_tag|

    .. code-block:: javascript

        let obj = page.getObject();


.. method:: getResourcesXrefObjects()

    Returns an array with the key/value pairs for the page resources object.

    :return: `{key:string | number, value:string}[]`.

    |example_tag|

    .. code-block:: javascript

        let xrefObjs = getResourcesXrefObjects();
        for (var obj in xrefObjs) {
            console.log(xrefObjs[obj])    
        }

..  method:: rotate(r:number)

    Rotating a page allows for 90 increment rotations on a page. 
    
    If you send a rotation value which is not one of postive or negative `0`, `90`, `180`, `270` then this method will do nothing.

    :arg r: `number`. The rotation value to apply to the page.

    |example_tag|

    .. code-block:: javascript

        // rotate a page 90 degrees anti-clockwise
        page.rotate(-90)

    .. note::

        Positive rotation values are clockwise, negative are anti-clockwise.


.. method:: setPageBox(box: PageBox, rect: Rect)

    Sets the type of box required for the page.

    :arg box: :ref:`PageBox <Glossary_PageBox>`.
    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        page.setPageBox("TrimBox", [10,10, 585, 832]);

.. method:: setTrimBox(rect: Rect) 

    Convenience method for setting the trim box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

.. method:: setMediaBox(rect: Rect)

    Convenience method for setting the media box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

.. method:: setCropBox(rect: Rect)

    Convenience method for setting the crop box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

.. method:: setArtBox(rect: Rect) 

    Convenience method for setting the art box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

.. method:: setBleedBox(rect: Rect)

    Convenience method for setting the bleed box.

    :arg rect: :ref:`Rect <Glossary_Rectangles>`.




.. _PDFPage_run:

.. method:: run(device: Device, matrix: Matrix)

    Calls device functions for all the contents on the page, using the specified transform :ref:`matrix <Glossary_Matrix>`. The `device` can be one of the built-in devices or a :title:`JavaScript` object with methods for the device calls. The `matrix` maps from user space points to device space pixels.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.run(device, mupdf.Matrix.identity);


.. method:: runPageContents(device: Device, matrix: Matrix)

    This is the same as the :ref:`run <PDFPage_run>` method above but it only considers the page *annotations*.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.runPageAnnots(device, mupdfjs.Matrix.identity);


.. method:: runPageAnnots(device: Device, matrix: Matrix)

    This is the same as the :ref:`run <PDFPage_run>` method above but it only considers the page *widgets*.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.runPageWidgets(device, mupdfjs.Matrix.identity);


.. method:: getLabel()

    Returns the page number as a string using the numbering scheme of the document.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var label = page.getLabel();



.. include:: footer.rst
.. include:: ../footer.rst



