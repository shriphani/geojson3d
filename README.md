# Geojson3D

Library for rendering standard Geojsons and Topojsons with three.js

The focus is cartography-based infoviz.

Actively developed atm so feature-set is constantly changing.

## Development.

OS X setup
   * https://brew.sh/ - Install this
   * https://docs.npmjs.com/getting-started/installing-node

We are using webpack.

On cloning this project for the first time, do

    * `npm install --save`
    * `sudo npm install -g webpack`
    * `sudo npm install -g webpack-dev-server`

To begin development, do:

    * `webpack-dev-server`    

This starts a webserver at [http://localhost:8000](http://localhost:8000).
Visit [http://localhost:8000/choropleths.html](http://localhost:8000) for some example plots.

## Acknowledgements

This project wouldn't have been possible without:
* [https://github.com/maptime-ams/geojson-3d](https://github.com/maptime-ams/geojson-3d) - brilliant tutorial - our codebase borrows heavily from this.
* [https://github.com/mapbox/earcut](https://github.com/mapbox/earcut) - amazing triangulation library that saved us a lot of headaches.
* [https://github.com/mrdoob/three.js](https://github.com/mrdoob/three.js) - brilliant library for doing all things 3D in the browser.
