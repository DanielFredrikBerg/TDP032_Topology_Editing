import simplepolygon from 'simplepolygon';
import IsValidOp from "jsts/org/locationtech/jts/operation/valid/IsValidOp";
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom'
import MultiPoint from 'ol/geom/MultiPoint';
import GeoJSON from 'ol/format/GeoJSON';
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp'
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp"


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


export const isValid = (olPoly) => {
    let jstsLastDrawnPoly = olToJsts(olPoly)
    return IsValidOp.isValid(jstsLastDrawnPoly);
}


/* 
 * creates several openlayer features from one self-intersecting polygon
 * @poly = openlayers feature
 * returns an openlayers feature array
 */
export const unkinkPolygon = (poly) => {
    const jsonObj = new GeoJSON({ featureProjection: "EPSG:3006" }).writeFeaturesObject([poly])
    const geoJsonCollection = simplepolygon(jsonObj.features[0]).features

    const olFeatures = []
    for(let i = 0;  i < geoJsonCollection.length; i++)
    {
        olFeatures.push(new GeoJSON().readFeatures(geoJsonCollection[i]))
    }

    return olFeatures
}


/*
 * return true if @lastDrawnPoly intersects any of the polys in @allPolys
 * @lastDrawnPoly = openlayers feature
 * @allPolys = openlayer features
 */
export function calcIntersection(lastDrawnPoly, allPolys) {
    let jstsLastDrawnPoly = olToJsts(lastDrawnPoly)
    console.log(allPolys)
    // shrink polygon by tiny amount otherwise it will count as intersect
    // if two polygons share a point on a border
    let bufferParameters = new BufferParameters();
    jstsLastDrawnPoly = BufferOp.bufferOp(jstsLastDrawnPoly, -.000001, bufferParameters);

    // iterate thought all the polygons and check if they intersect with lastDrawnPoly
    const result = allPolys.filter(function (poly) {
        const curPolygon = olToJsts(poly)
        const intersection = OverlayOp.intersection(curPolygon, jstsLastDrawnPoly);
        return intersection.isEmpty() === false;
    });

    return result.length > 0
}


export default { isValid, unkinkPolygon, calcIntersection } ;
