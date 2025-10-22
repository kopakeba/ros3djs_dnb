/**
 * @author David Gossow - dgossow@willowgarage.com
 */

/**
 * A TriangleList is a THREE object that can be used to display a list of triangles as a geometry.
 *
 * @constructor
 * @param options - object with following keys:
 *
 *   * material (optional) - the material to use for the object
 *   * vertices - the array of vertices to use
 *   * colors - the associated array of colors to use
 */
ROS3D.TriangleList = function(options) {
  options = options || {};
  var material = options.material || new THREE.MeshBasicMaterial();
  var vertices = options.vertices;
  var colors = options.colors;

  // Create a temporary Object3D to copy properties from
  var tempObj = new THREE.Object3D();
  Object.keys(tempObj).forEach(function(key) {
    this[key] = tempObj[key];
  }.bind(this));

  // set the material to be double sided
  material.side = THREE.DoubleSide;

  // construct the geometry using BufferGeometry
  var geometry = new THREE.BufferGeometry();
  
  // Create positions array
  var positions = new Float32Array(vertices.length * 3);
  for (var i = 0; i < vertices.length; i++) {
    positions[i * 3] = vertices[i].x;
    positions[i * 3 + 1] = vertices[i].y;
    positions[i * 3 + 2] = vertices[i].z;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // set the colors
  if (colors.length === vertices.length) {
    // use per-vertex color
    var colorArray = new Float32Array(vertices.length * 3);
    for (var i = 0; i < vertices.length; i++) {
      colorArray[i * 3] = colors[i].r;
      colorArray[i * 3 + 1] = colors[i].g;
      colorArray[i * 3 + 2] = colors[i].b;
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    material.vertexColors = true;
  } else if (colors.length === vertices.length / 3) {
    // use per-triangle color - expand to per-vertex
    var triangleColors = new Float32Array(vertices.length * 3);
    for (var i = 0; i < vertices.length; i += 3) {
      var colorIndex = Math.floor(i / 3);
      for (var j = 0; j < 3; j++) {
        triangleColors[(i + j) * 3] = colors[colorIndex].r;
        triangleColors[(i + j) * 3 + 1] = colors[colorIndex].g;
        triangleColors[(i + j) * 3 + 2] = colors[colorIndex].b;
      }
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(triangleColors, 3));
    material.vertexColors = true;
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();

  this.add(new THREE.Mesh(geometry, material));
};
// Set up inheritance from THREE.Object3D
ROS3D.TriangleList.prototype = Object.create(THREE.Object3D.prototype);
ROS3D.TriangleList.prototype.constructor = ROS3D.TriangleList;

/**
 * Set the color of this object to the given hex value.
 *
 * @param hex - the hex value of the color to set
 */
ROS3D.TriangleList.prototype.setColor = function(hex) {
  this.mesh.material.color.setHex(hex);
};
