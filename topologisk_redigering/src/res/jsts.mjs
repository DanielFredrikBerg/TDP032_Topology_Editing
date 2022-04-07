import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"

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



