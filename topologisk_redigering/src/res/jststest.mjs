import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter.js"
import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js"
import OverlayOp from 'jsts/org/locationtech/jts/operation/overlay/OverlayOp.js'

const reader = new GeoJSONReader()
const writer = new GeoJSONWriter()

const geojsonobj = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              7.3828125,
              53.74871079689897
            ],
            [
              2.109375,
              28.613459424004414
            ],
            [
              39.0234375,
              38.54816542304656
            ],
            [
              7.3828125,
              53.74871079689897
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
              28.30078125,
              52.696361078274485
            ],
            [
              19.16015625,
              38.272688535980976
            ],
            [
              46.05468749999999,
              20.96143961409684
            ],
            [
              52.03125,
              43.83452678223682
            ],
            [
              48.515625,
              57.89149735271034
            ],
            [
              28.30078125,
              52.696361078274485
            ]
          ]
        ]
      }
    }
  ]
}

  const poly1 = reader.read(geojsonobj.features[0].geometry)
  const poly2 = reader.read(geojsonobj.features[1].geometry)

  //console.log(writer.write(poly1))
  //console.log(writer.write(poly2))

  console.log(OverlayOp.union(poly1, poly2))
  