.. include:: ../../../header.rst
.. include:: ../node-header.rst

.. _Node_How_To_Guide_Document:



Document
=========================


Core API
----------------------------------

Once you have a document instance you are free to use the **Core JavaScript API** methods as you wish, please see the :ref:`Core_API` methods for the `Document Class`_ for full details.


Passwords & Security
--------------------------

A document may require a password if it is protected. To check this use the `needsPassword` method as follows:


.. code-block:: javascript

    let needsPassword = document.needsPassword()


To provide a password use the `authenticatePassword` method as follows:

.. code-block:: javascript

    let auth = document.authenticatePassword("abracadabra")

See the `authenticate password return values`_ for what the return value means.

Setting a document password
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


.. include:: ../../../footer.rst




.. _authenticate password return values: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#authenticatePassword