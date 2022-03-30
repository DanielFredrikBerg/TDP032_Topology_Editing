import simplepolygon from 'simplepolygon';
import IsValidOp from "jsts/org/locationtech/jts/operation/valid/IsValidOp";
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom'
import MultiPoint from 'ol/geom/MultiPoint';
import GeoJSON from 'ol/format/GeoJSON';
import BufferParameters from 'jsts/org/locationtech/jts/operation/buffer/BufferParameters'
import BufferOp from 'jsts/org/locationtech/jts/operation/buffer/BufferOp'
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp"
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';


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



export const polygonDrawend = (evt, map) => {
    const mapSource = map.getLayers().getArray()[1].getSource()
    const allPolys = mapSource.getFeatures()
    // +1 because drawend dosesn't add the poly that finished drawing
    if (allPolys.length + 1 > 0) {
        const lastDrawnPoly = evt.feature

        if (!isValid(lastDrawnPoly)) {
            unkink(lastDrawnPoly, allPolys, mapSource)
        }

        if (allPolys.length + 1 > 1 && isValid) {
            console.log("calculating intersection")
            calcIntersection(lastDrawnPoly, allPolys)
        }
    }
}


export const isValid = (olPoly) => {
    let jstsLastDrawnPoly = olToJsts(olPoly)
    return IsValidOp.isValid(jstsLastDrawnPoly);
}


export const unkink = (olPoly, allPolys, mapSource) => {
    const unkinkedCollection = unkinkPolygon(olPoly)
    highlightUnkinkIntersection(unkinkedCollection, allPolys, mapSource)
}


// readFeatures converts only the first unkinked, iterate through them ...
const highlightUnkinkIntersection = (unkinkedCollection, allPolys, mapSource) => {
    for (let i = 0; i < unkinkedCollection.features.length; i++) {
        const feature = new GeoJSON().readFeatures(unkinkedCollection.features[i])
        calcIntersection(feature[0], allPolys)
        mapSource.addFeatures(feature)
    }
}


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


export const olToJsts = (poly) => {
    return parser.read(poly.getGeometry())
}


// https://jsfiddle.net/vgrem/4v56xbu8/
export function calcIntersection(lastDrawnPoly, allPolys) {
    let jstsLastDrawnPoly = olToJsts(lastDrawnPoly)

    // shrink
    let bufferParameters = new BufferParameters();
    jstsLastDrawnPoly = BufferOp.bufferOp(jstsLastDrawnPoly, -.000001, bufferParameters);

    // iterate thought all the polygons and check if they intersect with lastDrawnPoly
    const result = allPolys.filter(function (poly) {
        const curPolygon = olToJsts(poly)
        const intersection = OverlayOp.intersection(curPolygon, jstsLastDrawnPoly);
        return intersection.isEmpty() === false;
    });

    //if new polygon intersects any of exiting ones, draw it with red color
    return result.length > 0
//     if (result.length > 0) {
//         // console.log("intersection", result)
//         // lastDrawnPoly.setStyle(stylesInvalid)
//         return true
//     } else {
//         return false
//     }
    }


export default { polygonDrawend, isValid, unkinkPolygon, calcIntersection, stylesInvalid} ;
