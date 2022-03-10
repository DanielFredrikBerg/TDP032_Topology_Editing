import GeoJSON from 'ol/format/GeoJSON.js';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import { Feature } from 'ol';
import { Polygon } from 'ol/geom.js';

    const getFeatureList = (map) => {
        return map.getLayers().getArray()[1].getSource().getFeatures()
    }

    const GeoJsonObjToFeatureList = (geoJsonData) => {
        return (new GeoJSON()).readFeatures(geoJsonData)
    }

     export const featuresToGeoJson = (map) => {
        let features = [];
        if (map) {features = getFeatureList(map) }
        else {features = []}
        const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
        jsonObj["crs"] = {
            "type": "name",
            "properties": {
                "name": "EPSG:3006"
            }
        }
    } 
 

    export const geoJsonToJsts = (geoJson) => {
        let reader = new GeoJSONReader().read(geoJson)
        return reader
    }

    export const jstsToGeoJson = (jstsObject) => {
        let writer = new GeoJSONWriter()
        let featureList = []

        jstsObject.features.forEach(feature => {
            let writtenGeometry = writer.write(feature.geometry)
            let polygon = new Polygon(writtenGeometry.coordinates)
            let featureWrapping = new Feature(polygon)
            featureList.push(featureWrapping)
        });

        const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(featureList)

        jsonObj["crs"] = {
            "type": "name",
            "properties": {
                "name": "EPSG:3006"
            }
        }
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