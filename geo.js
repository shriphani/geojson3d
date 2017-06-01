var d3 = require('d3');
var d3Projections = require('d3-geo-projection');
var turf = require('turf');
var THREE = require('three');

var projections = {
   "Aitoff": d3Projections.geoAitoff(),
   "Albers":  d3.geoAlbers(),
   "August": d3Projections.geoAugust().scale(60),
   "Baker": d3Projections.geoBaker().scale(100),
   "Boggs": d3Projections.geoBoggs(),
   "Bonne": d3Projections.geoBonne().scale(120),
   "Bromley": d3Projections.geoBromley(),
   "Collignon": d3Projections.geoCollignon().scale(93),
   "Craster Parabolic": d3Projections.geoCraster(),
   "Eckert I": d3Projections.geoEckert1().scale(165),
   "Eckert II": d3Projections.geoEckert2().scale(165),
   "Eckert III": d3Projections.geoEckert3().scale(180),
   "Eckert IV": d3Projections.geoEckert4().scale(180),
   "Eckert V": d3Projections.geoEckert5().scale(170),
   "Eckert VI": d3Projections.geoEckert6().scale(170),
   "Eisenlohr": d3Projections.geoEisenlohr().scale(60),
   "Equirectangular": d3.geoEquirectangular(),
   "Hammer": d3Projections.geoHammer().scale(165),
   "Hill": d3Projections.geoHill(),
   "Goode Homolosine": d3Projections.geoHomolosine(),
   "Kavrayskiy VII": d3Projections.geoKavrayskiy7(),
   "Lambert cylindrical equal-area": d3Projections.geoCylindricalEqualArea(),
   "Lagrange": d3Projections.geoLagrange().scale(120),
   "Larrivée": d3Projections.geoLarrivee().scale(95),
   "Laskowski": d3Projections.geoLaskowski().scale(120),
   "Loximuthal": d3Projections.geoLoximuthal(),
   "Mercator": d3.geoMercator(),
   "Miller": d3Projections.geoMiller().scale(100),
   "McBryde–Thomas Flat-Polar Parabolic": d3Projections.geoMtFlatPolarParabolic(),
   "McBryde–Thomas Flat-Polar Quartic": d3Projections.geoMtFlatPolarQuartic(),
   "McBryde–Thomas Flat-Polar Sinusoidal": d3Projections.geoMtFlatPolarSinusoidal(),
   "Mollweide": d3Projections.geoMollweide().scale(165),
   "Natural Earth": d3Projections.geoNaturalEarth(),
   "Nell–Hammer": d3Projections.geoNellHammer(),
   "Polyconic": d3Projections.geoPolyconic().scale(100),
   "Robinson": d3Projections.geoRobinson(),
   "Sinusoidal": d3Projections.geoSinusoidal(),
   "Sinu-Mollweide": d3Projections.geoSinuMollweide(),
   "van der Grinten": d3Projections.geoVanDerGrinten().scale(75),
   "van der Grinten IV": d3Projections.geoVanDerGrinten4().scale(120),
   "Wagner IV": d3Projections.geoWagner4(),
   "Wagner VI": d3Projections.geoWagner6(),
   "Wagner VII": d3Projections.geoWagner7(),
   "Winkel Tripel": d3Projections.geoWinkel3(),
   "Identity": d3.geoProjection(function(x, y) { return [x, y];}) };

/** 
* return scaling factor that fit bounds within width/height
* @param {*} bounds
* @param {*} width
* @param {*} height 
*/

function fit(bounds, width, height)
{
  var topLeft = bounds[0];
  var bottomRight = bounds[1];

  var w = bottomRight[0] - topLeft[0];
  var h = bottomRight[1] - topLeft[1];

  var hscale = width / w;
  var vscale = height / h;

  // pick the smallest scaling factor
  var scale = (hscale < vscale) ? hscale : vscale;

  return scale;
}

/**
* D3.js projection from GeoJSON bounds
* @param {*} geojson
* @param {*} width
* @param {*} height
* @param {*} projection 
*/

function getProjection(geojson, width, height, projection) {
  // From:
  //   http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object?answertab=active#tab-top
  // We are using Turf to compute centroid (turf.centroid) and bounds (turf.envelope) because
  // D3's geo.centroid and path.bounds function expect clockwise polygons, which we cannot always guarantee:
  //   https://github.com/mbostock/d3/wiki/Geo-Paths#_path

  if (projection == undefined) {
    projection = "Identity";
  }

  var center = turf.centroid(geojson).geometry.coordinates;
  console.log(center);

  var the_projection = projections[projection]
        .center(center)
        .scale(1)
        .translate([0, 0]);

  // Create the path
  var path = d3.geoPath().projection(the_projection);

  // Using the path determine the bounds of the current map and use
  // these to determine better values for the scale and translation

  // var env = turf.envelope(geojson);
  var bounds = path.bounds(geojson);

  var scale = fit(bounds, width, height);

  // New projection
  the_projection = projections[projection]
    .center(center)
    .scale(scale)
    .translate([0,0]);

  return the_projection;
}

function centerProjection(geojson, width, height) {
  var center = turf.centroid(geojson).geometry.coordinates;
  console.log(center);
  var path   = d3.geoPath().projection(null);
  var bounds = path.bounds(geojson);
  console.log(bounds);
  var scale = fit(bounds, width, height);
  console.log(scale);

  return d3.geoProjection(function(x, y) { return [x, y];})
    //.center(center)
    .precision(0)
    .scale(1)
    .translate([0, 0]);
}

/**
 *  Use D3.js projection to create array of Three.js points/vectors from GeoJSON ring
 * @param {*} ring
 * @param {*} projection 
*/
function ringToPoints(ring, projection) {
  return ring.map(function(point) {
    //console.log('Point', point);
    var projected = projection(point);
    //console.log('Point projected', projected);
    //console.log(projection)
    return new THREE.Vector2(projected[0], projected[1]);
  });
}

/**
 *  Create Three.js polygon from GeoJSON Polygon
 * @param {*} polygon
 * @param {*} projection
*/

function createPolygonShape(polygon, projection) {
  var outerRing = polygon[0];
  var points = ringToPoints(outerRing, projection);
  //points = points.slice(0, 1000) + [points[0]]
  //console.log(points);
  var polygonShape = new THREE.Shape(points);

  polygon.slice(1).forEach(function(hole) {
    points = ringToPoints(hole, projection);
    var holeShape = new THREE.Shape(points);
    polygonShape.holes.push(holeShape);
  });

  return polygonShape;
}

var geo = {
    fit: fit,
    getProjection: getProjection,
    ringToPoints: ringToPoints,
    createPolygonShape: createPolygonShape,
    centerProjection: centerProjection,
    projections: projections
}
module.exports = geo