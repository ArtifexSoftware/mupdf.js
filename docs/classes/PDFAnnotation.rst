.. include:: ../header.rst

.. _Classes_PDFAnnotation:

PDFAnnotation
===================

:title:`PDF` Annotations belong to a specific :doc:`PDFPage` and may be created/changed/removed. Because annotation appearances may change (for several reasons) it is possible to scan through the annotations on a page and query them to see whether a re-render is necessary.

Additionally redaction annotations can be applied to a :doc:`PDFPage`, destructively removing content from the page.

To get the annotations on a page see: :meth:`getAnnotations`, to create an annotation see: :meth:`createAnnotation`.


|instance_method_tag|

.. method:: getBounds()

    Returns a rectangle containing the location and dimension of the annotation.

    :return: `Array`. `[ulx,uly,lrx,lry]`. :ref:`Rectangle <Glossary_Rectangles>`.


    |example_tag|

    .. code-block:: javascript

        let bounds = annotation.getBounds()


.. method:: run(device:Device, transform:Array)

    Calls the device functions to draw the annotation.

    :arg device: :doc:`Device`.
    :arg transform: `Array`. `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.

    |example_tag|

    .. code-block:: javascript

        annotation.run(device, mupdfjs.Matrix.identity)


.. method:: toPixmap(transform:Array, colorspace:ColorSpace, alpha:boolean)

    Render the annotation into a :doc:`Pixmap`, using the `transform`, `colorspace` and `alpha` parameters.

    :arg transform: `Array`. `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.
    :arg colorspace: :doc:`ColorSpace`.
    :arg alpha: `boolean`.

    :return: :doc:`Pixmap`.

    |example_tag|

    .. code-block:: javascript

        let pixmap = annotation.toPixmap(mupdfjs.Matrix.identity, mupdfjs.ColorSpace.DeviceRGB, true)




.. method:: toDisplayList()

    Record the contents of the annotation into a :doc:`DisplayList`.

    :return: :doc:`DisplayList`.

    |example_tag|

    .. code-block:: javascript

        let displayList = annotation.toDisplayList()



.. method:: getObject()

    Get the underlying `PDFObject` for an annotation.

    :return: `PDFObject`.

    |example_tag|

    .. code-block:: javascript

        let obj = annotation.getObject()


.. method:: setAppearanceFromDisplayList(appearance:string, state:string, transform:Array, displayList:DisplayList)

    Set the annotation appearance stream for the given appearance. The desired appearance is given as a transform along with a display list.

    :arg appearance: `string` Appearance stream ("N", "R" or "D").
    :arg state: `string` The annotation state to set the appearance for or null for the current state. Only widget annotations of pushbutton, check box, or radio button type have states, which are "Off" or "Yes". For other types of annotations pass null.
    :arg transform: `Array`. `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.
    :arg displayList: `DisplayList`.

    |example_tag|

    .. code-block:: javascript

        annotation.setAppearanceFromDisplayList("N", null, mupdfjs.Matrix.identity, displayList);

.. method:: setAppearance(appearance:string, state:string, transform:Array, bbox:Array, resources:object, contents:string)

    Set the annotation appearance stream for the given appearance. The desired appearance is given as a transform along with a bounding box, a :title:`PDF` dictionary of resources and a content stream.

    :arg appearance: `string` Appearance stream ("N", "R" or "D").
    :arg state: `string` The annotation state to set the appearance for or null for the current state. Only widget annotations of pushbutton, check box, or radio button type have states, which are "Off" or "Yes". For other types of annotations pass null.
    :arg transform: `Array`. `[a,b,c,d,e,f]`. The transform :ref:`matrix <Glossary_Matrix>`.
    :arg bbox: `Array`. `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.
    :arg resources: `object`. Resources object.
    :arg contents: `string`. Contents string.

    |example_tag|

    .. code-block:: javascript

        annotation.setAppearance("N", null, mupdfjs.Matrix.identity, [0,0,100,100], resources, contents);

