import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser.js";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom.js'
import polygonsAreConnected from "./TopologyValidation.mjs"
import { jstsToGeoJson } from './Translators.mjs';



export const checkIntersection = (jstsGeometryA, jstsGeometryB) => {
    let jstsGeometryIntersection = jstsGeometryA.intersection(jstsGeometryB)
}

//removes overlapped areas from new geometry
//takes a jsts geometry and a list of all other jsts geometries.
export const handleIntersections = (jstsNewGeometry, jstsOtherGeometries) => {
    
    jstsOtherGeometries.forEach(jstsGeometry => {
        jstsNewGeometry = OverlayOp.difference(jstsNewGeometry, jstsGeometry) 
    });

    return jstsNewGeometry
}

//takes a JSTSpolygon and a list of Openlayers features and returns a JSTS featurelist
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
      //debugger
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
      let x = jstsToGeoJson([curPolygon]).features[0]
      //debugger
      return polygonsAreConnected(jstsToGeoJson([curPolygon]).features[0], jstsToGeoJson([selectedPolygon]).features[0])
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
//takes jsts geometries and return the union in jstsgeometry format
export function mergeFeatures(firstGeometry, secondGeometry){
  let x = OverlayOp.union(firstGeometry, secondGeometry)
  console.log("the things",x)
  return x
}

