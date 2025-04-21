.. raw:: html

   <script>

      // On Load, do what we need to do with the DOM
      document.body.onload = function() {

         // ensure external links open in a new tab
         const collection = document.getElementsByClassName("nav-external");
         for (var i=0;i<collection.length;i++) {
            collection[i].setAttribute("target", "blank");
         }

         const collectionB = document.getElementsByClassName("reference external");
         for (var i=0;i<collectionB.length;i++) {
            collectionB[i].setAttribute("target", "blank");
         }

         // set the copyright
         const footerItem = document.getElementsByClassName("footer-item");
         for (var i=0;i<footerItem.length;i++) {
            const copyright = footerItem[i].getElementsByClassName("copyright");
            for (var j=0;j<copyright.length;j++) {
               copyright[j].innerHTML = "&copy; Copyright 2024 <a href='https://artifex.com' target=_blank>Artifex Software, Inc</a> — All Rights Reserved";
            }
         }

         const footerItemEnd = document.getElementsByClassName("footer-items__end");
         for (var i=0;i<footerItemEnd.length;i++) {
            const endItem = footerItemEnd[i];
            endItem.innerHTML = "<a href='https://discord.gg/zpyAHM7XtF' target='new'>Support</a>";
         }


      };


      function gotoPage(page) {
         window.location.href = page;
      }


   </script>



.. external links

.. _MuPDF & JavaScript: https://mupdf.readthedocs.io/en/latest/mupdf-js.html
.. _Node JS & NPM: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
.. _Git: https://git-scm.com
.. _Python: https://www.python.org
.. _MuPDF.js repository on Github: https://github.com/ArtifexSoftware/mupdf.js
.. _http://localhost:8000/test.html: http://localhost:8000/test.html
.. _Wasm: 
.. _WebAssembly: https://webassembly.org
.. _Node.js: https://nodejs.org/
.. _PDF Reference 1.7: https://opensource.adobe.com/dc-acrobat-sdk-docs/pdfstandards/pdfreference1.7old.pdf


