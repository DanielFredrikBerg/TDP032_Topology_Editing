import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser";
import BufferParameters from "jsts/org/locationtech/jts/operation/buffer/BufferParameters.js"
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp.js"
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp"
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom'
import polygonsAreConnected from "../res/TopologyValidation"
import { jstsToGeoJson } from './GeoJsonFunctions';

//selectedPolygon: jsts geometry; allFeatures: the map's OL features.
//returns an array with all features that border with with the selected feature as jsts geometries.
export default function getMergeableFeatures(selectedPolygon, allFeatures) { //= map.getLayers().getArray()[1].getSource().getFeatures()) => {



    const parser = new OL3Parser();
    parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiLineString,
        MultiPolygon
    );

    //removes selected polygon from polygons it will be checked against
    let otherFeatures = allFeatures.filter(function(poly) {
        const curPolygon = parser.read(poly.getGeometry())
        return JSON.stringify(curPolygon) !== JSON.stringify(selectedPolygon)
    })

    //fills results with features adjecent to selectedFeature.
    const result = otherFeatures.filter(function (poly) {

        const curPolygon = parser.read(poly.getGeometry())
        const intersection = OverlayOp.intersection(curPolygon, selectedPolygon)
        console.log("the intersection is: ", intersection)
        //debugger
        return intersection
/*         const curPolygon = parser.read(poly.getGeometry())
        let bufferParameters = new BufferParameters();
        bufferParameters.setEndCapStyle(BufferParameters.CAP_ROUND);
        bufferParameters.setJoinStyle(BufferParameters.JOIN_MITRE);
        let buffered = BufferOp.bufferOp(selectedPolygon,.0001, bufferParameters);
        buffered.setUserData(selectedPolygon.getUserData());
        const intersection = OverlayOp.intersection(selectedPolygon, curPolygon)
        console.log("the intersection is: ", intersection)
        console.log(intersection.isEmpty() === false)
        return intersection.isEmpty() === false */

    })

    const resultCleaned = result.filter(function(poly) {
        const curPolygon = parser.read(poly.getGeometry())
        return polygonsAreConnected(jstsToGeoJson(curPolygon), jstsToGeoJson(selectedPolygon))
    })

    //result is an array of OL features, we need jsts geometries
    //converting to jsts geometries 
    let jstsFeatureList = []
   
    for (let index = 0; index < resultCleaned.length; index++) {
        const element = resultCleaned[index];
        jstsFeatureList.push(parser.read(element.getGeometry()))
    }
    

    console.log("finished mergeable with: ", jstsFeatureList)
    return jstsFeatureList;
}

