import { jstsToGeoJson, geoJsonToJsts } from '../src/res/GeoJsonFunctions.mjs';
import assert from 'assert'
import _ from 'lodash'

const gj = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": null,
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              15.851554870605469,
              61.56980478209987
            ],
            [
              15.802116394042967,
              61.55353706908234
            ],
            [
              15.873355865478516,
              61.54167833832986
            ],
            [
              15.89567184448242,
              61.55615355821311
            ],
            [
              15.881080627441406,
              61.56988650786631
            ],
            [
              15.851554870605469,
              61.56980478209987
            ]
          ]
        ]
      }
    }
  ],
  "crs": {
  "type":"name",
  "properties":{
      "name":"EPSG:3006"
      }
  }   
}


/* 
  Find mergable polygons

*/
console.log(JSON.stringify(gj)); //funkar
console.log()
console.log(JSON.stringify(jstsToGeoJson(geoJsonToJsts(gj))))


describe('GeoJson Conversion', function () {
  it('GeoJson should become a jstsobject', function () {
     // _.isEqual(jstsToGeoJson(geoJsonToJsts(gj)), gj).should.equal(true)
      assert.equal(_.isEqual(jstsToGeoJson(geoJsonToJsts(gj)), gj),true)
  } )
})

/*
describe('Merge two polygons', function() {
  it('', function () {

  })
}) */

