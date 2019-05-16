
# Amnesiac [![Build Status](https://travis-ci.org/star-ocean-anamnesiac/anamnesiac.svg?branch=master)](https://travis-ci.org/star-ocean-anamnesiac/anamnesiac)

A Star Ocean: Anamnesis companion app.

# Requirements

* nodejs
* npm
* git
* imagemagick (for texture generation)

# How to run?

* `npm i`
* `npm run consolidate`
* `npm start`

## Changing The Data

If you modify any of the data in the YML files, you need to run `npm run consolidate` to re-generate all of the data. It's also possible that you need to do this after you run `npm i` if the `postinstall` step does not trigger correctly.

# How to deploy?

This repository has Netlify set up, and any push to master will update the server automatically.
