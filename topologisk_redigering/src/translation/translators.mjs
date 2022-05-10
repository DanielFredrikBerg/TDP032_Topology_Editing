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

let propertiesTableJSTS = new Map()
let propertiesTableOL = new Map()

function getRandomId() {
    let id = Math.floor(Math.random() * 1000)
    if (propertiesTableJSTS.has(id)){
        getRandomId()
    }
    return id 
}


/* Takes a full GeoJSON object and returns a GeoJSON FeatureCollection */
export const fullGeoJson2GeoJsonFeatureCollection = (fullGeoJson) => {
    delete fullGeoJson["crs"]
    return fullGeoJson
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
export const geoJsonFeatureCollection2GeoJsonFeature = (geoJsonFeatureCollection, index) => {
    let geoJsonFeature = geoJsonFeatureCollection.features[index]
    return geoJsonFeature
}

/* Takes a GeoJSON Feature and returns a GeoJSON Feature Collection with a single*/
export const geoJsonFeature2geoJsonFeatureCollection = (geoJsonFeature) => {
    let geoJsonFeatureCollection = {
        "type":"FeatureCollection",
        "features":[]
    }
    geoJsonFeatureCollection.features.push(geoJsonFeature)
    return geoJsonFeatureCollection
}

/* takes a geoJson feature and returns a jsts geometry  */
export const geoJsonFeature2JstsGeometry = (geoJsonFeature) => {

    //console.table(geoJsonFeature)
    const reader = new GeoJSONReader()
    let jsts = reader.read(geoJsonFeature)
    jsts.geometry.setSRID(getRandomId())
    propertiesTableJSTS.set(jsts.geometry._SRID, geoJsonFeature.properties)
    return jsts.geometry
}

/* Takes a jsts geometry and returns a geoJson feature */
export const jstsGeometry2GeoJsonFeature = (jstsGeometry) => {
    let writer = new GeoJSONWriter()
    let getProperties = propertiesTableJSTS.get(jstsGeometry._SRID)
    propertiesTableJSTS.delete(jstsGeometry._SRID)

    let writtenGeometry = writer.write(jstsGeometry)
    let polygon = new Polygon(writtenGeometry.coordinates)
    let newFeature = new Feature(polygon)
    newFeature.setProperties(getProperties)
    newFeature = new GeoJSON().writeFeatureObject(newFeature)

    return newFeature
}

/* Takes a featureCollection and returns an array of jsts geometries */
export const geoJsonFeatureCollection2JstsGeometries = (geoJsonFeatureCollection) => {
    
    let geometries = []
    geoJsonFeatureCollection.features.forEach(feature => {
        let geometry = geoJsonFeature2JstsGeometry(feature)
        geometries.push(geometry)
    })
    return geometries
}

/* takes an array of geometries and returns a FeatureCollection */
export const jstsGeometries2GeoJsonFeatureCollection = (jstsGeometries) => {

    let featureList = []
    let featureCollection = {
        "type":"FeatureCollection",
        "features":[]
    }

    jstsGeometries.forEach(geom => {
        let newFeature = jstsGeometry2GeoJsonFeature(geom)
        featureList.push(newFeature)
    });
    
    featureCollection.features = featureList
    return featureCollection
}
//////////////////////////////////////////////////////////////////////////
//      The functions above this line are where  want them to be        //
//////////////////////////////////////////////////////////////////////////

/* Takes an array of ol features and returns a feature collection */        
export const olFeatures2GeoJsonFeatureCollection = (olFeatures) => {
    const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(olFeatures)
    return jsonObj
} 

/* Takes a geoJson featureCollection and returns an Array of features */
export const geoJsonFeatureCollection2olFeatures = (featureCollection) => {
    return new GeoJSON().readFeatures(featureCollection)
}

export const olFeature2geoJsonFeature = (olFeature) => {
    let geoJsonFeature = new GeoJSON().writeFeatureObject(olFeature)
    return geoJsonFeature
}

export const geoJsonFeature2olFeature = (geoJsonFeature) => {
    let olFeature = new GeoJSON().readFeature(geoJsonFeature)
    return olFeature
}

export const geoJsonFeatureList2geoJsonFeatureCollection = (geoJsonFeatureList) => {
    let featureCollection = {
        "type":"FeatureCollection",
        "features":[]
    }
   featureCollection.features = geoJsonFeatureList

   return featureCollection
}

export const olFeature2Jsts = (olFeature) => {
    const geoJsonFeature = olFeature2geoJsonFeature(olFeature)
    return geoJsonFeature2JstsGeometry(geoJsonFeature)
}


export const jstsGemetry2ol = (geometry) => {
    const geoJsonFeature = jstsGeometry2GeoJsonFeature(geometry)
    return geoJsonFeature2olFeature(geoJsonFeature)
}

