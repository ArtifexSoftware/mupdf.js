#!/bin/bash

MUPDF_DIR=libmupdf
EMSDK_DIR=/opt/emsdk

MUPDF_OPTS="-Os -DTOFU -DTOFU_CJK_EXT -DFZ_ENABLE_XPS=0 -DFZ_ENABLE_SVG=0 -DFZ_ENABLE_CBZ=0 -DFZ_ENABLE_IMG=0 -DFZ_ENABLE_HTML=0 -DFZ_ENABLE_EPUB=0 -DFZ_ENABLE_JS=0 -DFZ_ENABLE_OCR_OUTPUT=0 -DFZ_ENABLE_DOCX_OUTPUT=0 -DFZ_ENABLE_ODT_OUTPUT=0"

export EMSDK_QUIET=1
source $EMSDK_DIR/emsdk_env.sh
echo

echo BUILDING MUPDF CORE
make -j4 -C $MUPDF_DIR build=release OS=wasm XCFLAGS="$MUPDF_OPTS" libs
echo

echo BUILDING MUPDF WASM
mkdir -p dist
emcc -o dist/mupdf-wasm.js -I $MUPDF_DIR/include src/mupdf.c \
	--no-entry \
	-sABORTING_MALLOC=0 \
	-sALLOW_MEMORY_GROWTH=1 \
	-sNODEJS_CATCH_EXIT=0 \
	-sMODULARIZE=1 \
	-sEXPORT_ES6=1 \
	-sEXPORT_NAME='"libmupdf_wasm"' \
	-sEXPORTED_RUNTIME_METHODS='["ccall","UTF8ToString","lengthBytesUTF8","stringToUTF8"]' \
	 $MUPDF_DIR/build/wasm/release/libmupdf.a \
	 $MUPDF_DIR/build/wasm/release/libmupdf-third.a
echo

echo BUILDING TYPESCRIPT
cat src/mupdf.c | sed '/#include/d' | emcc -E - | node src/gen-wasm-type.js > src/mupdf-wasm.d.ts
npx tsc -p .
