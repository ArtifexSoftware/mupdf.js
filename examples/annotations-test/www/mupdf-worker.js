"use strict"

import * as mupdf from "../../node_modules/mupdf/dist/mupdf.js"

(async () => {

    const wrapper = {

        loadPDF: function(data) {
            let document = new mupdf.PDFDocument(data);
            return document;
        },

        getDSFromAnnotation: function(annot) {

            const ds = annot.getObject().get("DS");

            if (ds.isNull()) {
                return;
            }

            const dsString = ds.asString();
            return dsString;

        }

    }

    const documentBuffer = await (await (await fetch('annot-sample.pdf')).blob()).arrayBuffer();
    const document = wrapper.loadPDF(documentBuffer);

    let ctm = mupdf.Matrix.identity;
    let page, pixmap, bbox, device;
    try {
        page = document.loadPage(0);

        bbox = mupdf.Rect.transform(page.getBounds(), ctm);
        pixmap = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, bbox, false);
        pixmap.clear(0xff);
  
        device = new mupdf.DrawDevice(ctm, pixmap);
        page.runPageContents(device, mupdf.Matrix.identity);
        page.runPageAnnots(device, mupdf.Matrix.identity);
        page.runPageWidgets(device, mupdf.Matrix.identity);
        device.close();
        device.destroy();
  
        let png = pixmap?.asPNG();
        postMessage(["image", png]);
    } finally {
        pixmap?.destroy();
        page?.destroy();
    }

    page = document.loadPage(0);
    const annots = page.getAnnotations();

    var dict = document.getTrailer();

    postMessage(["debug", "document.getTrailer()="+dict]);

    // Common properties
    // [NOT PROVIDED] NM (Name) - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/35
    // [NOT PROVIDED] Rotate: Need to render properly (e.g. Rotated FreeText) - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/34
    // [NOT PROVIDED] #11. Subj (Subject) - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/36    

    // Highlight
    postMessage(["debug", "annots[0].getType()="+annots[0].getType()]); // 'Highlight'
    postMessage(["debug", "oid (Object Id))="+annots[0].getObject().asIndirect()]); // 'Highlight'
    // ^ JL, How to get object ID
    postMessage(["debug", "annots[0].getColor()="+annots[0].getColor()]); // [1, 1, 0]
    postMessage(["debug", "annots[0].getQuadPoints()="+annots[0].getQuadPoints()]); // [ [ 24.812000274658203, 23.8389892578125, 77.26370239257812, 23.8389892578125, 24.812000274658203, 36.21099853515625, 77.26370239257812, 36.21099853515625 ] ]
    postMessage(["debug", "annots[0].getBounds()="+annots[0].getBounds()]); // [21.509300231933594, 23.4520263671875, 80.56639862060547, 36.5980224609375]

    // Popup of Highlight
    // It is not in the list of annotations. But, we can know its position by its parent's getPopup() method.

    // StrikeOut
    postMessage(["debug", "annots[1].getType()="+annots[1].getType()]); // 'StrikeOut'

    // Underline
    postMessage(["debug", "annots[2].getType()="+annots[2].getType()]); // 'Underline'

    // Ink
    postMessage(["debug", "annots[3].getType()="+annots[3].getType()]); // 'Ink'
    postMessage(["debug", "annots[3].getColor()="+annots[3].getColor()]); // [1, 0, 0]
    postMessage(["debug", "annots[3].getInkList()="+annots[3].getInkList()]); // [ [ [163.46800231933594, 45.73199462890625], ... ], Array(22), Array(19), Array(20) ]
    postMessage(["debug", "annots[3].getBorderWidth()="+annots[3].getBorderWidth()]); // 1

    // Redact
    postMessage(["debug", "annots[4].getType()="+annots[4].getType()]); // 'Redact'
    postMessage(["debug", "annots[4].getInteriorColor()="+annots[4].getInteriorColor()]); // [0, 0, 0]
    postMessage(["debug", "annots[4].getColor()="+annots[4].getColor()]); // [1, 0, 0]

    // Square
    postMessage(["debug", "annots[5].getType()="+annots[5].getType()]); // 'Square'
    
    // Circle
    postMessage(["debug", "annots[6].getType()="+annots[6].getType()]); // 'Circle'

    // FreeText
    postMessage(["debug", "annots[7].getType()="+annots[7].getType()]); // 'FreeText'
    postMessage(["debug", "annots[7].getContents()="+annots[7].getContents()]); // 'It has reply annot'
    // [ERROR] It doesn't return border color.
    postMessage(["debug", "annots[7].getColor()="+annots[7].getColor()]); // [1, 1, 1] (Wrong. The text color is [0,0,1]). I think it is reporting fill color here.
  
    postMessage(["debug", "annots[7].getDefaultAppearance()="+annots[7].getDefaultAppearance()]); // { color: [1, 0, 0], font: 'Helv', size: 12 }
    // ^ Note: it reports as "red" - so this is the border color

    postMessage(["debug", "annots[7].getFlags())="+annots[7].getFlags()]);

    // Text (reply) has IRT
    postMessage(["debug", "annots[8].getType()="+annots[8].getType()]); // 'Text'
    postMessage(["debug", "annots[8].getContents()="+annots[8].getContents()]); // 'Unmarked set by minhyeok'
    // [NOT PROVIDED] IRT (in reply to)
    // JL - see https://github.com/ArtifexSoftware/mupdf.js/issues/37

    // FreeTextCallout
    postMessage(["debug", "annots[9].getType()="+annots[9].getType()]); // 'FreeText'
    // [NOT PROVIDED] IT (Intended type): 'FreeTextCallout' - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/38
    // [NOT PROVIDED] CL entry (FreeTextCallout properties): coordinate of 3 points - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/39
    // [NOT PROVIDED] RD (Rectangle Difference): need to ensure textbox's position - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/32

    // Line
    postMessage(["debug", "annots[10].getType()="+annots[10].getType()]); // 'Line'
    postMessage(["debug", "annots[10].getLineEndingStyles()="+annots[10].getLineEndingStyles()]); // { start: 'Circle', end: 'None' }
    postMessage(["debug", "annots[10].getInteriorColor()="+annots[10].getInteriorColor()]); // [0.25, 0.3333280086517334, 1]
    postMessage(["debug", "annots[10].getBorderStyle()="+annots[10].getBorderStyle()]); // 'Dashed'
    postMessage(["debug", "annots[10].getBorderDashPattern()="+annots[10].getBorderDashPattern()]); // [2, 2]
    postMessage(["debug", "annots[10].getColor()="+annots[10].getColor()]); // [1, 0, 0]
    postMessage(["debug", "annots[10].getLine()="+annots[10].getLine()]); // [ [ 371.739013671875, 34.8280029296875 ], [ 433.69500732421875, 104.8489990234375 ] ]
    postMessage(["debug", "annots[10].getBorderWidth()="+annots[10].getBorderWidth()]); // 2

    // PolyLine
    postMessage(["debug", "annots[11].getType()="+annots[11].getType()]); // 'PolyLine'
    postMessage(["debug", "annots[11].getVertices()="+annots[11].getVertices()]); // [[459.7239990234375,94.583984375],[497.85101318359375,44.3590087890625],[513.614990234375,103.0159912109375],[549.5430297851562,52.42498779296875]]

    // Polygon
    postMessage(["debug", "annots[12].getType()="+annots[12].getType()]); // 'Polygon'

    // PolygonCloud
    postMessage(["debug", "annots[13].getType()="+annots[13].getType()]); // 'Polygon'
    // [NOT PROVIDED] IT (Intended type): 'PolygonCloud' - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/38
    postMessage(["debug", "annots[13].getBorderEffect()="+annots[13].getBorderEffect()]); // 'Cloudy'
    postMessage(["debug", "annots[13].getBorderEffectIntensity()="+annots[13].getBorderEffectIntensity()]); // 2

    // Stmap
    postMessage(["debug", "annots[14].getType()="+annots[14].getType()]); // 'Stamp'

    // LineDimension
    postMessage(["debug", "annots[15].getType()="+annots[15].getType()]); // 'Line'
    // [NOT PROVIDED] IT (Intended type): 'LineDimension' - JL ,see: https://github.com/ArtifexSoftware/mupdf.js/issues/38
    // [NOT PROVIDED] LL (Leader Line): 20 - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/40
    // [NOT PROVIDED] LLE (Leader Line Extension): 10 - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/41
    // [NOT PROVIDED] Measure: { R: '1 mm = 1 km', X: [ { C: 0.352778, D: 100, U: 'km' } ]} - JL, see: https://github.com/ArtifexSoftware/mupdf.js/issues/42 

    // FreeText
    postMessage(["debug", "annots[16].getType()="+annots[16].getType()]); // 'FreeText'
    postMessage(["debug", "annots[16].getContents()="+annots[16].getContents()]); // 'Rotated FreeText'

    // [ERROR] Throws an exception!
    //postMessage(["debug", "annots[16].getColor()="+annots[16].getColor()]); // Throws an exception!
    

    const dsString = wrapper.getDSFromAnnotation(annots[16]); // "font: Impact,sans-serif 14.0pt; text-align:left; color:#008EFF"
    postMessage(["debug", "dsString="+dsString]);
    // Do something with the string...


    postMessage(["debug", "annots[16].getDefaultAppearance()="+annots[16].getDefaultAppearance()]); // { color: [0, 0.556863009929657, 1], font: 'Helv', size: 14 }
    // ^JL, MuPDF replaces the font to a font which can be used for editing (by default this is "Helvetica") whilst keeping the appearance of the font, 
    // note this is also what Adobe does.

    postMessage(["debug", "annots[16].getObject().getNumber="+annots[16].getObject().getNumber("Rotate")]);
    
    const widgets = page.getWidgets();

    // Widget (Text Field) merged with Field (V: 3)
    postMessage(["debug", "widgets[0].getType()="+ widgets[0].getType()]); // 'Widget'
    postMessage(["debug", "widgets[0].getFieldType()="+ widgets[0].getFieldType()]); // 'text'
    postMessage(["debug", "widgets[0].getName()="+ widgets[0].getName()]); // 'Text1'
    // [QUESTION] What is different between getLabel() and getName()?
    postMessage(["debug", "widgets[0].getLabel()="+ widgets[0].getLabel()]); // 'Text1'
    postMessage(["debug", "widgets[0].getValue()="+ widgets[0].getValue()]); // '3' (V)
    // [NOT PROVIDED] Q (Text alignment for Text Field)
    postMessage(["debug", "widgets[0].getDefaultAppearance()="+ widgets[0].getDefaultAppearance()]); // { font: 'TiRo', size: 12, color: [1, 0, 0] }

    // Widget (Text Field) has AA(Additional Actions) (V: 15)
    postMessage(["debug", "widgets[2].getFieldType()="+ widgets[2].getFieldType()]); // 'text'
    // [NOT PROVIDED] AA (Additional Actions) - { "S": "JavaScript", "JS": "AFSimple_Calculate(\"PRD\", new Array (\"Text1\", \"Text2\"));" }
    

    // TextField (V: It has same field)
    postMessage(["debug", "widgets[3].getFieldType()="+ widgets[3].getFieldType()]); // 'text'
    postMessage(["debug", "widgets[4].getFieldType()="+ widgets[4].getFieldType()]); // 'text'
    // [NOT PROVIDED] Parent information: we need to know that widgets[3] and widgets[4] share same Parent(AcroField)

    // ListBox
    postMessage(["debug", "widgets[5].getFieldType()="+ widgets[5].getFieldType()]); // 'listbox'
    // [NOT PROVIDED] Default VAlue(DV) - "Value1"
    // [NOT PROVIDED] Selected Index (I) - [ 0 ]
    // [ERROR] Wrong. Its fill color is #ffffff.
    //postMessage(["debug", "widgets[5].getInteriorColor()="+ widgets[5].getInteriorColor()]); // JL - Throws an error!
    // [ERROR] Wrong. It doesn't return anything. (It seems issue of mupdf.js - 3101 lines)
    // (Correct value: [["Value1", "Item1"], ["Value2", "Item2"], ["Value3", "Item3"]] )
    postMessage(["debug", "widgets[5].getOptions()="+ widgets[5].getOptions()]); // undefined

    // ComboBox
    postMessage(["debug", "widgets[6].getFieldType()="+ widgets[6].getFieldType()]); // 'combobox'
    postMessage(["debug", "widgets[6].getFieldFlags()="+ widgets[6].getFieldFlags()]); // 131072

    // CheckBox
    postMessage(["debug", "widgets[7].getFieldType()="+ widgets[7].getFieldType()]); // 'checkbox'
    // [NOT PROVIDED] We need to know value of chekced state. (In this case, it is 'Yes')
    // -> Although, we can set checked state by toggle() method, but we need to know it without toggle() method because we'll modify checkbox in our PDF engine until modification feature of mupdf.js is ready.
    // [ERROR] Wrong. Its fill color is #3FA954.
    //postMessage(["debug", "widgets[7].getInteriorColor()="+ widgets[7].getInteriorColor()]); // [] // JL - Throws an error!
    // [NOT PROVIDED] We need to know its border color. (#FF00FF)
    // [NOT PROVIDED] We need to know MK.CA entry for rendering checkbox correctly. ("l")
    // (Please refer to PDF reference 1.7 642p. - Table 8.40 Entries is an appearance characteristics dictionary)

    // Radio Button
    postMessage(["debug", "widgets[9].getFieldType()="+ widgets[9].getFieldType()]); // 'radiobutton'
    // [NOT PROVIDED] We need to know apperance state(AS) ("YES")
    // [NOT PROVIDED] We need to know Parent information for knowing sibling radio buttons.

    // Signature
    postMessage(["debug", "widgets[13].getFieldType()="+ widgets[13].getFieldType()]); // 'signature'
    // [NOT PROVIDED] We need to know its value(Signature information) to know whether it is signed or not.
    // And we also need to know Filter, M, Name of value(V) to distinguish timestamp(TSA).
    // (Signature in this document isn't signed. So, its value is empty.)

    // TextField (Rotated)
    postMessage(["debug", "widgets[14].getFieldType()="+ widgets[14].getFieldType()]); // 'text'
    // [NOT PROVIDED] We need to know MK.R entry for rendering rotated text field correctly.
})();
