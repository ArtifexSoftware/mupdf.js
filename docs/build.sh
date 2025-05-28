#!/bin/bash
# Set up a 'venv' and run sphinx to build the docs!

if [ ! -f docs/README.md ]
then
	echo "you must run this script from the top level directory"
	echo "usage: bash docs/build.sh [ live | force ]"
	exit 1
fi

python -m venv build/venv
source build/venv/bin/activate
pip install -r docs/requirements.txt

case "$1" in
	live)
		pip install sphinx-autobuild
		sphinx-autobuild -d build/doctrees -b html --open-browser --port 9001 docs build/html
		;;
	force)
		sphinx-build -d build/doctrees -b html -E -a docs build/html
		;;
	pdf)
		sphinx-build -d build/doctrees -b pdf docs build/pdf
		;;
	*)
		sphinx-build -d build/doctrees -b html docs build/html
		;;
esac
