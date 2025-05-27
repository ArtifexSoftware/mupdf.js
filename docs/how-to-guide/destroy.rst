.. _How_To_Guide_Destroy:

Destroying Objects
=================================

For memory maintenance it is recommended that you destroy **JavaScript** objects which are not in use.

Alongside class constructors, each **MuPDF.js** class has a `destroy()` method which is simple to call, for example:

.. code-block:: javascript

    page.destroy()
    document.destroy()
