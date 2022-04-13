import GeoJSON from 'ol/format/GeoJSON.js';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import { Feature } from 'ol';
import { Polygon } from 'ol/geom.js';

    export const getFeatureList = (map) => {
        return map.getLayers().getArray()[1].getSource().getFeatures()
    }

    export const GeoJsonObjToFeatureList = (geoJsonData) => {
        return (new GeoJSON()).readFeatures(geoJsonData)
    }

    export const completeGeoJson = (geoJSONObject) => {
                geoJSONObject["crs"] = {
                    "type": "name",
                    "properties": {
                        "name": "EPSG:3006"
                    }
                }
                return geoJSONObject
            } 

     export const featuresToGeoJson = (features) => {
        
        const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
        jsonObj["crs"] = {
            "type": "name",
            "properties": {
                "name": "EPSG:3006"
            }
        }
        return jsonObj
    } 

    export const geoJsonToJsts = (geoJson) => {
        let jsts = new GeoJSONReader().read(geoJson)
        return jsts
    }


    //takes a featureCollection or an array of geometries and returns a jsts featurelist !REQUIRES USE OF .features can not use normal indexing
    export const jstsToGeoJson = (jstsObject) => {


        //console.log("JSTS",jstsObject)
        //debugger
    
        let writer = new GeoJSONWriter()
        let featureList = []

        if(jstsObject.features) {
            jstsObject.features.forEach(feature => {
                let writtenGeometry = writer.write(feature.geometry)
                let polygon = new Polygon(writtenGeometry.coordinates)
                let featureWrapping = new Feature(polygon)
                featureList.push(featureWrapping)
            });
        }
        else {
            jstsObject.forEach(geom => {
                let writtenGeometry = writer.write(geom)
                let polygon = new Polygon(writtenGeometry.coordinates)
                let featureWrapping = new Feature(polygon)
                featureList.push(featureWrapping)
            });
        }

        const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(featureList)

        jsonObj["crs"] = {
            "type": "name",
            "properties": {
                "name": "EPSG:3006"
            }
        }
        //console.log(jsonObj)
        return jsonObj
    }

/* 
    const loadGeoJsonData = (map, geoJsonData) => {
        console.log(JSON.stringify(geoJsonData))
        let featureList = []
        featureList = (new GeoJSON()).readFeatures(geoJsonData) //  GeoJSON.readFeatures(geoJsonData)
        console.log(featureList)
        const source = new VectorSource({
            wrapX: false,
            features: featureList
        });
        console.log(map.getLayers().getArray()[1])
        map.getLayers().getArray()[1].setSource(source)
    } */

    /* export const loadGeoJsonData = (map, geoJsonData) => {
        console.log(JSON.stringify(geoJsonData))
        const source = new VectorSource({
            wrapX: false,
            features: GeoJsonObjToFeatureList(geoJsonData)
        });
        map.getLayers().getArray()[1].setSource(source)
    } */