
.. _Classes_PDFPage:

PDFPage
===================


|constructor_tag|

.. method:: doc.loadPage(pno: number)

    Calling loadPage on a `PDFDocument` returns a `PDFPage` for the given page number.

    :arg pno: `number`. Note: zero-indexed! - to get page `1` of the document use `0` here!

    :return: `PDFPage`.

    |example_tag|

    .. code-block:: javascript

        let page = doc.loadPage(0); // returns the first page of the document


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
		- `inhibit-spaces`
		- `dehyphenate`
		- `structured`
		- `use-cid-for-unknown-unicode`
		- `ignore-actualtext`

    :return: :doc:`StructuredText`.

    |example_tag|

    .. code-block:: javascript

        let sText = page.toStructuredText("preserve-whitespace,ignore-actualtext");

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

        var pixmap = pdfPage.toPixmap(mupdf.Matrix.identity,
                                      mupdf.ColorSpace.DeviceRGB,
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


.. method:: createLink(rect: Rect, uri: string)

    Create a new link with the supplied metrics for the page, linking to the destination URI string.

    To create links to other pages within the document see the :meth:`formatLinkURI` method.

    :arg rect: Rectangle specifying the active area on the page the link should cover.
    :arg destinationUri: `string` containing URI.
    :return: :doc:`Link`.

    |example_tag|

    .. code-block:: javascript

        // create a link to an external URL
        var link = page.createLink([0,0,100,50], "https://example.com");

        // create a link to another page in the document
        var link = page.createLink([0,100,100,150], "#page=1&view=FitV,0");


.. method:: createAnnotation(type:string)

    Create a new blank annotation of a given :ref:`type <Glossary_Annotation_Types>`.

    :arg type: `string` representing :ref:`annotation type <Glossary_Annotation_Types>`.
    :return: :doc:`PDFAnnotation`.

    |example_tag|

    .. code-block:: javascript

        var annot = pdfPage.createAnnotation("Text");


.. _Classes_PDFPage_deleteAnnotation:

.. method:: deleteAnnotation(ref:PDFAnnotation)

    Delete a :doc:`PDFAnnotation` from the page.

    :arg ref: :doc:`PDFAnnotation`

    |example_tag|

    .. code-block:: javascript

        let annots = getAnnotations();
        page.delete(annots[0]);

.. _Classes_PDFPage_deleteLink:

.. method:: deleteLink(link:Link)

    Deletes a :doc:`Link` from the page.

    :arg link: :doc:`Link`

.. method:: search(needle:string, maxHits:number = 50)


    Search the page text for all instances of the `needle` value, and return an array of search hits.
    
    Each search hit is an array of :ref:`Quadpoints <Glossary_Quads>` corresponding to all characters in the search hit.

    :arg needle: `string`.
    :arg maxHits: `number`. Defaults to 50 unless otherwise specified.
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


.. method:: applyRedactions(blackBoxes: boolean | number = true, imageMethod: number = PDFPage.REDACT_IMAGE_PIXELS, lineArtMethod: number = PDFPage.REDACT_LINE_ART_REMOVE_IF_COVERED, textMethod: number = PDFPage.REDACT_TEXT_REMOVE)

    Applies redactions to the page.

    :arg blackBoxes: `boolean` | `number`.  Whether to use black boxes at each redaction or not.
    :arg imageMethod: `number`. Default is `PDFPage.REDACT_IMAGE_PIXELS`.
    :arg lineArtMethod: `number`. Default is `PDFPage.REDACT_LINE_ART_REMOVE_IF_COVERED`.
    :arg textMethod: `number`. Default is `PDFPage.REDACT_TEXT_REMOVE`.


    **Image redaction options**

    - `PDFPage.REDACT_IMAGE_NONE` for no image redactions.
    - `PDFPage.REDACT_IMAGE_REMOVE` to redact entire images.
    - `PDFPage.REDACT_IMAGE_PIXELS` for redacting just the covered pixels.
    - `PDFPage.REDACT_IMAGE_UNLESS_INVISIBLE` only redact visible images.

    **Line Art redaction options**

    - `PDFPage.REDACT_LINE_ART_NONE` for no line art redactions.
    - `PDFPage.REDACT_LINE_ART_REMOVE_IF_COVERED` redacts line art if covered.
    - `PDFPage.REDACT_LINE_ART_REMOVE_IF_TOUCHED` redacts line art if touched.

    **Text redaction options**

    - `PDFPage.REDACT_TEXT_REMOVE` to redact text.
    - `PDFPage.REDACT_TEXT_NONE` for no text redaction.

    .. note::

        Redactions are secure as they remove the affected content completely.

    |example_tag|

    .. code-block:: javascript

        pdfPage.applyRedactions(true, mupdf.PDFPage.REDACT_IMAGE_REMOVE);


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

.. method:: setPageBox(box: PageBox, rect: Rect)

    Sets the type of box required for the page.

    :arg box: :ref:`PageBox <Glossary_PageBox>`.
    :arg rect: :ref:`Rect <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        page.setPageBox("TrimBox", [10,10, 585, 832]);


.. _PDFPage_run:

.. method:: run(device: Device, matrix: Matrix)

    Calls device functions for all the contents on the page, using the specified transform :ref:`matrix <Glossary_Matrix>`. The `device` can be one of the built-in devices or a :title:`JavaScript` object with methods for the device calls. The `matrix` maps from user space points to device space pixels.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.run(device, mupdf.Matrix.identity);


.. method:: runPageContents(device: Device, matrix: Matrix)

    This is the same as the :ref:`run <PDFPage_run>` method above but it only considers the page itself and *omits* annotations and widgets.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.runPageContents(device, mupdf.Matrix.identity);


.. method:: runPageAnnots(device: Device, matrix: Matrix)

    This is the same as the :ref:`run <PDFPage_run>` method above but it only considers the page *annotations*.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.runPageAnnots(device, mupdf.Matrix.identity);


.. method:: runPageWidgets(device: Device, matrix: Matrix)

    This is the same as the :ref:`run <PDFPage_run>` method above but it only considers the page *widgets*.

    :arg device: :doc:`Device`.
    :arg matrix: :ref:`Matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        page.runPageWidgets(device, mupdf.Matrix.identity);


.. method:: getLabel()

    Returns the page number as a string using the numbering scheme of the document.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var label = page.getLabel();






