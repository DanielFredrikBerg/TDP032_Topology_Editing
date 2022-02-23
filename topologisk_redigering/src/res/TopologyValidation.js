

geoJsonCorrect = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates":[ 
          [
            [
              18.050537109375,
              59.33318942659219
            ],
            [
              11.97509765625,
              57.710016656706465
            ],
            [
              13.0078125,
              55.55970923563195
            ],
            [
              18.050537109375,
              59.33318942659219
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              18.050537109375,
              59.33318942659219
            ],
            [
              10.755615234375,
              59.89995826181929
            ],
            [
              11.97509765625,
              57.710016656706465
            ],
            [
              18.050537109375,
              59.33318942659219
            ]
          ]
        ]
      }
    }
  ]
}

class Line {
  constructor(startX, endX, startY, angle) {
    // to keep thing simple for now, we will assume start X is always lower than endX
    if (startX < endX) {
      this.startX = startX;
      this.endX = endX;
      this.startY = startY;
      this.angle = angle;
    } else {
      console.log("when constructing a new Line, startX should be lower than endX")
    }
  }

  yValueAt(xValue) {
    return this.startY + this.angle * (xValue - this.startX)
  }

}

  // verify that two polygons in a "FeatureCollection" (i.e. Topology) are connected

  // To do this you want to find a line that is common to both polygons.

  //https://codeforces.com/blog/entry/48868



  // Polygon is a plane figure that is bounded by a finite chain of straight line segments closing in a 
  // loop to form a closed chain or circuit. These segments are called its edges or sides, and the points 
  // where two edges meet are the polygon's vertices or corners (wiki).

  //Polygon is convex if a line segment connecting any two points on its boundary lies inside the polygon. 
  // Equivalently, all its interior angles are less than or equal to 180 degrees.

  //Polygon is strictly convex if in addition no three vertices lie on the same line. Equivalently, all its 
  // interior angles are less than 180 degrees.

  //Polygon is simple if its boundary doesn't cross itself.

  //==> We will generally want to make sure we are working with arbitrary simple polygons.

  function leftCoordinate(coordinate1, coordinate2) {
    if (coordinate1[0] < coordinate2[0]) {
      return coordinate1
    }
    return coordinate2
  }

  function rightCoordinate(coordinate1, coordinate2) {
    if (coordinate1[0] > coordinate2[0]) {
      return coordinate1
    }
    return coordinate2
  }

  function angleBetweenTwoCoordinates(coordinate1, coordinate2) {
    // the position of the coordinates is arbitrary, but we want to make sure the line we create
    // "starts" from the left so we can compare lines more easily.

    const startCoordinate = leftCoordinate(coordinate1, coordinate2)
    const endCoordinate = rightCoordinate(coordinate1, coordinate2)

    console.log("start: " + startCoordinate + ", end: " + endCoordinate)
    
    const [startX, startY] = startCoordinate
    const [endX, endY] = endCoordinate
    
    const differenceInXAxis = endX - startX
    const differenceInYAxis = endY - startY


    const angle = (differenceInYAxis / differenceInXAxis)

    return angle

  }

  function calculateLinesOfPolygon(polygon) { 
    var lines = [];

    // follow the points around the edge of the polygon and calculate line between each pair of points
    console.log("# of coordinates in geometry: " + polygon.geometry.coordinates[0].length)
    console.log(polygon.geometry.coordinates[0])
    for (let i = 0; i < polygon.geometry.coordinates[0].length - 1; i++) {
      const coordinate1 = polygon.geometry.coordinates[0][i]
      const coordinate2 = polygon.geometry.coordinates[0][i+1]

      const startPoint = leftCoordinate(coordinate1, coordinate2)
      const endPoint = rightCoordinate(coordinate1, coordinate2)

      // calculate angle of line:
      const angle = angleBetweenTwoCoordinates(startPoint, endPoint)
      console.log("The angle between the coordinates is: " + angle + "\n")

      // pick out the X coordinate from each coordinate to determine which is leftmost.
      const [startX, startY] = startPoint
      const endX = endPoint[0]


      lines.push(new Line(startX, endX, startY, angle))
    }

    return lines
  }

  function haveMatchingCoordinate(line1, line2) {
    // is there overlap in x-coordinates?

    if (line1.startX <= line2.startX && line1.endX >= line2.startX) {
      return line2.startY == line1.yValueAt(line2.startX)
    } else if (line2.startX <= line1.startX && line2.endX >= line1.startX) {
      return line1.startY == line1.yValueAt(line1.startX)
    }

  }

  function haveMatchingLines(lines1, lines2) {
    var matchFound = false
    // sort each line by their angle
    const sortedLines1 = (new Array(...lines1)).sort(function(a, b) {
      return a.angle - b.angle
    })
    
    const sortedLines2 = (new Array(...lines2)).sort(function(a, b) {
      return a.angle - b.angle
    })

    // if two lines with the same angle are found
    // => check to see if they have overlap in their x-values.
    // if they do, and they share a common y-value, there is a matching pair in the arrays.
    // if they do not, continue searching.
    // if there are no lines left, there are no matching lines.
    var i = 0
    var j = 0

    while (!matchFound && i < sortedLines1.length && j < sortedLines2.length) {
      if (sortedLines1[i].angle < sortedLines2[j] ) {
        i++
      } else if (sortedLines1[i].angle > sortedLines2[j].angle){
        j++  
      } else {
        // => check if they have a shared point
        if (haveMatchingCoordinate(sortedLines1[i], sortedLines2[j])) {
          matchFound = true          
        }
        // if they do not, continue searching.
        if (i < sortedLines1.length) {
          i++
        } else {
          j++
        }
      }
    }
    return matchFound
  }

  function polygonsAreConnected(polygon1, polygon2) {
    // if they have a common side.
    // => if two points from one polygon1, and two points from polygon2 make 
    //    up two lines that overlap at some interval.

    // So, 
    // 1. calculate the lines of each polygon.
     const polygon1Lines = calculateLinesOfPolygon(polygon1)
     const polygon2Lines = calculateLinesOfPolygon(polygon2)
     console.log("# of lines in polygon1: " + polygon1Lines.length)
     console.log("# of lines in polygon2: " + polygon2Lines.length)
    // 2. find a matching pair.

    return haveMatchingLines(polygon1Lines, polygon2Lines)

  }

  polygon1 = geoJsonCorrect.features[0]
  polygon2 = geoJsonCorrect.features[1]


console.log("You have solved the problem: " + (polygonsAreConnected(polygon1, polygon2) == true))
 
// TODO: does not work for vertical borders.
// TODO: will rounding errors be an issue?