# mupdf.js documentation

Welcome to the documentation. This documentation relies on [Sphinx](https://www.sphinx-doc.org/en/master/) to publish HTML docs from markdown files written with [restructured text](https://en.wikipedia.org/wiki/ReStructuredText) (RST).


## Sphinx version

This README assumes you have [Sphinx v5.0.2 or above installed](https://www.sphinx-doc.org/en/master/usage/installation.html) on your system.


## Updating the documentation

Within `docs` update the associated restructured text (`.rst`) files. These files represent the corresponding document pages. 


## Building HTML documentation

- Ensure you have the `pydata` theme installed:

`pip install pydata-sphinx-theme`

- Ensure you have `Sphinx design` installed:

`pip install sphinx-design`

- Ensure you have `Sphinx Copy Button` installed:

`pip install sphinx-copybutton`

- From the "docs" location run:

`sphinx-build -b html . build/html`

This then creates the HTML documentation within `build/html`. 

> Use: `sphinx-build -a -b html . build/html` to build all, including the assets in `_static` (important if you have updated CSS).


---


For full details see: [Using Sphinx](https://www.sphinx-doc.org/en/master/usage/index.html) 



