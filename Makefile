.PHONY: dev
dev:
	packup index.html

build:
	packup build --dist-dir docs index.html
