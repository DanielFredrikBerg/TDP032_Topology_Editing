import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'

let reader = new jsts.io.WKTReader()
let a = reader.read("POINT (-20 0")
let b = reader.read("POINT (20 0)")
