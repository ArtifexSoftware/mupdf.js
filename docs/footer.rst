.. raw:: html

   <div class="feedback" id="feedbackHolder">
      <div class="feedback-btns">
         Was this page helpful?
         <button id="feedback-button-yes" onclick="showFeedback('yes')" style="margin-left: 8px;">Yes</button>
         <button id="feedback-button-no" onclick="showFeedback('no')">No</button>
      </div>
      <div id="feedbackArea" style="display: none;">

         <div id="maths-test">
            <h3>Are you a human?</h3>
            <div id="maths-test-question"></div>
            <textarea id="maths-test-answer" rows="1" cols="5"></textarea>
         </div>

         <form method="post" target="feedback_print_popup" action="https://artifex.com/contributor/mupdfjs-process-feedback.php" onsubmit="submitFeedback();">
             <input type="hidden" name="url" id="feedback-doc-url-page">
             <input type="hidden" name="page" id="feedback-page-ref">
             <input type="hidden" name="helpful" id="feedback-helpful">
             <input type="hidden" name="mathsCorrect" id="maths-correct">

               <textarea class="feedback-text" name="suggestion" rows="5" cols="50" placeholder="Please provide your feedback here."></textarea>
               <input id="submitFeedbackButton" type="submit" name="submit" style="display: none;" value="Submit feedback">
         </form>

         <div class="textarea-btns" style="margin-top:-35px;">
            <button class="close-btn" onclick="closeFeedback()">Close</button>
         </div>
      </div>
   </div>



.. raw:: html

   <script>


      let numA = Math.ceil(Math.random(10)*10);
      let numB = Math.ceil(Math.random(10)*10);

      let mathsAnswer = numA+numB;

      document.getElementById("maths-test-question").innerHTML = "What is "+numA+ " + " + numB +"?";

      document.getElementById("maths-test-answer").addEventListener('input', () => {
         let answer = document.getElementById("maths-test-answer").value;
         if (answer == mathsAnswer) {
            document.getElementById("submitFeedbackButton").style = "display:block";
            document.getElementById('maths-correct').value = 1;
         } else {
            document.getElementById("submitFeedbackButton").style = "display:none";
            document.getElementById('maths-correct').value = 0;
         }
      });

      function showFeedback(response) {
         console.log("response="+response);
         // show the button which was chosen to the user
         document.getElementById('feedback-button-no').classList.remove("selected");
         document.getElementById('feedback-button-yes').classList.remove("selected");
         document.getElementById('feedback-button-'+response).classList.add("selected");
         document.getElementById('feedback-helpful').value = response;
         document.getElementById('feedbackArea').style.display = 'block';
      }

      function closeFeedback() {
         document.getElementById('feedbackArea').style.display = 'none';
      }

      function submitFeedback() {
         const popup = window.open('about:blank','feedback_print_popup','width=300,height=300');
         closeFeedback();
         setTimeout(function() { popup.close();}, 3000);
      }

      var url_string = window.location.href;

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



         // set the current URL on the feedback form
         const url_string = window.location.href;
         document.getElementById('feedback-doc-url-page').value = url_string;
         document.getElementById('feedback-page-ref').value = document.title

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

.. Core API links:
.. _Core API: https://mupdf.readthedocs.io/en/latest/mupdf-js.html
.. _Document:
.. _Document Class: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#document
.. _saveToBuffer: https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-document.html#saveToBuffer
.. _Page Class: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#page
.. _GraftObject: https://mupdf.readthedocs.io/en/latest/mupdf-js.html#graftObject 
.. _toPixmap: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#toPixmap
.. _ColorSpace: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#colorspace
.. _StructuredText: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#structuredtext
.. _Pixmap: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#pixmap
.. _Link: https://mupdf.readthedocs.io/en/latest/mutool-object-link.html#mutool-object-link
.. _PDFObject: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#pdfobject
.. _Rectangle:
.. _Rectangles: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#rectangles
.. _addEmbeddedFile: https://mupdf.readthedocs.io/en/latest/mupdf-js.html#addEmbeddedFile
.. _PDFPage: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#pdfpage
.. _PDFAnnotation class:
.. _PDFAnnotation: https://mupdf.readthedocs.io/en/latest/mupdf-js.html#pdfannotation
.. _createAnnotation: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#createAnnotation
.. _deleteAnnotation: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#deleteAnnotation
.. _setIcon:
.. _change the look of the icon: https://mupdf.readthedocs.io/en/latest/mutool-object-pdf-annotation.html#setIcon
.. _QuadPoints: https://mupdf.readthedocs.io/en/latest/mupdf-js.html#setQuadPoints
.. _Page.createLink: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#mutool-run-js-api-page-create-link
.. _Link Destination Object: https://mupdf.readthedocs.io/en/latest/mupdf-js.html#link-destination-object
.. _icon names: https://mupdf.readthedocs.io/en/latest/mutool-run-js-api.html#mutool-pdf-annotation-icon-names

