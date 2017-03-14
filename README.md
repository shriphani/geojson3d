# Geojson3D

Library for rendering standard Geojsons and Topojsons with three.js

The focus is cartography-based infoviz.

Actively developed atm so feature-set is constantly changing.

## Development.

We are using gulp and browserify.

On cloning this project for the first time, do

    * `npm install --save`
    * `npm install --global gulp-cli`

To begin development, do:

    * `gulp dev`

This starts a webserver at [http://localhost:8000](http://localhost:8000).
The module is exposed as `geojson3d` - access it in your browser console.