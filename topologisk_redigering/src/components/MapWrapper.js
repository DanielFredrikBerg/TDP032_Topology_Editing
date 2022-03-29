import React, { useState, useEffect, useRef } from 'react';
import { Feature, Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import WMTS from 'ol/source/WMTS';
import { get as getProjection } from 'ol/proj';
import { getWidth } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import MultiPoint from 'ol/geom/MultiPoint';
import OL3Parser from "jsts/org/locationtech/jts/io/OL3Parser";
import IsValidOp from "jsts/org/locationtech/jts/operation/valid/IsValidOp";
import { Point, LineString, LinearRing, Polygon, MultiLineString, MultiPolygon } from 'ol/geom'
import { drawPolygon, highlightPolygon } from '../res/UIFunctions';
import { featuresToGeoJson } from '../res/GeoJsonFunctions'
import { saveToDatabase, GeoJsonObjToFeatureList, loadPolyFromDB } from '../res/DatabaseFunctions';
import { deleteLatest } from './DeletePolygon'
import { zoomToLastPolygon } from './ZoomToPolygon'
import getMergeableFeatures from "../res/jsts.js"


function MapWrapper({geoJsonData}) {
    const [map, setMap] = useState();
    const [currentTool, setCurrentTool] = useState('NONE')
    const mapElement = useRef();
    const mapRef = useRef();
    mapRef.current = map;

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
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const parser = new OL3Parser();
    parser.inject(
        Point,
        LineString,
        LinearRing,
        Polygon,
        MultiPoint,
        MultiLineString,
        MultiPolygon
    );
    
    const OUTER_SWEDEN_EXTENT = [-1200000, 4700000, 2600000, 8500000];
    const wmts_3006_resolutions = [4096.0, 2048.0, 1024.0, 512.0, 256.0, 128.0, 64.0, 32.0, 16.0, 8.0];
    const wmts_3006_matrixIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];   

    const styles = [
        new Style({
            stroke: new Stroke({
                color: 'light-blue',
                width: 3,
            }),
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
            }),
        }),
        new Style({
            image: new CircleStyle({
                radius: 5,
                fill: new Fill({
                    color: 'orange',
                }),
            }),

            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                const coordinates = feature.getGeometry().getCoordinates()[0];
                return new MultiPoint(coordinates);
            },
        }),
        new Style({
            fill: new Fill({
                color: 'rgba(255,255,0,0.1'
            })

        })
    ];

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
        style: styles
    });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

 


    /* useEffect(() => {

        console.log({ changeSelectedTool })
        if (currTool === 'Add') {
            drawPolygon()
        } else if (map) {
            stopDrawing()
        }

        if ({ changeSelectedTool }.changeSelectedTool == 'Zoom') {
            zoomToLastPolygon()
        }
        else if ({ changeSelectedTool }.changeSelectedTool == 'Import') {
            loadPolyFromDB()
        }
        else if({changeSelectedTool}.changeSelectedTool == 'Etc'){
            console.log("0")
            let testGeoJsonData = new GeoJSON({ projection: "EPSG:3006" }).writeFeaturesObject(map.getLayers().getArray()[1].getSource().getFeatures())
            console.log("1")
            testGeoJsonData["crs"] = {
                "type": "name",
                "properties": {
                    "name": "EPSG:3006"
                }
            }
            let testJstsData = geoJsonToJsts(testGeoJsonData)
            debugger
            checkIntersection(testJstsData.features[0], testJstsData.features[1])
        }
        else if ({ changeSelectedTool }.changeSelectedTool == 'Save') {
            saveToDatabase()
        }
        else if ({ changeSelectedTool }.changeSelectedTool == 'Delete') {
            console.log("deleting")
            deleteLatest()
        }

        else if ({ changeSelectedTool }.changeSelectedTool == 'AppVariableImport') {
            loadGeoJsonData()
        }


    }, [currTool])
 */

    useEffect(() => {
       
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
    
    
    const onMapClickHandler = () => {
        highlightPolygon(map)
        getMergeableFeatures(parser.read(map.getLayers().getArray()[1].getSource().getFeatures()[0].getGeometry()), map.getLayers().getArray()[1].getSource().getFeatures())
        if(currentTool === 'DRAWEND'){
            setCurrentTool('NONE')
        }
        else if (currentTool === "NONE"){
            drawPolygon(map, setCurrentTool)
        }
        else {}
    }

    useEffect (() => {
        console.log(currentTool)
    }, [currentTool])


    return (
        <>
            
            <div style={{ height: '100vh', width: '100%' }} 
            ref={mapElement} 
            className="map-container"
            onClick={onMapClickHandler}
            >                
            </div>
        </>
    );
}

export default MapWrapper;