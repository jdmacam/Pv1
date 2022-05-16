#!/bin/bash

# delete old files from dist
rm -rf dist/*

# copy current files to dist
cp -r fonts/ dist/
cp -r images/ dist/
cp -r models/ dist/
cp index.html style.css main.js resume.pdf dist/

# deplot to github pages
npm run deploy