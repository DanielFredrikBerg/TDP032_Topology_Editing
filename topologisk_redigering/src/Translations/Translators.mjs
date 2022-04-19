import GeoJSON from 'ol/format/GeoJSON.js';
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter.js'
import { Feature } from 'ol';
import { Polygon } from 'ol/geom.js';


/* 
    +--------------------------------------------------------------+
    |                           FullGeoJSON                        |
    |                                ^                             |
    |                                |                             |
    |                                v                             |
    |            JSTS             GeoJSON               OL         |
    |        Geometries <--> FeatureCollection <-->   Features     |
    |                                ^                             |
    |                                |                             |
    |                                v                             |
    |            JSTS             GeoJSON               OL         |
    |         Geometry  <-->      Feature      <-->   Feature      |
    +--------------------------------------------------------------+
*/

/* Takes a full GeoJSON object and returns a GeoJSON FeatureCollection */
export const fullGeoJson2GeoJsonFeatureCollection = (fullGeoJson) => {
    delete fullGeoJson["crs"]
    return fullGeoJson
    //return featureCollection
}


/* Takes a featureCollection and returns a complete geoJson  */
export const geoJsonFeatureCollection2FullGeoJSON = (featureCollection) => {
    featureCollection["crs"] = {
        "type": "name",
        "properties": {
            "name": "EPSG:3006"
            }
        }
    return featureCollection
}


/* Takes a GeoJSON FeatureCollection and returns a GeoJSON Feature */
export const geoJsonFeatureCollection2GeoJsonFeature = (featureCollection, index) => {
    return featureCollection[index]
}

/* Takes a GeoJSON Feature and returns a GeoJSON Feature Collection*/
export const geoJsonFeature2geoJsonFeatureCollection = (feature) => {
    // return featureCollection
}

/* Takes a featureCollection and returns a list of jsts geometries */
export const geoJsonFeatureCollection2JstsGeometries = (featureCollection) => {
    
    let geometries = []

    featureCollection.features.forEach(feature => {
        let geometry = geoJsonFeature2JstsGeometry(feature)
        geometries.push(geometry)
    })

    return geometries

}


/* takes an array of geometries and returns a FeatureCollection */
export const jstsGeometries2GeoJsonFeatureCollection = (geometries) => {

    let writer = new GeoJSONWriter()
    let featureList = []

    geometries.forEach(geom => {
        let writtenGeometry = writer.write(geom)
        let polygon = new Polygon(writtenGeometry.coordinates)
        let featureWrapping = new Feature(polygon)
        featureList.push(featureWrapping)
    });
    
    const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(featureList)
    return jsonObj
}

// ........ The functions above this line are where  want them to be


/* Takes a jsts geometry and returns a geoJson feature */
export const jstsGeometry2GeoJsonFeature = (jstsGeometry) => {
    let writer = new GeoJSONWriter()
    let newFeature

    jstsGeometry.features.forEach(feature => {
        let writtenGeometry = writer.write(feature.geometry)
        let polygon = new Polygon(writtenGeometry.coordinates)
        newFeature = new Feature(polygon)
    });

    return newFeature
}

/* Takes an array of ol features and returns a feature collection */        
export const olFeatures2GeoJsonFeatureCollection = (features) => {
    const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
    return jsonObj
} 

/* takes a geoJson feature and returns a jsts geometry  */
export const geoJsonFeature2JstsGeometry = (feature) => {
    const reader = new GeoJSONReader()
    let jsts = reader.read(feature)
    return jsts.features[0].geometry
}



/* Takes a geoJson featureCollection and returns an Array of features */
export const geoJsonFeatureCollection2olFeatures = (featureCollection) => {
    return new GeoJSON().readFeatures(featureCollection)
}






