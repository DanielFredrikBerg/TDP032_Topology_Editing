import GeoJSON from "ol/format/GeoJSON.js"

// new terminal run command :  npm run http (for windows)
    //                            npm run httpl (for linux)
    // if you get an excution policy error run:
    //      Set-ExecutionPolicy Unrestricted (powershell admin to run http-server)
    // YOU NEED TO INSTALL json-server GLOBALLY FOR THE FOLLOWING FUNCTION TO WORK! (23/2)
    // npm install -g json-server

export const saveToDatabase = (features) => {
        const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
        jsonObj["crs"] = {
            "type": "name",
            "properties": {
                "name": "EPSG:3006"
            }
        }

        console.log(JSON.stringify(jsonObj))

        fetch("http://localhost:4000/file1",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(jsonObj)
            })
            .then(function (res) { console.log(res) })
            .catch(function (res) { console.log(res) })
}



export const loadPolyFromDB = ([]) => {      
    //Cant load in layer while runnign at the moment.     
    //realoadMap(vectorLayerFromUrl("geoJsonExample2.geojson"))
}