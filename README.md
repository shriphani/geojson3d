# Geojson3D

Library for rendering standard Geojsons and Topojsons with three.js

The focus is cartography-based infoviz.

Actively developed atm so feature-set is constantly changing.

## Development.

OS X setup
   * https://brew.sh/ - Install this
   * https://docs.npmjs.com/getting-started/installing-node

We are using gulp and browserify.

On cloning this project for the first time, do

    * `npm install --save`
    * `npm install --global gulp-cli`

To begin development, do:

    * `gulp dev`

This starts a webserver at [http://localhost:8000](http://localhost:8000).
The module is exposed as `geojson3d` - access it in your browser console.
Example function call:
```
geojson3d.initScene(document.getElementById('webgl'), 'https://raw.githubusercontent.com/scribu/romania-3d/gh-pages/data/romania-topo.json');
```

This should render romania.
