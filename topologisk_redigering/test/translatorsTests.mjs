import { olFeatures2GeoJsonFeatureCollection, geoJsonFeatureCollection2olFeatures,geoJsonFeature2JstsGeometry,
        jstsGeometry2GeoJsonFeature, jstsGeometries2GeoJsonFeatureCollection, geoJsonFeatureCollection2JstsGeometries,
        geoJsonFeatureCollection2FullGeoJSON } from "../src/Translations/Translators.mjs";
import test from 'tape'
import GeoJSON from "ol/format/GeoJSON.js";
  
const featureCollection = {
"type": "FeatureCollection",
"features": [{
    "type":"Feature",
    "geometry": {
    "type": "Polygon",
    "coordinates": [
        [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0]
        ]
    ]
    },
    "properties": null

},{
    "type":"Feature",
    "geometry": {
    "type": "Polygon",
    "coordinates": [
        [
            [1, 0],
            [1, 1],
            [2, 1],
            [2, 0],
            [1, 0]
        ]
    ]
    },
    "properties": null
},{
    "type":"Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
        [
            [0, 1],
            [0, 2],
            [2, 2],
            [2, 1],
            [0, 1]
        ]
        ]
    },
    "properties": null
    }]
}

const feature = {
"type":"Feature",
"properties": null,
"geometry": {
    "type": "Polygon",
    "coordinates": [
    [
        [0, 1],
        [0, 2],
        [2, 2],
        [2, 1],
        [0, 1]
    ]
    ]
}
}

const olFeatureList = new GeoJSON().readFeatures(featureCollection)


test('Convert a list of OL features to a FeatureCollection', function(t) {
    t.deepEqual(olFeatures2GeoJsonFeatureCollection(olFeatureList), featureCollection)
    t.end()
})