.. method:: setAppearance(image:Image)

    Set a stamp annotation's appearance to that of an image.

    :arg image: :doc:`Image` containing the desired appearance.

    |example_tag|

    .. code-block:: javascript

        let img = new mupdfjs.Image(fs.readFileSync("photo.png"))
        annotation.setAppearance(img)


**Appearance stream values**


.. list-table::
   :header-rows: 1

   * - Value
     - Description
   * - N
     - normal appearance
   * - R
     - roll-over appearance
   * - D
     - down (pressed) appearance


.. method:: update()

    Update the appearance stream to account for changes in the annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.update()


.. method:: getHiddenForEditing()

    Get a special annotation hidden flag for editing. This flag prevents the annotation from being rendered.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        let hidden = annotation.getHiddenForEditing()

.. method:: setHiddenForEditing(hidden:boolean)

    Set a special annotation hidden flag for editing. This flag prevents the annotation from being rendered.

    :arg hidden: `boolean`.

    |example_tag|

    .. code-block:: javascript

        annotation.setHiddenForEditing(true)


.. method:: getType()

    Return the annotation type.

    :return: `string`. See: :ref:`Annotation types <PDFPage_annotation_types>`.

    |example_tag|

    .. code-block:: javascript

        let type = annotation.getType()


.. method:: getFlags()

    Get the annotation flags.

    :return: `number`. Representaton of a bit-field of flags specified below.

    |example_tag|

    .. code-block:: javascript

        var flags = annotation.getFlags();


.. method:: setFlags(flags:number)

    Set the annotation flags.

    :arg flags: `number`. Representaton of a bit-field of flags specified below.

    |example_tag|

    .. code-block:: javascript

        annotation.setFlags(4); // Clears all other flags and sets "NoZoom".



**Annotation flags**


.. list-table::
   :header-rows: 1

   * - **Bit position**
     - **Name**
   * - `1`
     - Invisible
   * - `2`
     - Hidden
   * - `3`
     - Print
   * - `4`
     - NoZoom
   * - `5`
     - NoRotate
   * - `6`
     - NoView
   * - `7`
     - ReadOnly
   * - `8`
     - Locked
   * - `9`
     - ToggleNoView
   * - `10`
     - LockedContents





.. method:: getContents()

    Get the annotation contents.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var contents = annotation.getContents();

.. method:: setContents(text:string)

    Set the annotation contents.

    :arg text: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setContents("Hello World");


.. method:: getColor()

    Get the annotation color, represented as an array of 1, 3, or 4 component values.

    :return: `Array`. The :ref:`color value <Glossary_Colors>`.

    |example_tag|

    .. code-block:: javascript

        var color = annotation.getColor();



.. method:: setColor(color:Array)

    Set the annotation color, represented as an array of 1, 3, or 4 component values.

    :arg color: `Array`. The :ref:`color value <Glossary_Colors>`.

    |example_tag|

    .. code-block:: javascript

        annotation.setColor([0,1,0]);


.. method:: getOpacity()

    Get the annotation opacity.

    :return: `number`. The :ref:`opacity <Glossary_Alpha>` value.

    |example_tag|

    .. code-block:: javascript

        var opacity = annotation.getOpacity();



.. method:: setOpacity(opacity:number)

    Set the annotation opacity.

    :arg opacity: `number`. The :ref:`opacity <Glossary_Alpha>` value.

    |example_tag|

    .. code-block:: javascript

        annotation.setOpacity(0.5);


.. method:: getCreationDate()

    Get the annotation creation date as a :title:`JavaScript` `Date` object.

    :return: `Date`.

    |example_tag|

    .. code-block:: javascript

        var date = annotation.getCreationDate();



.. method:: setCreationDate(date:Date)

    Set the creation date.

    :arg date: `Date`. :title:`JavaScript` `Date` object.

    |example_tag|

    .. code-block:: javascript

        annotation.setCreationDate(new Date());


