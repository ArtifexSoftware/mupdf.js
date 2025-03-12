default: build

memento:
	bash build.sh memento

build:
	bash build.sh release

clean:
	rm -rf dist
	rm -rf libmupdf/build/wasm
