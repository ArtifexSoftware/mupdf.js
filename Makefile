default: build

build:
	bash build.sh

clean:
	rm -f lib/mupdf.js lib/mupdf.d.ts
	rm -f lib/mupdf-wasm.wasm lib/mupdf-wasm.js
	rm -rf libmupdf/build/wasm
