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

  function calculateLinesOfPolygon(polygon) { 
    // follow the points around the edge of the polygon and calculate line between each pair of points
    const startPoint = polygon.geometry.coordinates[0][0]
    const endPoint = polygon.geometry.coordinates[0][1]

    console.log("startPoint: " + startPoint)
    console.log("endPoint: " + endPoint)


    return "calculateLinesOfPolygon not implemented"
  }

  function polygonsAreConnected(polygon1, polygon2) {
    // if they have a common side.
    // => if two points from one polygon1, and two points from polygon2 make 
    //    up two lines that overlap at some interval.

    // So, 
    // 1. calculate the lines of each polygon.
     const polygon1Lines = calculateLinesOfPolygon(polygon1)
     const polygon2Lines = calculateLinesOfPolygon(polygon2)
    // 2. find a matching pair.

    return "polygonsAreConnected is not implemented"

  }

  polygon1 = geoJsonCorrect.features[0]
  polygon2 = geoJsonCorrect.features[1]

console.log("You have solved the problem: " + (polygonsAreConnected(polygon1, polygon2) == true))
  