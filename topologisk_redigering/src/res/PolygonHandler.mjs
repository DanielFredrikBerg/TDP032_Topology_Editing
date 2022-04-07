import { getFeatureList, GeoJsonObjToFeatureList, featuresToGeoJson, geoJsonToJsts, jstsToGeoJson } from "./GeoJsonFunctions.mjs"
import { handleIntersections } from "./jsts.mjs"
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser.js"
import {  Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom.js'

const mapToJstsGeometryCollection = (map) => {

    const parser = new OL3Parser();
    parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiLineString,
        MultiPolygon
    );

    let jstsCollection = []
    map.getLayers().getArray()[1].getSource().getFeatures().forEach(function temp(feature) {
        let x = parser.read(feature.getGeometry())
        jstsCollection.push(x)
    })

    return jstsCollection
} 

//takes map as input and trimms last drawn polygon
export const fixOverlaps = (map) => {

    let jstsCollection = mapToJstsGeometryCollection(map)

    //TODO: OL3parser => uppdelat i olika översättningar

    let trimmed = handleIntersections(jstsCollection[jstsCollection.length - 1], jstsCollection.slice(0, jstsCollection.length - 1))
    //console.log("TRIMMED: ", trimmed)

    let cleanedJstsCollection = jstsCollection.slice(0, jstsCollection.length - 1)

    //if the new polygon crosses another polygon, make several polygons from it.
    if (trimmed._geometries) {
        trimmed._geometries.forEach(function multiPolygonToPolygons(geom){
            cleanedJstsCollection.push(geom)
        }) 
    }

    //if the polygon has an area (meaning its NOT entirely encapsulated by another polygon), add it.
    else if(trimmed._shell._points._coordinates.length > 0) { 
        cleanedJstsCollection.push(trimmed)
    }

    return jstsToGeoJson(cleanedJstsCollection)
}