import test from 'tape'
import { coordinatesAreEquivalent } from './test.mjs'
import { getFeatureCoordinates } from '../../topologisk_redigering/src/res/getters.mjs'
import { mergeFeatures } from '../src/res/jsts.mjs'

test('Should return -1 when the value is not present in Array', function (t) {
    t.equal(-1, [1,2,3].indexOf(4))
    t.end()
  })

const mergePolygon1 = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              0,0
            ],
            [
              1,0
            ],
            [
              1,1
            ],
            [
              0,1
            ],
            [
              0,0
            ]
          ]
        ]
      }
    }

const mergePolygon2 =     {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          1,0
        ],
        [
          2,0
        ],
        [
          2,1
        ],
        [
          1,1
        ],
        [
          1,0
        ]
      ]
    ]
  }
}

//This is one Feature.
const expectedMergeResult = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          0,0
        ],
        [
          2,0
        ],
        [
          2,1
        ],
        [
          0,1
        ],
        [
          0,0
        ]
      ]
    ]
  }
}

test('Should return one geoJSON formatted Feature.', function (t) {
  const result = mergeFeatures(mergePolygon1, mergePolygon2, )
  t.assert(coordinatesAreEquivalent(getFeatureCoordinates(result), getFeatureCoordinates(expectedMergeResult)))
  t.end
})