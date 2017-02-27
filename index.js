var THREE = require('three');
var d3 = require('d3');
var topojson = require('topojson');
var geo = require('./geo');
THREE.TrackballControls = require('three-trackballcontrols');

var materials = {
        phong: function(color) {
          return new THREE.MeshPhongMaterial({
            color: color, side: THREE.DoubleSide
            //	phong : new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x000000, shininess: 60, shading: THREE.SmoothShading, transparent:true  }),
          });
        },
        meshLambert: function(color) {
          return new THREE.MeshLambertMaterial({
            color: color,
            specular: 0x009900,
            shininess: 30,
            shading: THREE.SmoothShading,
            transparent:true
          });
        },
        meshWireFrame: function(color) {
          return new THREE.MeshBasicMaterial({
             color: color,
            specular: 0x009900,
            shininess: 30,
            shading: THREE.SmoothShading,
            wireframe:true,
            transparent:true
          });
        },
        meshBasic: function(color) {
          return new THREE.MeshBasicMaterial({
            color: color,
            specular: 0x009900,
            shininess: 30,
            shading: THREE.SmoothShading,
            transparent: true
          });
        }
      };

// var extrudeSettings = {
//           amount: amount,
//           bevelEnabled: false
//         };
var material = 'phong';

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    controls.handleResize();
    render();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}

function clearGroups(json) {
    if (json) {
        if (json.type === 'FeatureCollection') {
        json.features.forEach(function(feature) {
            scene.remove(feature._group);
        });
        } else if (json.type === 'Topology') {
        Object.keys(json.objects).forEach(function(key) {
            json.objects[key].geometries.forEach(function(object) {
            scene.remove(object._group);
            });
        });
        }
    }
    render();
}

function addShape(group, shape, extrudeSettings, material, color, x, y, z, rx, ry, rz, s) {

        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        var mesh = new THREE.Mesh(geometry, materials[material](color));

        // Add shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);
        group.add(mesh);
      }

function addFeature(feature, projection, functions) {
    var group = new THREE.Group();
    scene.add(group);

    var color;
    var amount;

    try {
        color = functions.color(feature.properties);
    } catch(err) {
        console.log(err);
    }

    try {
        amount = functions.height(feature.properties);
    } catch(err) {
        console.log(err);
    }

    var extrudeSettings = {
        amount: amount,
        bevelEnabled: false
    };

    var material = 'phong';

    if (feature.geometry.type === 'Polygon') {
        var shape = geo.createPolygonShape(feature.geometry.coordinates, projection);
        addShape(group, shape, extrudeSettings, material, color, 0, 0, amount, Math.PI, 0, 0, 1);
    } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(function(polygon) {
        var shape = geo.createPolygonShape(polygon, projection);
        addShape(group, shape, extrudeSettings, material, color, 0, 0, amount, Math.PI, 0, 0, 1);
        });
    } else {
        console.log('This tutorial only renders Polygons and MultiPolygons')
    }

    return group;
}

function draw(json_url) {
    //clearGroups(); TODO - fix this

    var width = container.clientWidth;
    var height = container.clientHeight;

    d3.json(json_url, function(data) {

        json = data;

        console.log(json);

        var functions = {
            color: function(d) {
                return Math.random() * 16777216
            },

            height: function(d) {
                return Math.random() * 16777216
            }
        };

        if (json.type === 'FeatureCollection') {

        var projection = geo.getProjection(json, width, height);

        json.features.forEach(function(feature) {
            var group = addFeature(feature, projection, functions);
            feature._group = group;
        });

        } else if (json.type === 'Topology') {

        var geojson = topojson.merge(json, json.objects[Object.keys(json.objects)[0]].geometries);
        var projection = geo.getProjection(geojson, width, height);

        Object.keys(json.objects).forEach(function(key) {
            json.objects[key].geometries.forEach(function(object) {
            var feature = topojson.feature(json, object);
            var group = addFeature(feature, projection, functions);
            object._group = group;
            });
        });

        } else {
            console.log('This tutorial only renders TopoJSON and GeoJSON FeatureCollections')
        }

        render();
    });
}


var initScene = function (container, json_location) {

    camera = new THREE.PerspectiveCamera( 70, container.clientWidth / container.clientHeight, 0.1, 10000);
    camera.position.z = Math.min(container.clientWidth, container.clientHeight);
    controls = new THREE.TrackballControls(camera, container);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);

    // World
    scene = new THREE.Scene();

    // Lights
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-1000, -1000, 1000);
    spotLight.castShadow = true;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Shadows
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowCameraNear = 1;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 60;
    renderer.shadowMapBias = 0.0025;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;

    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
    renderer.render(scene, camera);

    draw(json_location);
}

exports.initScene = initScene;