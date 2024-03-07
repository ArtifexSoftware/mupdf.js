type Matrix = [number, number, number, number, number, number];
type Rect = [number, number, number, number];
type Quad = [number, number, number, number, number, number, number, number];
type Point = [number, number];
type Color = [number] | [number, number, number] | [number, number, number, number];
type Rotate = 0 | 90 | 180 | 270;
export declare class TryLaterError extends Error {
    constructor(message: any);
}
export declare class AbortError extends Error {
    constructor(message: any);
}
type AnyBuffer = Buffer | ArrayBuffer | Uint8Array | string;
export declare function enableICC(): void;
export declare function disableICC(): void;
export declare function setUserCSS(text: any): void;
export declare const Matrix: {
    identity: Matrix;
    scale(sx: number, sy: number): Matrix;
    translate(tx: number, ty: number): Matrix;
    rotate(d: number): Matrix;
    invert(m: Matrix): Matrix;
    concat(one: Matrix, two: Matrix): Matrix;
};
export declare const Rect: {
    MIN_INF_RECT: number;
    MAX_INF_RECT: number;
    isEmpty: (rect: Rect) => boolean;
    isValid: (rect: Rect) => boolean;
    isInfinite: (rect: Rect) => boolean;
    transform: (rect: Rect, matrix: Matrix) => Rect;
};
declare class Userdata {
    static _finalizer: FinalizationRegistry<number>;
    static readonly _drop: (pointer: number) => void;
    pointer: number;
    constructor(pointer: number);
    destroy(): void;
    toString(): string;
    valueOf(): void;
}
export declare class Buffer extends Userdata {
    static readonly _drop: any;
    /** New empty Buffer. */
    constructor();
    /** New Buffer initialized with string contents as UTF-8. */
    constructor(data: string);
    /** New Buffer initialized with typed array contents. */
    constructor(data: ArrayBuffer | Uint8Array);
    /** PRIVATE */
    constructor(pointer: number);
    getLength(): number;
    readByte(at: number): number;
    write(s: string): void;
    writeByte(b: number): void;
    writeLine(s: string): void;
    writeBuffer(other: AnyBuffer): void;
    asUint8Array(): Uint8Array;
    slice(start: number, end: number): Buffer;
    asString(): string;
}
export declare class ColorSpace extends Userdata {
    static readonly _drop: any;
    static readonly COLORSPACE_TYPES: string[];
    constructor(profile: AnyBuffer, name: string);
    constructor(pointer: number);
    getName(): string;
    getType(): string;
    getNumberOfComponents(): number;
    isGray(): boolean;
    isRGB(): boolean;
    isCMYK(): boolean;
    isIndexed(): boolean;
    isLab(): boolean;
    isDeviceN(): boolean;
    isSubtractive(): boolean;
    toString(): string;
    static readonly DeviceGray: ColorSpace;
    static readonly DeviceRGB: ColorSpace;
    static readonly DeviceBGR: ColorSpace;
    static readonly DeviceCMYK: ColorSpace;
    static readonly Lab: ColorSpace;
}
export declare class Font extends Userdata {
    static readonly _drop: any;
    static readonly SIMPLE_ENCODING: string[];
    static readonly ADOBE_CNS = 0;
    static readonly ADOBE_GB = 1;
    static readonly ADOBE_JAPAN = 2;
    static readonly ADOBE_KOREA = 3;
    static readonly CJK_ORDERING_BY_LANG: {
        "Adobe-CNS1": number;
        "Adobe-GB1": number;
        "Adobe-Japan1": number;
        "Adobe-Korea1": number;
        "zh-Hant": number;
        "zh-TW": number;
        "zh-HK": number;
        "zh-Hans": number;
        "zh-CN": number;
        ja: number;
        ko: number;
    };
    constructor(name: string, data: AnyBuffer, subfont: number);
    constructor(pointer: number);
    getName(): string;
    encodeCharacter(uni: number | string): number;
    advanceGlyph(gid: number, wmode?: number): number;
    isMono(): boolean;
    isSerif(): boolean;
    isBold(): boolean;
    isItalic(): boolean;
}
export declare class Image extends Userdata {
    static readonly _drop: any;
    constructor(pointer: number);
    constructor(data: AnyBuffer);
    constructor(pixmap: Pixmap, colorspace: ColorSpace);
    getWidth(): number;
    getHeight(): number;
    getNumberOfComponents(): number;
    getBitsPerComponent(): number;
    getXResolution(): number;
    getYResolution(): number;
    getImageMask(): boolean;
    getColorSpace(): ColorSpace;
    getMask(): Image;
    toPixmap(): Pixmap;
}
type LineCap = number | "Butt" | "Round" | "Square" | "Triangle";
type LineJoin = number | "Miter" | "Round" | "Bevel" | "MiterXPS";
export declare class StrokeState extends Userdata {
    static readonly _drop: any;
    static readonly LINE_CAP: string[];
    static readonly LINE_JOIN: string[];
    constructor(pointer?: number);
    getLineCap(): number;
    setLineCap(j: LineCap): void;
    getLineJoin(): number;
    setLineJoin(j: LineJoin): void;
    getLineWidth(w: any): number;
    setLineWidth(w: number): void;
    getMiterLimit(): number;
    setMiterLimit(m: number): void;
}
export declare class Path extends Userdata {
    static readonly _drop: any;
    constructor(pointer?: number);
    getBounds(strokeState: StrokeState, transform: Matrix): Rect;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void;
    curveToV(cx: number, cy: number, ex: number, ey: number): void;
    curveToY(cx: number, cy: number, ex: number, ey: number): void;
    closePath(): void;
    rect(x1: number, y1: number, x2: number, y2: number): void;
    transform(matrix: Matrix): void;
    walk(walker: any): void;
}
export declare class Text extends Userdata {
    static readonly _drop: any;
    constructor(pointer?: number);
    getBounds(strokeState: StrokeState, transform: Matrix): Rect;
    showGlyph(font: Font, trm: Matrix, gid: number, uni: number, wmode?: number): void;
    showString(font: Font, trm: Matrix, str: string, wmode?: number): void;
    walk(walker: any): void;
}
export declare class DisplayList extends Userdata {
    static readonly _drop: any;
    constructor(pointer: number);
    constructor(mediabox: Rect);
    getBounds(): Rect;
    toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha?: boolean): Pixmap;
    toStructuredText(options?: string): StructuredText;
    run(device: Device, matrix: Matrix): void;
    search(needle: string, max_hits?: number): Quad[];
}
export declare class Pixmap extends Userdata {
    static readonly _drop: any;
    constructor(pointer: number);
    constructor(colorspace: ColorSpace, bbox: Rect, alpha: boolean);
    getBounds(): Rect;
    clear(value?: number): void;
    getWidth(): number;
    getHeight(): number;
    getX(): number;
    getY(): number;
    getStride(): number;
    getNumberOfComponents(): number;
    getAlpha(): number;
    getXResolution(): number;
    getYResolution(): number;
    setResolution(x: number, y: number): void;
    getColorSpace(): ColorSpace;
    getPixels(): Uint8ClampedArray;
    asPNG(): Uint8Array;
    asPSD(): Uint8Array;
    asPAM(): Uint8Array;
    asJPEG(quality: any, invert_cmyk: any): Uint8Array;
    invert(): void;
    invertLuminance(): void;
    gamma(p: number): void;
    tint(black: number | Color, white: number | Color): void;
    convertToColorSpace(colorspace: any, keepAlpha?: boolean): Pixmap;
    warp(points: Point[], width: number, height: number): Pixmap;
}
export declare class Shade extends Userdata {
    static readonly _drop: any;
    constructor(pointer: number);
    getBounds(): Rect;
}
interface StructuredTextWalker {
    onImageBlock?(bbox: Rect, transform: Matrix, image: Image): void;
    beginTextBlock?(bbox: Rect): void;
    beginLine?(bbox: Rect, wmode: number, direction: Point): void;
    onChar?(c: string, origin: Point, font: Font, size: number, quad: Quad): void;
    endLine?(): void;
    endTextBlock?(): void;
}
export declare class StructuredText extends Userdata {
    static readonly _drop: any;
    static readonly SELECT_CHARS = 0;
    static readonly SELECT_WORDS = 1;
    static readonly SELECT_LINES = 2;
    walk(walker: StructuredTextWalker): void;
    asJSON(scale?: number): string;
    search(needle: string, max_hits?: number): Quad[];
}
type BlendMode = number | "Normal" | "Multiply" | "Screen" | "Overlay" | "Darken" | "Lighten" | "ColorDodge" | "ColorBurn" | "HardLight" | "SoftLight" | "Difference" | "Exclusion" | "Hue" | "Saturation" | "Color" | "Luminosity";
export declare class Device extends Userdata {
    static readonly _drop: any;
    static readonly BLEND_MODES: string[];
    fillPath(path: Path, evenOdd: boolean, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number): void;
    strokePath(path: Path, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number): void;
    clipPath(path: Path, evenOdd: boolean, ctm: Matrix): void;
    clipStrokePath(path: Path, stroke: StrokeState, ctm: Matrix): void;
    fillText(text: Text, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number): void;
    strokeText(text: Text, stroke: StrokeState, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number): void;
    clipText(text: Text, ctm: Matrix): void;
    clipStrokeText(text: Text, stroke: StrokeState, ctm: Matrix): void;
    ignoreText(text: Text, ctm: Matrix): void;
    fillShade(shade: Shade, ctm: Matrix, alpha: number): void;
    fillImage(image: Image, ctm: Matrix, alpha: number): void;
    fillImageMask(image: Image, ctm: Matrix, colorspace: ColorSpace, color: Color, alpha: number): void;
    clipImageMask(image: Image, ctm: Matrix): void;
    popClip(): void;
    beginMask(area: Rect, luminosity: boolean, colorspace: ColorSpace, color: Color): void;
    endMask(): void;
    beginGroup(area: any, colorspace: ColorSpace, isolated: boolean, knockout: boolean, blendmode: BlendMode, alpha: number): void;
    endGroup(): void;
    beginTile(area: Rect, view: Rect, xstep: number, ystep: number, ctm: Matrix, id: number): any;
    endTile(): void;
    beginLayer(name: string): void;
    endLayer(): void;
    close(): void;
}
export declare class DrawDevice extends Device {
    constructor(matrix: Matrix, pixmap: Pixmap);
}
export declare class DisplayListDevice extends Device {
    constructor(displayList: DisplayList);
}
export declare class DocumentWriter extends Userdata {
    static readonly _drop: any;
    constructor(buffer: Buffer, format: string, options: string);
    beginPage(mediabox: Rect): Device;
    endPage(): void;
    close(): void;
}
export declare class Document extends Userdata {
    static readonly _drop: any;
    static readonly META_FORMAT = "format";
    static readonly META_ENCRYPTION = "encryption";
    static readonly META_INFO_AUTHOR = "info:Author";
    static readonly META_INFO_TITLE = "info:Title";
    static readonly META_INFO_SUBJECT = "info:Subject";
    static readonly META_INFO_KEYWORDS = "info:Keywords";
    static readonly META_INFO_CREATOR = "info:Creator";
    static readonly META_INFO_PRODUCER = "info:Producer";
    static readonly META_INFO_CREATIONDATE = "info:CreationDate";
    static readonly META_INFO_MODIFICATIONDATE = "info:ModDate";
    static readonly PERMISSION: {
        print: number;
        copy: number;
        edit: number;
        annotate: number;
        form: number;
        accessibility: number;
        assemble: number;
        "print-hq": number;
    };
    static readonly LINK_DEST: string[];
    static openDocument(from: Buffer | ArrayBuffer | Uint8Array | Stream, magic: string): Document;
    formatLinkURI(dest: any): string;
    isPDF(): this is PDFDocument;
    needsPassword(): boolean;
    authenticatePassword(password: any): number;
    hasPermission(flag: any): boolean;
    getMetaData(key: string): string;
    setMetaData(key: string, value: string): void;
    countPages(): number;
    isReflowable(): boolean;
    layout(w: number, h: number, em: number): void;
    loadPage(index: number): PDFPage | Page;
    loadOutline(): any[];
    resolveLink(link: string | Link): number;
    outlineIterator(): OutlineIterator;
}
interface OutlineItem {
    title: string;
    uri: string;
    open: boolean;
}
export declare class OutlineIterator extends Userdata {
    static readonly _drop: any;
    item(): {
        title: string;
        uri: string;
        open: boolean;
    };
    next(): number;
    prev(): number;
    up(): number;
    down(): number;
    delete(): number;
    insert(item: OutlineItem): number;
    update(item: OutlineItem): void;
}
export declare class Link extends Userdata {
    static readonly _drop: any;
    getBounds(): Rect;
    setBounds(rect: Rect): void;
    getURI(): string;
    setURI(uri: string): void;
    isExternal(): boolean;
}
export declare class Page extends Userdata {
    static readonly _drop: any;
    isPDF(): this is PDFPage;
    getBounds(): Rect;
    getLabel(): string;
    run(device: Device, matrix: Matrix): void;
    runPageContents(device: Device, matrix: Matrix): void;
    runPageAnnots(device: Device, matrix: Matrix): void;
    runPageWidgets(device: Device, matrix: Matrix): void;
    toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha?: boolean, showExtras?: boolean): Pixmap;
    toDisplayList(showExtras?: boolean): DisplayList;
    toStructuredText(options?: string): StructuredText;
    getLinks(): any[];
    createLink(bbox: Rect, uri: string): Link;
    deleteLink(link: Link): void;
    search(needle: string, max_hits?: number): Quad[];
}
export declare class PDFDocument extends Document {
    constructor();
    constructor(data: Buffer | ArrayBuffer | Uint8Array);
    constructor(pointer: number);
    loadPage(index: number): PDFPage;
    _fromPDFObjectNew(ptr: number): PDFObject;
    _fromPDFObjectKeep(ptr: number): PDFObject;
    _toPDFObject(obj: any): PDFObject;
    _PDFOBJ(obj: any): number;
    getVersion(): number;
    getLanguage(): string;
    setLanguage(lang: string): void;
    countObjects(): number;
    getTrailer(): PDFObject;
    createObject(): PDFObject;
    newNull(): PDFObject;
    newBoolean(v: boolean): PDFObject;
    newInteger(v: number): PDFObject;
    newReal(v: number): PDFObject;
    newName(v: string): PDFObject;
    newString(v: string): PDFObject;
    newIndirect(v: number): PDFObject;
    newArray(cap?: number): PDFObject;
    newDictionary(cap?: number): PDFObject;
    deleteObject(num: number | PDFObject): void;
    addObject(obj: any): PDFObject;
    addStream(buf: AnyBuffer, obj: any): PDFObject;
    addRawStream(buf: AnyBuffer, obj: any): PDFObject;
    newGraftMap(): PDFGraftMap;
    graftObject(obj: any): PDFObject;
    graftPage(to: number, srcDoc: PDFDocument, srcPage: number): void;
    addSimpleFont(font: Font, encoding?: "Latin" | "Greek" | "Cyrillic"): PDFObject;
    addCJKFont(font: Font, lang: string | number, wmode?: number, serif?: boolean): PDFObject;
    addFont(font: Font): PDFObject;
    addImage(image: Image): PDFObject;
    loadImage(ref: PDFObject): Image;
    findPage(index: number): PDFObject;
    addPage(mediabox: Rect, rotate: Rotate, resources: any, contents: AnyBuffer): PDFObject;
    insertPage(at: number, obj: any): void;
    deletePage(at: number): void;
    isEmbeddedFile(ref: PDFObject): any;
    addEmbeddedFile(filename: string, mimetype: string, contents: AnyBuffer, created: Date, modified: Date, checksum?: boolean): PDFObject;
    getEmbeddedFileParams(ref: PDFObject): {
        filename: string;
        mimetype: string;
        size: number;
        creationDate: Date;
        modificationDate: Date;
    };
    getEmbeddedFileContents(ref: PDFObject): Buffer;
    getEmbeddedFiles(): any;
    saveToBuffer(options?: string): Buffer;
    static readonly PAGE_LABEL_NONE = "\0";
    static readonly PAGE_LABEL_DECIMAL = "D";
    static readonly PAGE_LABEL_ROMAN_UC = "R";
    static readonly PAGE_LABEL_ROMAN_LC = "r";
    static readonly PAGE_LABEL_ALPHA_UC = "A";
    static readonly PAGE_LABEL_ALPHA_LC = "a";
    setPageLabels(index: number, style?: string, prefix?: string, start?: number): void;
    deletePageLabels(index: number): void;
    wasRepaired(): boolean;
    hasUnsavedChanges(): boolean;
    countVersions(): number;
    countUnsavedVersions(): number;
    validateChangeHistory(): number;
    canBeSavedIncrementally(): boolean;
    enableJournal(): void;
    getJournal(): {
        position: number;
        steps: string[];
    };
    beginOperation(op: string): void;
    beginImplicitOperation(): void;
    endOperation(): void;
    abandonOperation(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    undo(): void;
    redo(): void;
    isJSSupported(): boolean;
    enableJS(): void;
    disableJS(): void;
    setJSEventListener(listener: any): void;
    rearrangePages(pages: number[]): void;
}
type PDFPageBox = "MediaBox" | "CropBox" | "BleedBox" | "TrimBox" | "ArtBox";
export declare class PDFPage extends Page {
    _doc: PDFDocument;
    _annots: PDFAnnotation[];
    _widgets: PDFWidget[];
    constructor(doc: PDFDocument, pointer: number);
    getObject(): PDFObject;
    static readonly BOXES: string[];
    getTransform(): Matrix;
    setPageBox(which: PDFPageBox, rect: Rect): void;
    toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha?: boolean, showExtras?: boolean, usage?: string, box?: PDFPageBox): Pixmap;
    getWidgets(): PDFWidget[];
    getAnnotations(): PDFAnnotation[];
    createAnnotation(type: PDFAnnotationType): PDFAnnotation;
    deleteAnnotation(annot: PDFAnnotation): void;
    static readonly REDACT_IMAGE_NONE = 0;
    static readonly REDACT_IMAGE_REMOVE = 1;
    static readonly REDACT_IMAGE_PIXELS = 2;
    applyRedactions(black_boxes?: number, image_method?: number): void;
    update(): boolean;
}
export declare class PDFObject extends Userdata {
    static readonly _drop: any;
    static readonly Null: PDFObject;
    _doc: PDFDocument;
    constructor(doc: PDFDocument, pointer: number);
    isNull(): boolean;
    isIndirect(): boolean;
    isBoolean(): boolean;
    isInteger(): boolean;
    isNumber(): boolean;
    isName(): boolean;
    isString(): boolean;
    isArray(): boolean;
    isDictionary(): boolean;
    isStream(): boolean;
    asIndirect(): number;
    asBoolean(): boolean;
    asNumber(): number;
    asName(): string;
    asString(): string;
    readStream(): Buffer;
    readRawStream(): Buffer;
    resolve(): PDFObject;
    get length(): number;
    _get(path: any): number;
    get(...path: any[]): PDFObject;
    getIndirect(...path: any[]): number;
    getBoolean(...path: any[]): boolean;
    getNumber(...path: any[]): number;
    getName(...path: any[]): string;
    getString(...path: any[]): string;
    getInheritable(key: any): PDFObject;
    put(key: any, value: any): any;
    push(value: any): any;
    delete(key: any): void;
    valueOf(): string | number | boolean | this;
    toString(tight?: boolean, ascii?: boolean): string;
    forEach(fn: (val: PDFObject, key: number | string, self: PDFObject) => void): void;
    asJS(seen?: {
        [key: number]: PDFObject;
    }): any;
}
export declare class PDFGraftMap extends Userdata {
    static readonly _drop: any;
    _doc: PDFDocument;
    constructor(doc: PDFDocument, pointer: number);
    graftObject(obj: PDFObject): PDFObject;
    graftPage(to: number, srcDoc: PDFDocument, srcPage: number): void;
}
type PDFAnnotationType = "Text" | "Link" | "FreeText" | "Line" | "Square" | "Circle" | "Polygon" | "PolyLine" | "Highlight" | "Underline" | "Squiggly" | "StrikeOut" | "Redact" | "Stamp" | "Caret" | "Ink" | "Popup" | "FileAttachment" | "Sound" | "Movie" | "RichMedia" | "Widget" | "Screen" | "PrinterMark" | "TrapNet" | "Watermark" | "3D" | "Projection";
type PDFAnnotationLineEndingStyle = "None" | "Square" | "Circle" | "Diamond" | "OpenArrow" | "ClosedArrow" | "Butt" | "ROpenArrow" | "RClosedArrow" | "Slash";
type PDFAnnotationBorderStyle = "Solid" | "Dashed" | "Beveled" | "Inset" | "Underline";
type PDFAnnotationBorderEffect = "None" | "Cloudy";
export declare class PDFAnnotation extends Userdata {
    static readonly _drop: any;
    _doc: PDFDocument;
    static readonly ANNOT_TYPES: PDFAnnotationType[];
    static readonly LINE_ENDING: PDFAnnotationLineEndingStyle[];
    static readonly BORDER_STYLE: PDFAnnotationBorderStyle[];
    static readonly BORDER_EFFECT: PDFAnnotationBorderEffect[];
    static readonly IS_INVISIBLE: number;
    static readonly IS_HIDDEN: number;
    static readonly IS_PRINT: number;
    static readonly IS_NO_ZOOM: number;
    static readonly IS_NO_ROTATE: number;
    static readonly IS_NO_VIEW: number;
    static readonly IS_READ_ONLY: number;
    static readonly IS_LOCKED: number;
    static readonly IS_TOGGLE_NO_VIEW: number;
    static readonly IS_LOCKED_CONTENTS: number;
    constructor(doc: PDFDocument, pointer: number);
    getObject(): PDFObject;
    getBounds(): Rect;
    run(device: Device, matrix: Matrix): void;
    toPixmap(matrix: Matrix, colorspace: ColorSpace, alpha?: boolean): Pixmap;
    toDisplayList(): DisplayList;
    update(): boolean;
    getType(): PDFAnnotationType;
    getLanguage(): string;
    setLanguage(lang: string): void;
    getFlags(): any;
    setFlags(flags: number): any;
    getContents(): string;
    setContents(text: string): void;
    getAuthor(): string;
    setAuthor(text: string): void;
    getCreationDate(): Date;
    setCreationDate(date: Date): void;
    getModificationDate(): Date;
    setModificationDate(date: Date): void;
    hasRect(): boolean;
    hasInkList(): boolean;
    hasQuadPoints(): boolean;
    hasVertices(): boolean;
    hasLine(): boolean;
    hasInteriorColor(): boolean;
    hasLineEndingStyles(): boolean;
    hasBorder(): boolean;
    hasBorderEffect(): boolean;
    hasIcon(): boolean;
    hasOpen(): boolean;
    hasAuthor(): boolean;
    hasFilespec(): boolean;
    getRect(): Rect;
    setRect(rect: Rect): void;
    getPopup(): Rect;
    setPopup(rect: Rect): void;
    getIsOpen(): boolean;
    setIsOpen(isOpen: boolean): void;
    getHiddenForEditing(): boolean;
    setHiddenForEditing(isHidden: boolean): void;
    getIcon(): string;
    setIcon(text: string): void;
    getOpacity(): any;
    setOpacity(opacity: number): void;
    getQuadding(): any;
    setQuadding(quadding: number): void;
    getLine(): [Point, Point];
    setLine(a: Point, b: Point): void;
    getLineEndingStyles(): {
        start: PDFAnnotationLineEndingStyle;
        end: PDFAnnotationLineEndingStyle;
    };
    setLineEndingStyles(start: PDFAnnotationLineEndingStyle, end: PDFAnnotationLineEndingStyle): any;
    getColor(): Color;
    getInteriorColor(): Color;
    setColor(color: Color): void;
    setInteriorColor(color: Color): void;
    getBorderWidth(): number;
    setBorderWidth(value: number): any;
    getBorderStyle(): PDFAnnotationBorderStyle;
    setBorderStyle(value: PDFAnnotationBorderStyle): any;
    getBorderEffect(): PDFAnnotationBorderEffect;
    setBorderEffect(value: PDFAnnotationBorderEffect): any;
    getBorderEffectIntensity(): number;
    setBorderEffectIntensity(value: number): any;
    getBorderDashCount(): number;
    getBorderDashItem(idx: number): number;
    clearBorderDash(): any;
    addBorderDashItem(v: number): any;
    getBorderDashPattern(): number[];
    setBorderDashPattern(list: number[]): void;
    setDefaultAppearance(fontName: string, size: number, color: Color): void;
    getDefaultAppearance(): {
        font: string;
        size: number;
        color: Color;
    };
    getFileSpec(): PDFObject;
    setFileSpec(fs: any): any;
    getQuadPoints(): Quad[];
    clearQuadPoints(): void;
    addQuadPoint(quad: Quad): void;
    setQuadPoints(quadlist: Quad[]): void;
    getVertices(): Point[];
    clearVertices(): void;
    addVertex(vertex: Point): void;
    setVertices(vertexlist: Point[]): void;
    getInkList(): Point[][];
    clearInkList(): void;
    addInkListStroke(): void;
    addInkListStrokeVertex(v: Point): void;
    setInkList(inklist: Point[][]): void;
    setAppearanceFromDisplayList(appearance: string | null, state: string | null, transform: Matrix, list: DisplayList): void;
    setAppearance(appearance: string | null, state: string | null, transform: Matrix, bbox: Rect, resources: any, contents: AnyBuffer): void;
    applyRedaction(black_boxes?: number, image_method?: number): void;
}
export declare class PDFWidget extends PDFAnnotation {
    static readonly WIDGET_TYPES: string[];
    static readonly FIELD_IS_READ_ONLY = 1;
    static readonly FIELD_IS_REQUIRED: number;
    static readonly FIELD_IS_NO_EXPORT: number;
    static readonly TX_FIELD_IS_MULTILINE: number;
    static readonly TX_FIELD_IS_PASSWORD: number;
    static readonly TX_FIELD_IS_COMB: number;
    static readonly BTN_FIELD_IS_NO_TOGGLE_TO_OFF: number;
    static readonly BTN_FIELD_IS_RADIO: number;
    static readonly BTN_FIELD_IS_PUSHBUTTON: number;
    static readonly CH_FIELD_IS_COMBO: number;
    static readonly CH_FIELD_IS_EDIT: number;
    static readonly CH_FIELD_IS_SORT: number;
    static readonly CH_FIELD_IS_MULTI_SELECT: number;
    getFieldType(): string;
    isButton(): boolean;
    isPushButton(): boolean;
    isCheckbox(): boolean;
    isRadioButton(): boolean;
    isText(): boolean;
    isChoice(): boolean;
    isListBox(): boolean;
    isComboBox(): boolean;
    getFieldFlags(): number;
    isMultiline(): boolean;
    isPassword(): boolean;
    isComb(): boolean;
    isReadOnly(): boolean;
    getLabel(): string;
    getName(): string;
    getValue(): string;
    setTextValue(value: string): void;
    getMaxLen(): number;
    setChoiceValue(value: string): void;
    getOptions(isExport?: boolean): string[];
    toggle(): void;
}
export declare class Stream extends Userdata {
    static readonly _drop: any;
    constructor(url: string, contentLength: number, block_size: number, prefetch: number);
}
export {};