.. method:: getModificationDate()

    Get the annotation modification date as a :title:`JavaScript` `Date` object.

    :return: `Date`.

    |example_tag|

    .. code-block:: javascript

        var date = annotation.getModificationDate();


.. method:: setModificationDate(date:Date)

    Set the modification date.

    :arg date: `Date`. :title:`JavaScript` `Date` object.

    |example_tag|

    .. code-block:: javascript

        annotation.setModificationDate(new Date());


.. method:: getQuadding()

    Get the annotation quadding (justification).

    :return: `number`. Quadding value, `0` for left-justified, `1` for centered, `2` for right-justified.

    |example_tag|

    .. code-block:: javascript

        var quadding = annotation.getQuadding();


.. method:: setQuadding(value:number)

    Set the annotation quadding (justification).

    :arg value: `number`. Quadding value, `0` for left-justified, `1` for centered, `2` for right-justified.

    |example_tag|

    .. code-block:: javascript

        annotation.setQuadding(1);



.. method:: getLanguage()

    Get the annotation language (or get the inherited document language).

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var language = annotation.getLanguage();


.. method:: setLanguage(language:string)

    Set the annotation language.

    :arg language: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setLanguage("en");



----


These properties are only present for some annotation types, so support for them must be checked before use.

.. method:: hasRect()

    Checks the support for annotation bounding box.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasRect = annotation.hasRect();

.. method:: getRect()

    Get the annotation bounding box.

    :return: `Array`. `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var rect = annotation.getRect();



.. method:: setRect(rect:Array)

    Set the annotation bounding box.

    :arg rect: `Array`. `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        annotation.setRect([0,0,100,100]);


.. method:: getDefaultAppearance()



    Get the :ref:`default text appearance <Glossary_Default_Appearance_Text_Object>` used for free text annotations.

    :return: `{font:string, size:number, color:Array}` Returns :ref:`a default text appearance <Glossary_Default_Appearance_Text_Object>` with the key/value pairs.

    |example_tag|

    .. code-block:: javascript

        var appearance = annotation.getDefaultAppearance();



.. method:: setDefaultAppearance(font:number, size:number, color:Array)

    Set the default text appearance used for free text annotations.

    :arg font: `string` ("Helv" = Helvetica, "TiRo" = Times New Roman, "Cour" = Courier).
    :arg size: `number`.
    :arg color: `Array`. The :ref:`color value <Glossary_Colors>`.

    |example_tag|

    .. code-block:: javascript

        annotation.setDefaultAppearance("Helv", 16, [0,0,0]);



.. method:: hasInteriorColor()


    Checks whether the annotation has support for an interior color.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasInteriorColor = annotation.hasInteriorColor();




.. method:: getInteriorColor()

    Gets the annotation interior color.

    :return: `Array`. The :ref:`color value <Glossary_Colors>`.

    |example_tag|

    .. code-block:: javascript

        var interiorColor = annotation.getInteriorColor();



.. method:: setInteriorColor(color:Array)



    Sets the annotation interior color.

    :arg color: `Array`. The :ref:`color value <Glossary_Colors>`.

    |example_tag|

    .. code-block:: javascript

        annotation.setInteriorColor([0,1,1]);






.. method:: hasAuthor()

    Checks whether the annotation has an author.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasAuthor = annotation.hasAuthor();



.. method:: getAuthor()

    Gets the annotation author.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var author = annotation.getAuthor();


.. method:: setAuthor(author:string)

    Sets the annotation author.

    :arg author: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setAuthor("Jane Doe");


.. method:: hasLineEndingStyles()


    Checks the support for :ref:`line ending styles <Glossary_Line_Ending_Styles>`.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasLineEndingStyles = annotation.hasLineEndingStyles();




.. method:: getLineEndingStyles()


    Gets the :ref:`line ending styles <Glossary_Line_Ending_Styles>` object.

    :return: `{start:string, end:string}` Returns an object with the key/value pairs.

    |example_tag|

    .. code-block:: javascript

        var lineEndingStyles = annotation.getLineEndingStyles();



