# Documentation

This documentation relies on [Sphinx](https://www.sphinx-doc.org/en/master/)
to publish HTML docs from [restructured text](https://en.wikipedia.org/wiki/ReStructuredText)
source files.

## Install dependencies

This README assumes you have [Sphinx v5.0.2 or above
installed](https://www.sphinx-doc.org/en/master/usage/installation.html) on
your system.

Ensure you have the necessary Sphinx extensions and themes installed:

	pip install pydata-sphinx-theme
	pip install sphinx-design
	pip install sphinx-copybutton
	pip install sphinx-notfound-page
	pip install sphinxcontrib.googleanalytics
	pip install rst2pdf
	pip install furo

## Build the HTML documentation.

After editing the source files in the `docs` directory, you will need to
rebuild the HTML files.

From the `docs` directory run:

	sphinx-build -b html . build/html

This then creates the HTML documentation within `build/html`. 

To do a full rebuild (including the assets in `_static`, for example when you have updated the CSS):

	sphinx-build -a -b html . build/html

### Using Sphinx Autobuild

A better way of building the documentation if you are actively working on updates is to run this from the `docs` folder:

	sphinx-autobuild . _build/html

This will serve the docs on a localhost and auto-update the pages live as you make edits.

For more help see [Using Sphinx](https://www.sphinx-doc.org/en/master/usage/index.html).
