.. _How_To_Guide_Migration:

Deprecated Modules
###################

The ``mupdf/tasks`` and ``mupdf/mupdfjs`` sub-modules have been deprecated and are no longer available.

The functions that the tasks and mupdfjs modules provided are now available as simple examples
that you can copy into your own projects if you need them.

From ``andytango/mupdf-js``
================================

To help you migrate from the https://github.com/andytango/mupdf-js library,
you can copy the tasks.ts file into your project.

.. literalinclude:: ../examples/tasks/tasks.ts
	:caption: examples/tasks/tasks.ts

From ``mupdfjs``
=================

Splitting a Document

.. literalinclude:: ../examples/tasks/pdf-split.ts
	:caption: examples/tasks/pdf-split.ts

Merging Documents

.. literalinclude:: ../examples/tasks/pdf-merge.ts
	:caption: examples/tasks/pdf-merge.ts

Scrubbing a Document

.. literalinclude:: ../examples/tasks/pdf-scrub.ts
	:caption: examples/tasks/pdf-scrub.ts

Adding Text to Pages

.. literalinclude:: ../examples/tasks/page-insert-text.ts
	:caption: examples/tasks/page-insert-text.ts

Adding Images to Pages

.. literalinclude:: ../examples/tasks/page-insert-image.ts
	:caption: examples/tasks/page-insert-image.ts

Extracting Document Images and Text

.. literalinclude:: ../examples/tasks/page-words.ts
	:caption: examples/tasks/page-words.ts

This might be useful for something.

.. literalinclude:: ../examples/tasks/page-resources-xobject.ts
	:caption: examples/tasks/page-resources-xobject.ts