.. method:: setLineEndingStyles(start, end)

    Sets the :ref:`line ending styles <Glossary_Line_Ending_Styles>` object.

    :arg start: `string`.
    :arg end: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setLineEndingStyles("Square", "OpenArrow");





.. method:: hasIcon()


    Checks the support for annotation icon.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasIcon = annotation.hasIcon();




.. method:: getIcon()

    Gets the annotation icon name, either one of the standard :ref:`icon names <Glossary_Icon_Names>`, or something custom.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var icon = annotation.getIcon();


.. method:: setIcon(name:string)

    Sets the annotation icon name, either one of the standard :ref:`icon names <Glossary_Icon_Names>`, or something custom. Note that standard icon names can be used to resynthesize the annotation apperance, but custom names cannot.

    :arg name: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setIcon("Note");


.. method:: hasLine()


    Checks the support for annotation line.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasLine = annotation.hasLine();




.. method:: getLine()



    Get line end points, represented by an array of two points, each represented as an `[x, y]` array.

    :return: `Array`. `[[x,y],...]`.

    |example_tag|

    .. code-block:: javascript

        var line = annotation.getLine();



.. method:: setLine(a: Array, b: Array)

    Set the two line end points, represented by an array of two points, each represented as an `[x, y]` array.

    :arg a: `Array`. Point format `[x,y]`.
    :arg b: `Array`. Point format `[x,y]`.

    |example_tag|

    .. code-block:: javascript

        annotation.setLine([100,100], [150, 175]);


.. method:: hasPopup()

    Checks the support for annotation popup.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasPopup = annotation.hasPopup();


