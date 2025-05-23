
.. _Classes_ColorSpace:

ColorSpace
===================


**Properties**

.. list-table:: 
   :widths: 30 70
   :header-rows: 0

   * - `DeviceGray`
     - The default Grayscale colorspace
   * - `DeviceRGB`
     - The default RGB colorspace
   * - `DeviceBGR`
     - The default RGB colorspace, but with components in reverse order
   * - `DeviceCMYK`
     - The default CMYK colorspace
   * - `Lab`
     - The default Lab colorspace

**Methods**

|constructor_tag|

.. method:: ColorSpace(from: Buffer | ArrayBuffer | Uint8Array | string, name: string)

    Create a new `ColorSpace` from an ICC profile.

    :arg from: :doc:`Buffer` | `ArrayBuffer` | `Uint8Array` | `string`. A buffer containing an ICC profile.
    :arg name: `string`. A user descriptive name.

    :return: `ColorSpace`.

    |example_tag|

    .. code-block:: javascript

        let icc_colorspace = new mupdf.ColorSpace(fs.readFileSync("SWOP.icc"), "SWOP");



|instance_method_tag|


.. method:: getNumberOfComponents()

    A Grayscale colorspace has one component, RGB has 3, CMYK has 4, and DeviceN may have any number of components.

    :return: `number`.

    |example_tag|

    .. code-block:: javascript

        let cs = mupdf.ColorSpace.DeviceRGB;
        let num = cs.getNumberOfComponents(); // 3


.. method:: toString()

    Return name of `ColorSpace`.

    :return: `string`.

    |example_tag|

    .. code-block:: javascript

        var cs = mupdf.ColorSpace.DeviceRGB;
        var name = cs.toString(); // "[ColorSpace DeviceRGB]"


.. method:: isGray()

    Returns `true` if the object is a gray color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isGray();


.. method:: isRGB()


    Returns `true` if the object is an RGB color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isRGB();


.. method:: isCMYK()


    Returns `true` if the object is a CMYK color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isCMYK();

.. method:: isIndexed()


    Returns `true` if the object is an Indexed color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isIndexed();

.. method:: isLab()


    Returns `true` if the object is a Lab color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isLab();

.. method:: isDeviceN()


    Returns `true` if the object is a Device N color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isDeviceN();



.. method:: isSubtractive()


    Returns `true` if the object is a subtractive color space.

    :return: `boolean`.

    |example_tag|

    .. code-block:: javascript

        var bool = colorSpace.isSubtractive();



.. method:: getType()

    Returns a string indicating the type.

    :return: `string`. 
    
    One of:
    
    - "None"
    - "Gray"
    - "RGB"
    - "BGR"
    - "CMYK"
    - "Lab"
    - "Indexed"
    - "Separation"

    |example_tag|
    
    .. code-block:: javascript

        var type = colorSpace.getType();





