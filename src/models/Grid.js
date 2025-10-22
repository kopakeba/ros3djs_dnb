/**
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * Create a grid object.
 *
 * @constructor
 * @param options - object with following keys:
 *
 *  * num_cells (optional) - The number of cells of the grid
 *  * color (optional) - the line color of the grid, like '#cccccc'
 *  * lineWidth (optional) - the width of the lines in the grid
 *  * cellSize (optional) - The length, in meters, of the side of each cell
 */
ROS3D.Grid = function(options) {
  options = options || {};
  var num_cells = options.num_cells || 10;
  var color = options.color || '#cccccc';
  var lineWidth = options.lineWidth || 1;
  var cellSize = options.cellSize || 1;

  // Create a temporary Object3D to copy properties from
  var tempObj = new THREE.Object3D();
  Object.keys(tempObj).forEach(function(key) {
    this[key] = tempObj[key];
  }.bind(this));

  var material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: lineWidth
  });

  for (var i = 0; i <= num_cells; ++i) {
    var edge = cellSize * num_cells / 2;
    var position = edge - (i * cellSize);
    
    // Horizontal line using BufferGeometry
    var pointsH = [
      new THREE.Vector3(-edge, position, 0),
      new THREE.Vector3(edge, position, 0)
    ];
    var geometryH = new THREE.BufferGeometry().setFromPoints(pointsH);
    
    // Vertical line using BufferGeometry
    var pointsV = [
      new THREE.Vector3(position, -edge, 0),
      new THREE.Vector3(position, edge, 0)
    ];
    var geometryV = new THREE.BufferGeometry().setFromPoints(pointsV);
    
    this.add(new THREE.Line(geometryH, material));
    this.add(new THREE.Line(geometryV, material));
  }
};

// Set up inheritance from THREE.Object3D
ROS3D.Grid.prototype = Object.create(THREE.Object3D.prototype);
ROS3D.Grid.prototype.constructor = ROS3D.Grid;
