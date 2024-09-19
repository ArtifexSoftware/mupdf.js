.. include:: ../header.rst

.. _Classes_PDFPage:

PDFPage
===================

.. 
    A **PDFPage** instance has access to the :ref:`Core JavaScript API <Node_How_To_Guide_Document_Core_API>`. Please see the `Page Class`_ methods within the `Core API`_ for *full details* on all the available **JavaScript** methods.


|constructor_tag|

.. method:: PDFPage(doc: mupdf.Document, pno: number)

    *Constructor method*.

    Returns a `PDFPage` from the document.

    :arg doc: `mupdf.Document <https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#mutool-run-js-api-document>`_.
    :arg pno: `number`. Note: zero-indexed! - to get page `1` of the document use `0` here!

    :return: `PDFPage`.

    |example_tag|

    .. code-block:: javascript

        let page = new mupdfjs.PDFPage(doc, 0); // loads the first pageof the document


|instance_method_tag|


.. method:: insertText(value:string, point: [number, number], fontName:string = "Times-Roman", fontSize:number = 18, graphics: {strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number} = {strokeColor:[0,0,0,1], fillColor:[0,0,0,1], strokeThickness:1})
    
    Inserts text onto a page at the given point along with styling options. 

    :arg value: `string`. The value of the text. 
    :arg point: `[number, number]`. The `x,y` coordinate for the text.
    :arg fontName: `string`. Defaults to "Times-Roman"
    :arg fontSize: `number`. Font size, default is 18 points.
    :arg graphics: `{strokeColor:[number,number,number,number], fillColor:[number,number,number,number], strokeThickness:number}`. An object with three keys to set the graphics styling for the text.

        - `strokeColor`. :ref:`RGBA Array <RGBA_Array>` for the color of the text border (or stroke).
        - `fillColor`. :ref:`RGBA Array <RGBA_Array>`  for the color of the text fill (or body)
        - `strokeThickness`. Number - 0 or above to set the stroke thickness in points. Floating point numbers are accepted.

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



.. method:: getLinks()

    Return array of all links on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let links = pdfPage.getLinks();

.. method:: getAnnotations()

    Return array of all annotations on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let annots = pdfPage.getAnnotations();

.. method:: getWidgets()

    Return array of all widgets on the page.

    :return: `[...]`.

    |example_tag|

    .. code-block:: javascript

        let widgets = pdfPage.getWidgets();


.. _RGBA_Array:

.. admonition:: RGBA Array

    **RGBA Array** is a array of 4 floating point numbers between `0 - 1` to define Red, Green, Blue, and Alpha settings for your color.

.. include:: footer.rst
.. include:: ../footer.rst



