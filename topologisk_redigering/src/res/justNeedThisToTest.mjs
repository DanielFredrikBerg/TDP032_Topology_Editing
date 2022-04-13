import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'

const geoJSON = {
    "type": "FeatureCollection",
    "features": [{
      "type":"Feature",
      "properties": null,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
             [0, 0],
             [2, 0],
             [2, 1],
             [0, 1],
             [0, 0]
          ]
        ]
      }
    },{
      "type":"Feature",
      "properties": null,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
             [1, 0],
             [3, 0],
             [3, 1],
             [1, 1],
             [1, 0]
          ]
        ]
      }
    }]
  }