.. method:: getPopup()

    Get annotation popup rectangle.

    :return: `Array`. `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        var popupRect = annotation.getPopup();

.. method:: setPopup(rect:Array)

    Set annotation popup rectangle.

    :arg rect: `Array`. `[ulx,uly,lrx,lry]` :ref:`Rectangle <Glossary_Rectangles>`.

    |example_tag|

    .. code-block:: javascript

        annotation.setPopup([0,0,100,100]);


.. method:: hasOpen()

    Checks the support for annotation open state.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasOpen = annotation.hasOpen();


.. method:: getIsOpen()

    Get annotation open state.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var isOpen = annotation.getIsOpen();

.. method:: setIsOpen(state:boolean)


    Set annotation open state.

    :arg state: `boolean`.

    |example_tag|

    .. code-block:: javascript

        annotation.setIsOpen(true);

.. note::

    "Open" refers to whether the annotation is display in an open state when the page is loaded. A Text Note annotation is considered "Open" if the user has clicked on it to view its contents.


.. method:: hasFilespec()


    Checks support for the annotation file specification.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasFileSpec = annotation.hasFilespec();





.. method:: getFilespec()


    Gets the file specification object.

    :return: `Object` :ref:`File Specification Object <Glossary_Object_Filespec_Params_Object>`.

    |example_tag|

    .. code-block:: javascript

        var fileSpec = annotation.getFilespec(true);



.. method:: setFilespec(fileSpec:Object)


    Sets the file specification object.

    :arg fileSpec: `Object` :ref:`File Specification object <Glossary_Object_Filespec_Params_Object>`.


    |example_tag|

    .. code-block:: javascript

        annotation.setFilespec({filename:"my_file.pdf",
                                mimetype:"application/pdf",
                                size:1000,
                                creationDate:date,
                                modificationDate:date});





----


The border drawn around some annotations can be controlled by:

.. method:: hasBorder()



    Check support for the annotation border style.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasBorder = annotation.hasBorder();




.. method:: getBorderStyle()


    Get the annotation :ref:`border style <Glossary_Border_Style>`.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var borderStyle = annotation.getBorderStyle();



.. method:: setBorderStyle(style:string)

    Set the annotation :ref:`border style <Glossary_Border_Style>`.

    :arg: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setBorderStyle("Dashed");



.. method:: getBorderWidth()



    Get the border width in points.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var w = annotation.getBorderWidth();



.. method:: setBorderWidth(width:number)

    Set the border width in points. Retains any existing border effects.

    :arg width: `number`.

    |example_tag|

    .. code-block:: javascript

        annotation.setBorderWidth(1.5);




.. method:: getBorderDashCount()



    Returns the number of items in the border dash pattern.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var dashCount = annotation.getBorderDashCount();


.. method:: getBorderDashItem(idx:number)

    Returns the length of dash pattern item `idx`.

    :arg idx: `number`. Item index.
    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var length = annotation.getBorderDashItem(0);



.. method:: setBorderDashPattern(dashPattern:Array)



    Set the annotation border dash pattern to the given array of dash item lengths. The supplied array represents the respective line stroke and gap lengths, e.g. `[1,1]` sets a small dash and small gap, `[2,1,4,1]` would set a medium dash, a small gap, a longer dash and then another small gap.

    :arg dashPattern: `Array`. `[number, number, ....]`.

    |example_tag|

    .. code-block:: javascript

        annotation.setBorderDashPattern([2.0, 1.0, 4.0, 1.0]);


.. method:: clearBorderDash()



    Clear the entire border dash pattern for an annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.clearBorderDash();



.. method:: addBorderDashItem(length:number)



    Append an item (of the given length) to the end of the border dash pattern.

    :arg length: `number`.

    |example_tag|

    .. code-block:: javascript

        annotation.addBorderDashItem(10.0);





.. method:: hasBorderEffect()


    Check support for annotation border effect.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasEffect = annotation.hasBorderEffect();





.. method:: getBorderEffect()



    Get the :ref:`annotation border effect <Glossary_Border_Effect>`.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var effect = annotation.getBorderEffect();



.. method:: setBorderEffect(effect)



    Set the :ref:`annotation border effect <Glossary_Border_Effect>`.

    :arg: `string`.

    |example_tag|

    .. code-block:: javascript

        annotation.setBorderEffect("None");



.. method:: getBorderEffectIntensity()



    Get the annotation border effect intensity.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        var intensity = annotation.getBorderEffectIntensity();




.. method:: setBorderEffectIntensity(intensity:number)



    Set the annotation border effect intensity. Recommended values are between `0` and `2` inclusive.

    :arg: `number`.

    |example_tag|

    .. code-block:: javascript

        annotation.setBorderEffectIntensity(1.5);



----

Ink annotations consist of a number of strokes, each consisting of a sequence of vertices between which a smooth line will be drawn. These can be controlled by:

.. method:: hasInkList()

    Check support for the annotation ink list.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasInkList = annotation.hasInkList();


.. method:: getInkList()

    Get the annotation ink list, represented as an array of strokes, each an array of points each an array of its X/Y coordinates.

    :return: `Array`.

    |example_tag|

    .. code-block:: javascript

        var inkList = annotation.getInkList();

.. method:: setInkList(inkList:Array)



    Set the annotation ink list, represented as an array of strokes, each an array of points each an array of its X/Y coordinates.

    :arg: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.setInkList([
                                  [
                                      [0,0]
                                  ],
                                  [
                                      [10,10], [20,20], [30,30]
                                  ]
                              ]);



.. method:: clearInkList()



    Clear the list of ink strokes for the annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.clearInkList();



.. method:: addInkList(stroke:Array)



    To the list of strokes, append a stroke, represented as an array of vertices each an array of its X/Y coordinates.

    :arg stroke: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.addInkList(
                                [
                                    [0,0]
                                ],
                                [
                                    [10,10], [20,20], [30,30]
                                ]
                             );



.. method:: addInkListStroke()



    Add a new empty stroke to the ink annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.addInkListStroke();



.. method:: addInkListStrokeVertex(vertex:Array)



    Append a vertex to end of the last stroke in the ink annotation. The vertex is an array of its X/Y coordinates.

    :arg vertex: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.addInkListStrokeVertex([0,0]);


----

Text markup and redaction annotations consist of a set of quadadrilaterals controlled by:

.. method:: hasQuadPoints()

    Check support for the annotation :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>`.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasQuadPoints = annotation.hasQuadPoints();



