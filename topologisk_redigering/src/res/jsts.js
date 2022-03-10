import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader.js'

let reader = new jsts.io.WKTReader()
let a = reader.read("POINT (-20 0")
let b = reader.read("POINT (20 0)")


export const checkIntersection = (jstsGeometryA, jstsGeometryB) => {
    debugger
    let jstsGeometryIntersection = jstsGeometryA.intersection(jstsGeometryB)
    console.log("checkIntersection finishing")
}

const getMergeableFeatures = (selectedPolygon, allFeatures = map.getLayers().getArray()[1].getSource().getFeatures()) => {

    //removes selected polygon from polygons it will be checked against
    let otherFeatures = allFeatures.filter(function(poly) {
        const curPolygon = parser.read(poly.getGeometry())
        return JSON.stringify(curPolygon) !== JSON.stringify(selectedPolygon)
    })

    //fills results with features adjecent to selectedFeature.
    const result = otherFeatures.filter(function (poly) {
        const curPolygon = parser.read(poly.getGeometry())
        let bufferParameters = new BufferParameters();
        bufferParameters.setEndCapStyle(BufferParameters.CAP_ROUND);
        bufferParameters.setJoinStyle(BufferParameters.JOIN_MITRE);
        let buffered = BufferOp.bufferOp(selectedPolygon,.0001, bufferParameters);
        buffered.setUserData(selectedPolygon.getUserData());
        const intersection = OverlayOp.intersection(buffered, curPolygon)
        console.log(intersection.isEmpty() === false)
        return intersection.isEmpty() === false
    })

    const resultCleaned = result.filter(function(poly) {
        const curPolygon = parser.read(poly.getGeometry())
        let bufferParameters = new BufferParameters();
        bufferParameters.setEndCapStyle(BufferParameters.CAP_ROUND);
        bufferParameters.setJoinStyle(BufferParameters.JOIN_MITRE);
        let buffered = BufferOp.bufferOp(selectedPolygon,.0001, bufferParameters);
        buffered.setUserData(selectedPolygon.getUserData());
        debugger
        let count
        for (let index = 0; index < curPolygon._shell._points._coordinates.length; index++) {
            const point = new Point([curPolygon._shell._points._coordinates[index].x, curPolygon._shell._points._coordinates[index].y])
            console.log("curr point:", point)
            //if the point is inside the buffered polygon
            if (OverlayOp.intersection(buffered, point).isEmpty === false) {
                counter++;
            }
        }
        const intersection = OverlayOp.intersection(buffered, curPolygon)

        //selectedPolygonLinesgetLines(selectedPolygon)


    })

    //result is an array of OL features, we need jsts geometries
    //converting to jsts geometries 
    let jstsFeatureList = []



    debugger
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        jstsFeatureList.push(parser.read(element.getGeometry()))
    }

    console.log("jstsFeatureList: ", jstsFeatureList)
    return jstsFeatureList;
}
