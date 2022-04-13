import GeoJSON from 'ol/format/GeoJSON.js';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import { Feature } from 'ol';
import { Polygon } from 'ol/geom.js';

/* Takes an array of ol features and returns a feature collection */        
export const listOfOlFeaturesToFeatureCollection = (features) => {
    
    const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
    return jsonObj
} 


export const geoJsonToJsts = (feature) => {
    const reader = new GeoJSONReader()
    let jsts = reader.read(feature)
    return jsts.features[0].geometry
}


//takes an array of geometries and returns a FeatureCollection 
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
    //console.log(jsonObj)
    return jsonObj
}


export const featureCollectionToGeoJSON = (featureCollection) => {
    featureCollection["crs"] = {
        "type": "name",
        "properties": {
            "name": "EPSG:3006"
            }
        }
    return featureCollection
}