.. method:: getQuadPoints()

    Get the annotation :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>`, describing the areas affected by text markup annotations and link annotations.

    :return: `Array`.

    |example_tag|

    .. code-block:: javascript

        var quadPoints = annotation.getQuadPoints();

.. method:: setQuadPoints(quadPoints:Array)

    Set the annotation :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>`, describing the areas affected by text markup annotations and link annotations.

    :arg quadPoints: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.setQuadPoints([
                                    [1,2,3,4,5,6,7,8],
                                    [1,2,3,4,5,6,7,8],
                                    [1,2,3,4,5,6,7,8]
                                ]);

.. method:: clearQuadPoints()

    Clear the list of :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>` for the annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.clearQuadPoints();


.. method:: addQuadPoint(quadpoint:Array)

    Append a single :ref:`QuadPoints <Glossary_Object_Points_and_QuadPoints>` as an array of 8 elements, where each pair are the X/Y coordinates of a corner of the quad.

    :arg quadpoint: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.addQuadPoint([1,2,3,4,5,6,7,8]);


----

Polygon and polyline annotations consist of a sequence of vertices with a straight line between them. Those can be controlled by:

.. method:: hasVertices()

    Check support for the annotation vertices.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var hasVertices = annotation.hasVertices();




.. method:: getVertices()

    Get the annotation vertices, represented as an array of vertices each an array of its X/Y coordinates.

    :return: `Array`.

    |example_tag|

    .. code-block:: javascript

        var vertices = annotation.getVertices();


.. method:: setVertices(vertices:Array)

    Set the annotation vertices, represented as an array of vertices each an array of its X/Y coordinates.

    :arg vertices: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.setVertices([
                                [0,0],
                                [10,10],
                                [20,20]
                              ]);

.. method:: clearVertices()

    Clear the list of vertices for the annotation.

    |example_tag|

    .. code-block:: javascript

        annotation.clearVertices();


.. method:: addVertex(vertex:Array)

    Append a single vertex as an array of its X/Y coordinates.

    :arg vertex: `Array`.

    |example_tag|

    .. code-block:: javascript

        annotation.addVertex([0,0]);


----

Redactions
---------------

Redactions are a special type of annotation used to permanently remove (or "redact") content from a :title:`PDF`.

To create a redaction annotation use the :meth:`addRedaction` method on a :doc:`PDFPage` instance.

Once redactions are added to a page you can *apply* them, which is an irreversable action, thus it is a two step process as follows:

.. code-block:: javascript
    // create a redaction annotation
    let redactionAnnotation = page.addRedaction(rect)
    // apply redaction to the annotation with options
    redactionAnnotation.applyRedaction(true, mupdfjs.PDFPage.REDACT_IMAGE_NONE);


.. method:: applyRedaction(blackBoxes:boolean = true, imageMethod:number = PDFPage.REDACT_IMAGE_PIXELS)

    Applies redaction to the annotation.

    :arg blackBoxes: `boolean`. Whether to use black boxes on the redaction or not. (Default: `true`)
    :arg imageMethod: `number`. Used to declare how to redact image content affected by the redaction rectangle area. (Default: `PDFPage.REDACT_IMAGE_PIXELS`).
    
    .. list-table::
        :header-rows: 1

        * - **Image redaction variable**
          - **Description**
        * - `PDFPage.REDACT_IMAGE_NONE`
          - Do not redact images
        * - `PDFPage.REDACT_IMAGE_REMOVE`
          - Redact entire images
        * - `PDFPage.REDACT_IMAGE_PIXELS`
          - Redact just the covered pixels

    .. note::

        Redactions are secure as they remove the affected content completely.

    |example_tag|

    .. code-block:: javascript

        annotation.applyRedaction(true, mupdfjs.PDFPage.REDACT_IMAGE_REMOVE);


.. include:: footer.rst
.. include:: ../footer.rst



