import React, { useState, useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import WMTS from 'ol/source/WMTS';
import { get as getProjection } from 'ol/proj';
import { getWidth } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import {Modify, Snap} from 'ol/interaction';

function MapWrapper({changeSelectedTool, selectTool, changeGeoJsonData}) {
    const [map, setMap] = useState();
    const mapElement = useRef();
    const mapRef = useRef();
    mapRef.current = map;
    const [draw, setDraw] = useState()
    const [snap, setSnap] = useState()

    const projection = getProjection('EPSG:3857');
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
        //generate resolutions and matrixIds arrays for this WMTS
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = z;
    }

    

    const drawPolygon = () => {
        setDraw(new Draw({
            source: map.getLayers().getArray()[1].getSource(),
            type: "Polygon",    //TODO: change to value from tool selection in menu/header.
        }));
        setSnap(new Snap({source: map.getLayers().getArray()[1].getSource()}))

    }

    const stopDrawing = () => {
        map.removeInteraction(snap)
        map.removeInteraction(draw)
    }
    // new terminal run command :  npm run http (for windows)
    //                            npm run httpl (for linux)
    // if you get an excution policy error run:
    //      Set-ExecutionPolicy Unrestricted (powershell admin to run http-server)
    // YOU NEED TO INSTALL json-server GLOBALLY FOR THE FOLLOWING FUNCTION TO WORK! (23/2)
    // npm install -g json-server
    
    const saveToDatabase = () => {
        const features = map.getLayers().getArray()[1].getSource().getFeatures()
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

      //debugging for viewing last drawn polygon
    const zoomToLastPolygon = () => {
        let featureList = map.getLayers().getArray()[1].getSource().getFeatures()
        console.log("fl", featureList)
        if (featureList.length > 0){
            map.getView().fit(featureList[featureList.length - 1 ].getGeometry())
        }
        else {
            console.log("No features on map")
        } 
    }

    const loadPolyFromDB = ([]) => {      
        //Cant load in layer while runnign at the moment.     
        //realoadMap(vectorLayerFromUrl("geoJsonExample2.geojson"))
    }

    const stopDrawingMode = () => {
        map.getInteractions().pop()
    }

    const featuresToGeoJSON = () => {
        let features = [];
        if (map) {features = map.getLayers().getArray()[1].getSource().getFeatures() }
        else {features = []}
        console.log("raw feature list")
        console.log(features)
            const jsonObj = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(features)
            jsonObj["crs"] = {
                "type": "name",
                "properties": {
                    "name": "EPSG:3006"
                }
            }
            console.log(jsonObj)
            changeGeoJsonData(jsonObj)
    }

    const currTool = {changeSelectedTool}.changeSelectedTool
    useEffect(() => {

        console.log({changeSelectedTool})
        if (currTool === 'Add'){
            drawPolygon()  
        } else if(map){
            stopDrawing()
        }
        else if (map) {
            stopDrawingMode()
        }

        if ({changeSelectedTool}.changeSelectedTool == 'Zoom'){
            zoomToLastPolygon() 
        }
        else if ({changeSelectedTool}.changeSelectedTool == 'Import'){
            loadPolyFromDB()
        }
        else if({changeSelectedTool}.changeSelectedTool == 'Etc'){
            console.log("calling featuresToJson")
            featuresToGeoJSON()
        }


        else if ({ changeSelectedTool }.changeSelectedTool == 'Delete') {
            saveToDatabase()
        }
        
    }, [currTool])


    useEffect(() => {  
        const OUTER_SWEDEN_EXTENT = [-1200000, 4700000, 2600000, 8500000];
        const wmts_3006_resolutions = [4096.0, 2048.0, 1024.0, 512.0, 256.0, 128.0, 64.0, 32.0, 16.0, 8.0];
        const wmts_3006_matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        const tilegrid = new WMTSTileGrid({
            tileSize: 256,
            extent: OUTER_SWEDEN_EXTENT,
            resolutions: wmts_3006_resolutions,
            matrixIds: wmts_3006_matrixIds
        });

        const swedenMapLayer = new TileLayer({
            source: new WMTS({
                url: "https://api.lantmateriet.se/open/topowebb-ccby/v1/wmts/token/5401f50c-568c-3459-a49f-69426e4ed1c6/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=topowebb&STYLE=default&FORMAT=image/png",
                layer: "swedenMapLayer",
                format: 'image/png',
                matrixSet: '3006',
                tileGrid: tilegrid,
                version: '1.0.0',
                style: 'default',
                crossOrigin: 'anonymous',
                projection: "EPSG:3006",
                useSpatialIndex: 'false',
            }),
            style: 'default',
            wrapX: true,
        })

        const source = new VectorSource({
            wrapX: false,
            url: "http://localhost:4000/file1",
            format: new GeoJSON({ projection: "EPSG:3006" }),

        });

        const polygonLayer = new VectorLayer({
            source: source,
        });

            const initialMap = new Map({
                target: mapElement.current,
                layers: [
                    swedenMapLayer,
                    polygonLayer
                ],
                view: new View({
                    center: [609924.45, 6877630.37],
                    zoom: 5.9,
                    minZoom: 5.8,
                    maxZoom: 17,

                }),
            });
            
        setMap(initialMap)
    }, []);

    useEffect(() => {
        if (map) {
            map.addInteraction(draw)
            map.addInteraction(snap)
        }
    }, [draw])

    return (
        <div style={{ height: '100vh', width: '100%' }} ref={mapElement} className="map-container" />
    );
}

export default MapWrapper;