# Buliding MuPDF.js Documentation

This documentation relies on
[Sphinx](https://www.sphinx-doc.org/en/master/)
to publish HTML docs from source files written with
[reStructuredText](https://docutils.sourceforge.io/rst.html)
and [Markdown](https://myst-parser.readthedocs.io/en/latest/intro.html).

This documentation relies on
[Sphinx](https://www.sphinx-doc.org/en/master/)
to publish HTML docs from source files written with
[reStructuredText](https://docutils.sourceforge.io/rst.html)
and [Markdown](https://myst-parser.readthedocs.io/en/latest/intro.html).

## Installing Sphinx

This README assumes you have [installed Sphinx](https://www.sphinx-doc.org/en/master/usage/installation.html) on your system.

We recommend setting up a virtual environment:

	python -m venv .venv

Activate the environment by sourcing the activation script:

	source .venv/bin/activate

In this environment run pip to install Sphinx and all the required modules.

	pip install -r docs/requirements.txt

## Building HTML documentation

Within the virtual environment you can now build the documentation:

	sphinx-build docs build

To do a fresh rebuild (in case files in the `_static` folder or the toc structure has changed):

	sphinx-build -E -a docs build

## Live edit HTML documentation

You can use [Sphinx Autobuild](https://pypi.org/project/sphinx-autobuild/) to rebuild
the documentation on changes, with hot reloading in the browser.

	pip install sphinx-autobuild
	sphinx-autobuild --open-browser docs build

## Using the script

There's also a helper script to run the above commands in one go:

	bash docs/build.sh
	bash docs/build.sh live
