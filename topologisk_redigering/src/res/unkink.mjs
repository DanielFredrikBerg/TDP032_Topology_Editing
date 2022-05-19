import simplepolygon from 'simplepolygon';
import IsValidOp from "jsts/org/locationtech/jts/operation/valid/IsValidOp.js";
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser.js";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom.js'
import MultiPoint from 'ol/geom/MultiPoint.js';
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters.js'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp.js'
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"
import { geoJsonFeature2JstsGeometry, geoJsonFeature2olFeature } from '../translation/translators.mjs';
import { fixCoordinateRotation } from './HelperFunctions.mjs';


const parser = new OL3Parser();
parser.inject(
    Point,
    LineString,
    LinearRing,
    Polygon,
    MultiPoint,
    MultiLineString,
    MultiPolygon
);


export const olToJsts = (poly) => {
    return parser.read(poly.getGeometry())
}


export const isValid = (geoJsonFeature) => {
    //let olPoly = geoJsonFeature2olFeature(geoJsonFeature)
    let jstsLastDrawnPoly
    try {
        jstsLastDrawnPoly = geoJsonFeature2JstsGeometry(geoJsonFeature)
        return IsValidOp.isValid(jstsLastDrawnPoly);
        
    } catch (error) {
        console.log("isvalid error")
        console.log(jstsLastDrawnPoly)
        console.log("if illegalArgumentException cause is from mergepolygon")
        //console.log(error)
    }
    return false
 
}


/*
 * return true if @lastDrawnPoly intersects any of the polys in @allPolys
 * @lastDrawnPoly = openlayers feature
 * @allPolys = openlayer features
 */
export function calcIntersection(poly1, poly2) {
    let jstsLastDrawnPoly = olToJsts(poly1)
    // shrink polygon by tiny amount otherwise it will count as intersect
    // if two polygons share a point on a border
    let bufferParameters = new BufferParameters();
    jstsLastDrawnPoly = BufferOp.bufferOp(jstsLastDrawnPoly, -.000001, bufferParameters);

    // iterate thought all the polygons and check if they intersect with lastDrawnPoly
    const curPolygon = olToJsts(poly2)
    const intersection = OverlayOp.intersection(curPolygon, jstsLastDrawnPoly);
    console.log("intersection", intersection)
    return intersection.isEmpty() === false
}


export const unkink = (polygon) => {
    let unkinkedPolygons = simplepolygon(polygon)
    // unkinkedPolygons.features.forEach(polygon => {
    //     //polygon = fixCoordinateRotation(polygon)
    // })

    return unkinkedPolygons
}

export default { isValid,  calcIntersection } ;
