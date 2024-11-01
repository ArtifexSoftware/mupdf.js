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

.. |node_js_logo| raw:: html

   <div class="node-js-logo"></div>

.. |TODO| raw:: html

   <div style="color:red;padding:10px;border:1px solid red;">TODO</div>

.. meta::
   :description: MuPDF.js Developer documentation.
   :keywords: mupdf, wasm, pdf, document, api, split, merge, extract, view


.. raw:: html

    <!-- file path issue -->
    <!-- note: we have to hard code the search path to the remote RTD root as the header is included in sub-dirs -->
    <!-- this is also why we add a remote Discord image -->


    <div style="display:flex;justify-content:space-between;align-items: center;">
        <form class="sidebar-search-container top" method="get" action="/en/latest/search.html" role="search" style="width:75%">
          <input class="sidebar-search" placeholder="Search" name="q" aria-label="Search">
          <input type="hidden" name="check_keywords" value="yes">
          <input type="hidden" name="area" value="default">
        </form>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
        <div class="discordLink" style="display:flex;align-items:center;margin-top: -5px;">
            <a href="https://discord.gg/zpyAHM7XtF" id="findOnDiscord" target=_blank>Find <b>#mupdf.js</b> on <b>Discord</b></a>
            <a href="https://discord.gg/zpyAHM7XtF" target=_blank>
            
                <div style="width:30px;height:30px;margin-left:5px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                        <defs>
                            <style>.discordLogoFill{fill:#5865f2;}</style>
                        </defs>
                        <g id="Discord_Logo" data-name="Discord Logo">
                            <path class="discordLogoFill" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                        </g>
                    </svg>
                </div>
            </a>
        </div>

        <div class="feedbackLink"><a id="feedbackLinkTop" target=_blank>Do you have any feedback on this page?</b></a></div>
    </div>

    <script>
        var url_string = window.location.href;
        var a = document.getElementById('feedbackLinkTop');
        a.setAttribute("href", "https://artifex.com/contributor/feedback.php?utm_source=rtd-mupdjsf&utm_medium=rtd&utm_content=header-link&url="+url_string);
    </script>
