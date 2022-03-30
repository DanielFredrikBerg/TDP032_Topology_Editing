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
    const jsonObj = new GeoJSON({ featureProjection: "EPSG:3006" }).writeFeaturesObject([olPoly])
    const unkinkedCollection = unkinkPolygon(jsonObj)
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


const unkinkPolygon = (jsonObj) => {
    return simplepolygon(jsonObj.features[0])
}


export const olToJsts = (poly) => {
    return parser.read(poly.getGeometry())
}


// https://jsfiddle.net/vgrem/4v56xbu8/
function calcIntersection(lastDrawnPoly, allPolys) {
    // iterate thought all the polygons and check if they intersect with lastDrawnPoly
    let jstsLastDrawnPoly = olToJsts(lastDrawnPoly)

    let bufferParameters = new BufferParameters();
    jstsLastDrawnPoly = BufferOp.bufferOp(jstsLastDrawnPoly, -.000001, bufferParameters);

    const result = allPolys.filter(function (poly) {
        const curPolygon = olToJsts(poly)
        const intersection = OverlayOp.intersection(curPolygon, jstsLastDrawnPoly);
        return intersection.isEmpty() === false;
    });

    //if new polygon intersects any of exiting ones, draw it with red color
    if (result.length > 0) {
        console.log("intersection", result)
        lastDrawnPoly.setStyle(stylesInvalid)
    }
}


const stylesInvalid = [
    new Style({
        stroke: new Stroke({
            color: 'red',
            width: 3,
        }),
        fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)',
        }),
    }),
    new Style({
        image: new CircleStyle({
            radius: 5,
            fill: new Fill({
                color: 'red',
            }),
        }),

        geometry: function (feature) {
            // return the coordinates of the first ring of the polygon
            const coordinates = feature.getGeometry().getCoordinates()[0];
            return new MultiPoint(coordinates);
        },
    }),
    new Style({
        fill: new Fill({
            color: 'rgba(255,255,0,0.1'
        })

    })
];


export default { polygonDrawend, isValid} ;
