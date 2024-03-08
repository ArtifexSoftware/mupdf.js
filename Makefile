default: build

build:
	bash build.sh

clean:
	rm -rf dist
	rm -rf libmupdf/build/wasm
