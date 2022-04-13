import { jstsToGeoJson } from "./GeoJsonFunctions.mjs"
import getMergeableFeatures, { handleIntersections, mergeFeatures } from "./jsts.mjs"
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser.js"
import {  Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom.js'
import { Overlay } from "ol"
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSON from "ol/format/GeoJSON.js"



const geoJSONToJstsGeometryCollection = (geoJSON) => {

    const features = new GeoJSON().readFeatures(geoJSON)
    const parser = new OL3Parser()
    parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiLineString,
        MultiPolygon
    );

    let jstsCollection = []
    features.forEach(function temp(feature) {
        let geometry = parser.read(feature.getGeometry())
        jstsCollection.push(geometry)
    })

    return jstsCollection
} 



//takes map as input and trimms last drawn polygon
export const fixOverlaps = (geoJSON) => {

    //console.log(geoJSON)
    let jstsCollection = geoJSONToJstsGeometryCollection(geoJSON)
    
        let trimmed = handleIntersections(jstsCollection[jstsCollection.length - 1], jstsCollection.slice(0, jstsCollection.length - 1))
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



//Takes jsts geometries and ol map and returns geojson geometry
export const handleMerge = (firstPolygon, secondPolygon, map) => {
    let mergables = getMergeableFeatures(firstPolygon, map.getLayers().getArray()[1].getSource().getFeatures())

    let status = -1
    mergables.forEach(function compare(mergablePolygon){
        //console.log(JSON.stringify(secondPolygon))
        //console.log(JSON.stringify(mergablePolygon))
        if(JSON.stringify(secondPolygon) === JSON.stringify(mergablePolygon)){
            status = jstsToGeoJson([mergeFeatures(firstPolygon, secondPolygon)]).features[0]
        }
    })
    //console.log("STATUS: ",status)
    return status
    
}