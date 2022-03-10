
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'

const geoJSONReader = new GeoJSONReader()
const geoJSONWriter = new GeoJSONWriter()


const geoJsonCorrect = {
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

const polygon1 = geoJSONReader.read(geoJsonCorrect.features[0].geometry)
const polygon2 = geoJSONReader.read(geoJsonCorrect.features[1].geometry)
console.log(geoJSONWriter.write(polygon1))


console.log(geoJSONWriter.write(polygon2))



