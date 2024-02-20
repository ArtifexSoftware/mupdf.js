.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_:



Working with Annotations
=========================




.. _Node_How_To_Get_All_Annotations:

Get All Annotations for a Document
------------------------------------------

The following code queries all the pages of a :ref:`document <Node_How_To_Guide_Document>` to retrieve the annotations on each :ref:`page <Node_How_To_Guide_Page>`.

.. code-block:: javascript

    let i = 0
    while (i < document.countPages()) {
        const page = document.loadPage(i)
        const annots = page.getAnnotations()
        console.log(`Page=${page}, Annotations=${annots}`)
        i++
    }


.. include:: ../node-footer.rst
.. include:: ../../../footer.rst


