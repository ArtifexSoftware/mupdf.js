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

    :return: `[ulx,uly,lrx,lry]`.

    |example_tag|

    .. code-block:: javascript

        var rect = page.getBounds();


.. _PDFPage_run:

.. method:: run(device: Device, matrix: Matrix)

    Calls device functions for all the contents on the page, using the specified transform :ref:`matrix <Glossary_Matrix>`. The `device` can be one of the built-in devices or a :title:`JavaScript` object with methods for the device calls. The `matrix` maps from user space points to device space pixels.

    :arg device: :doc:`Device`. The device object.
    :arg matrix: `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.run(obj, mupdf.Matrix.identity);


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

.. method:: insertText(value:string, point: Point, fontName:string = "Times-Roman", fontSize:number = 18, graphics: {strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1})
    
    Inserts text onto a page at the given point along with styling options. 

    :arg value: `string`. The value of the text. 
    :arg point: `Point`. The :ref:`point <Glossary_Object_Points_and_QuadPoints>` coordinate for the text.
    :arg fontName: `string`. Defaults to "Times-Roman"
    :arg fontSize: `number`. Font size, default is 18 points.
    :arg graphics: `{strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number}`. An object with three keys to set the graphics styling for the text.

        - `strokeColor`. :ref:`RGBA Array <RGBA_Array>` for the color of the text border (or stroke).
        - `fillColor`. :ref:`RGBA Array <RGBA_Array>`  for the color of the text fill (or body)
        - `strokeThickness`. `number`. 0 or above to set the stroke thickness in points. Floating point numbers are accepted.

    |example_tag|

    .. code-block:: javascript

        mupdfJSPage.insertText("HELLO WORLD!", 
                       [0,0], 
                       "Times-Roman", 
                       65, 
                       {strokeColor:[0,0,0,1], fillColor:[1,0,0,0.75], strokeThickness:1.5});



.. method:: insertImage(data: {image:Image, name:string}, rect: {x?:number, y?:number, width?:number, height?:number} = {x:0,y:0,width:0,height:0}) 

    Inserts an image onto a page with a given name and within the given rectangle.

    :arg data: `{image:Image, name:string}`. Object containing an :doc:`Image` and the name for the image (note this should ideally be unique for the page).
    :arg rect: `{x?:number, y?:number, width?:number, height?:number}`. An optional object used to define the position and size for the image. If these values are `undefined` then `x` = `0`, `y` = `0`, `width` = *inherent image width*, `height` = *inherent image height*. 

    |example_tag|

    .. code-block:: javascript

        const imageData = fs.readFileSync("logo.png"));
        let logo:mupdfjs.Image = new mupdfjs.Image(imageData);
        mupdfJSPage.insertImage({image:logo, name:"MyLogo"}, 
                                {x:0, y:0, width:200, height:200});


.. method:: search(needle:string, maxHits:number = 500)


    Search the page text for all instances of the `needle` value, and return an array of search hits.
    
    Each search hit is an array of :ref:`quadpoints <Glossary_Object_Points_and_QuadPoints>` corresponding to all characters in the search hit.

    :arg needle: `string`.
    :arg maxHits: `number`. Defaults to 500 unless otherwise specified.
    :return: `Quad[][]`.

    |example_tag|

    .. code-block:: javascript

        let results = page.search("my search phrase");


    .. note::

        The array contents are `[ulx, uly, urx, ury, llx, lly, lrx, lry]` for each result. These sets of numbers are known as :ref:`quadpoints <Glossary_Object_Points_and_QuadPoints>` or "Quads" in the :title:`PDF` specification.

.. method:: getLinks()

    Returns an array of all :ref:`links <Classes_Link>` on the page.

    :return: `Link[]`.

    |example_tag|

    .. code-block:: javascript

        let links = page.getLinks();


.. method:: createAnnotation(type: PDFAnnotationType)

    Create a new blank annotation of a given :ref:`type <Glossary_Annotation_Types>`.

    :arg type: `PDFAnnotationType` representing :ref:`annotation type <Glossary_Annotation_Types>`.
    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let annotation = page.createAnnotation("Text");



.. method:: deleteAnnotation(annot:PDFAnnotation)

    Delete the annotation from the page.

    :arg annot: `PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        page.deleteAnnotation(annot)


.. method:: addRedaction(rect:{x:number, y:number, width:number, height:number})

    Creates a redaction annotation at a location on the page defined by `rect`.

    :arg rect: `{x:number, y:number, width:number, height:number}`.

    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        let redactionAnnotation = page.addRedaction({x:100, y:200, width:300, height:50})


.. method:: createLink(rect:Rect, destinationUri:string)

    Create a new link within the rectangle on the page, linking to the destination URI string.

    To create links to other pages within the document see the :meth:`formatLinkURI` method.

    :arg rect: :ref:`Rectangle <Glossary_Rectangles>` for the link.
    :arg destinationUri: `string` containing URI.
    :return: :doc:`Link`.

    |example_tag|

    .. code-block:: javascript

        // create a link to an external URL
        var link = page.createLink([0,0,100,100], "https://example.com");

        // create a link to another page in the document
        var link = page.createLink(rectobj, "#page=1&view=FitV,0");


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


.. method:: setPageBox(type:string)

    Sets the type of box required for the page, one of:

    - `MediaBox`
    - `CropBox`
    - `BleedBox`
    - `TrimBox`
    - `ArtBox`

    :arg type: `string`.

    .. note::

        Explanation of box types:

        - **MediaBox** for complete pages including items that will be physically trimmed from the final product like crop marks, registration marks, etc.

        - **CropBox** defines the region that a PDF is expected to display or print.

        - **BleedBox** determines the region to which the page contents expect to be clipped.

        - **TrimBox** defines the intended dimensions of the finished page.

        - **ArtBox** can be used to denote areas where it is considered “safe” to place graphical elements.

    |example_tag|

    .. code-block:: javascript

        page.setPageBox("TrimBox");

----

.. _RGBA_Array:

.. admonition:: RGBA Array

    **RGBA Array** is a array of 4 floating point numbers between `0 - 1` to define Red, Green, Blue, and Alpha settings for your color.

.. include:: footer.rst
.. include:: ../footer.rst



