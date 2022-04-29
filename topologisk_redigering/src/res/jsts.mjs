import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser.js";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom.js'
import polygonsAreConnected from "./TopologyValidation.mjs"
import { geoJsonToJsts, jstsToGeoJson } from './GeoJsonFunctions.mjs';
import {default as jstsPoint} from "jsts/org/locationtech/jts/geom/Point.js";
import { CoordinateXY } from "jsts/org/locationtech/jts/geom.js";
import { GeometryFactory } from "jsts/org/locationtech/jts/geom.js";
import { LineStringExtracter } from "jsts/org/locationtech/jts/geom/util.js";
import GeoJSON from 'ol/format/GeoJSON.js';
import { olToJsts } from "./unkink.mjs";
import { geoJsonFeature2JstsGeometry, jstsGeometry2GeoJsonFeature } from "../translation/translators.mjs";


export const checkIntersection = (jstsGeometryA, jstsGeometryB) => {
    let jstsGeometryIntersection = jstsGeometryA.intersection(jstsGeometryB)
}

//removes overlapped areas from new geometry
//takes a jsts geometry and a list of all other jsts geometries.
export const handleIntersections = (jstsNewGeometry, jstsOtherGeometries) => {
    
    jstsOtherGeometries.forEach(jstsGeometry => {
            jstsNewGeometry = OverlayOp.difference(jstsNewGeometry, jstsGeometry) 
       
    });
    //console.log("JSTSNEWGEOM: ", jstsNewGeometry)
    return jstsNewGeometry
}

export const addIntersectionNodes = (jstsNewGeometry, jstsOtherGeometries) => {
    let jstsNewGeometry_original = jstsNewGeometry
    try {
        jstsOtherGeometries.forEach(jstsGeometry => {   
            let jstsNewGeometryTemp = OverlayOp.difference(jstsNewGeometry, jstsGeometry) 
            let intersection = OverlayOp.intersection(jstsNewGeometry_original, jstsGeometry);
           // console.log("-----------jstsNewGeometryTemp",jstsNewGeometryTemp)
            //console.log("-----------intersection",intersection)
                //NOTE mbe check both multi
            jstsNewGeometry = OverlayOp.union(jstsNewGeometryTemp, intersection)

        })
        
    } catch (error) {
        console.log(error)
        return jstsNewGeometry_original
    }
   

   
    //console.log("JSTSNEWGEOM: ", jstsNewGeometry)
    return jstsNewGeometry
}

//takes a JSTSpolygon and a geoJsonFeatureCollection and returns a JSTS geomlist
export default function getMergeableFeatures(selectedPolygon, allFeatures) { 

    //console.log(allFeatures)
  //removes selected polygon from polygons it will be checked against
  let otherFeatures = allFeatures.features.filter(function(feature) {
    const curPolygon = geoJsonFeature2JstsGeometry(feature)
    //console.log(curPolygon)
    return JSON.stringify(curPolygon) !== JSON.stringify(selectedPolygon)
  })

  //fills results with features adjecent to selectedFeature.
  const result = otherFeatures.filter(function (feature) {
      
    const curPolygon = geoJsonFeature2JstsGeometry(feature)
    const intersection = OverlayOp.intersection(curPolygon, selectedPolygon)
    return intersection

  })

  //console.log(result)
  const resultCleaned = result.filter(function(poly) {
      const curPolygon = geoJsonFeature2JstsGeometry(poly)
      //let x = jstsGeometry2GeoJsonFeature([curPolygon]).features[0]
      return polygonsAreConnected(jstsGeometry2GeoJsonFeature(curPolygon), jstsGeometry2GeoJsonFeature(selectedPolygon))
  })

  //result is an array of OL features, we need jsts geometries
  //converting to jsts geometries 
  let jstsFeatureList = []
 
  for (let index = 0; index < resultCleaned.length; index++) {
      const element = resultCleaned[index];
      jstsFeatureList.push(geoJsonFeature2JstsGeometry(element))
  }

  return jstsFeatureList;
}


//takes jsts geometries and return the union in jstsgeometry format
export function mergeFeatures(firstGeometry, secondGeometry){

    let union = -1;
    try {
        union = OverlayOp.union(firstGeometry, secondGeometry)
    } catch (error) {
        console.log("--------error in union--------")
        console.log(error)
        console.log(firstGeometry)
        console.log(secondGeometry)
    }
    
    if (union === -1){
        return -1
    }
 
    let firstPointList = firstGeometry._shell._points._coordinates
    let secondPointList = secondGeometry._shell._points._coordinates

    let factory = new GeometryFactory;
    firstPointList.forEach(function isColiding(coord){
    let point = factory.createPoint(coord)
    
    secondPointList.forEach(function(coord2){
        //check if same cacngle 
        let point2 =  factory.createPoint(coord2)
        if(firstPointList.includes(point2)){return}
        else{let x = point._coordinates[0]}
        })
    })

  return union
}
