import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'

let reader = new jsts.io.WKTReader()
let a = reader.read("POINT (-20 0")
let b = reader.read("POINT (20 0)")


export const checkIntersection = (jstsGeometryA, jstsGeometryB) => {
    debugger
    let jstsGeometryIntersection = jstsGeometryA.intersection(jstsGeometryB)
    console.log("checkIntersection finishing")
}