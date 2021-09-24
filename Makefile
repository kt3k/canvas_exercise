.PHONY: dev
dev:
	packup index.html

build:
	rm -rf docs
	packup build --dist-dir docs index.html
