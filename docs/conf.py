# see https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
import datetime

# from: pip install sphinxcontrib-googleanalytics
googleanalytics_id = "G-JZTN4VTL9M"

project = "MuPDF.js"
thisday = datetime.date.today()
copyright = "2023-" + str(thisday.year) + ", Artifex"

extensions = [
	"notfound.extension",
	"sphinx_copybutton",
	"sphinxcontrib.googleanalytics",
	"sphinx.ext.extlinks",
]

# rst2pdf is not available on OpenBSD.
if hasattr(os, "uname") and os.uname()[0] != "OpenBSD":
	extensions.append("rst2pdf.pdfbuilder")

exclude_patterns = [
	"*header*",
	"*footer*",
]

extlinks = {
	'mupdf': ('https://mupdf.readthedocs.io/en/latest/reference/javascript/types/%s.html', '%s'),
}

toc_object_entries_show_parents = "hide"
highlight_language = "typescript"
default_role = "any"
add_function_parentheses = False
add_module_names = False
show_authors = False
keep_warnings = False
keep_warnings = False

pygments_style = "default"

rst_prolog = """

.. |example_tag| raw:: html

   <span class="example-tag">EXAMPLE</span>

.. |constructor_tag| raw:: html

   <span class="constructor-tag">CONSTRUCTOR METHODS</span>

.. |instance_method_tag| raw:: html

   <span class="instance-method-tag">INSTANCE METHODS</span>

.. |static_method_tag| raw:: html

   <span class="static-method-tag">STATIC METHODS</span>

.. |instance_property_tag| raw:: html

   <span class="instance-properties-tag">INSTANCE PROPERTIES</span>

.. |page_spacer| raw:: html

   <div class="page-spacer" style="margin:40px 0 20px;"><hr/></div>

.. |TODO| raw:: html

   <div style="color:red;padding:10px;border:1px solid red;">TODO</div>

.. meta::
   :description: MuPDF.js Developer documentation.
   :keywords: mupdf, wasm, pdf, document, api, split, merge, extract, view

"""

rst_epilog = """

.. _MuPDF & JavaScript: https://mupdf.readthedocs.io/en/latest/guide/using-with-javascript.html
.. _Node JS & NPM: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
.. _Git: https://git-scm.com
.. _Python: https://www.python.org
.. _MuPDF.js repository on Github: https://github.com/ArtifexSoftware/mupdf.js
.. _http://localhost:8000/test.html: http://localhost:8000/test.html
.. _Wasm: 
.. _WebAssembly: https://webassembly.org
.. _Node.js: https://nodejs.org/
.. _PDF Reference 1.7: https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.7old.pdf

"""

# -- Options for HTML output ----------------------------------------------

html_theme = "furo"

html_favicon = "_static/favicon.ico"

html_static_path = ["_static"]
html_css_files = [ "custom.css" ]

html_domain_indices = False
html_use_index = False
html_split_index = False

html_show_sourcelink = False
html_show_sphinx = False
html_show_copyright = True

html_theme_options = {
	"light_logo": "sidebar-logo-dark.svg",
	"dark_logo": "sidebar-logo-light.svg",
	"footer_icons": [
		{
			"name": "Discord",
			"url": "https://discord.gg/DQjvZ6ERqH",
			"class": "discord-link",
			"html": """Find <b>#mupdf</b> on Discord <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 127.14 96.36"><path fill="#5865f2" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/></svg>""",
		},
	],
}

# -- Options for LaTeX output ---------------------------------------------

# Grouping the document tree into LaTeX files. List of tuples
# (source start file, target name, title,
#  author, documentclass [howto, manual, or own class]).
latex_documents = [("index", "MuPDFjs.tex", "MuPDF.js Documentation", "Artifex", "manual")]

latex_logo = "_static/sidebar-logo-dark.svg"
latex_show_pagerefs = False
latex_domain_indices = True

# -- Options for PDF output --------------------------------------------------

# Grouping the document tree into PDF files. List of tuples
# (source start file, target name, title, author).
pdf_documents = [("index", "MuPDF.js", "MuPDF.js Manual", "Artifex")]

pdf_compressed = True
pdf_language = "en_US"
pdf_use_index = True
pdf_use_modindex = True
pdf_use_coverpage = True
pdf_break_level = 2
pdf_verbosity = 0
pdf_invariant = True
