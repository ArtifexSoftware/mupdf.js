# mupdf.js documentation

Welcome to the documentation. This documentation relies on [Sphinx](https://www.sphinx-doc.org/en/master/) to publish HTML docs from markdown files written with [restructured text](https://en.wikipedia.org/wiki/ReStructuredText) (RST).


## Sphinx version

This README assumes you have [Sphinx v5.0.2 or above installed](https://www.sphinx-doc.org/en/master/usage/installation.html) on your system.


## Updating the documentation

Within `docs` update the associated restructured text (`.rst`) files. These files represent the corresponding document pages. 


## Building HTML documentation

- Ensure you have the necessary Sphinx extensions and themes installed:

`pip install pydata-sphinx-theme`
`pip install sphinx-design`
`pip install sphinx-copybutton`
`pip install sphinx-notfound-page`
`pip install sphinxcontrib.googleanalytics`
`pip install rst2pdf`
`pip install furo`

- From the "docs" location run:

`sphinx-build -b html . build/html`

This then creates the HTML documentation within `build/html`. 

> Use: `sphinx-build -a -b html . build/html` to build all, including the assets in `_static` (important if you have updated CSS).


---

### Using Sphinx Autobuild

A better way of building the documentation if you are actively working on updates is to run this from the `docs` folder:

`sphinx-autobuild . _build/html`

This will serve the docs on a localhost and auto-update the pages live as you make edits.


For full details see: [Using Sphinx](https://www.sphinx-doc.org/en/master/usage/index.html) 



