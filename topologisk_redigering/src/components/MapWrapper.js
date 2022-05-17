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
import { drawPolygon } from '../res/UIFunctions.mjs';
import { createStringXY } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition'
import { defaults as defaultControls } from 'ol/control'
import { fixOverlaps, handleMerge } from '../res/PolygonHandler.mjs';
import { Modify } from 'ol/interaction';
import {deletePolygon} from '../res/HelperFunctions.mjs'
import {defaultStyle, selectedStyle, invalidStyle, invalidStyle2 } from '../res/Styles.mjs'
import { isValid, unkink }  from '../res/unkink.mjs'
import { mergeFeatures } from '../res/jsts.mjs';
import { geoJsonFeature2olFeature, geoJsonFeatureCollection2olFeatures, olFeature2geoJsonFeature, olFeatures2GeoJsonFeatureCollection, olFeature2Jsts, jstsGemetry2ol } from '../translation/translators.mjs';
import { saveToDatabase } from '../res/DatabaseFunctions.mjs';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from '@mui/material';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Polygon } from 'ol/geom';
import OverlayOp from "jsts/org/locationtech/jts/operation/overlay/OverlayOp.js"
import * as turf from "@turf/turf"
import { listen } from 'ol/events';



function MapWrapper() {
    const [map, setMap] = useState();
    let beforeMod1 = ""
    let beforeMod2 = ""
    let clickHandlerState = 'NONE';
    const mapElement = useRef();
    const mapRef = useRef();
    mapRef.current = map;
    let currentClickedPolygon = null
    let previousClickedPolygon = null
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
    const attributions = "Click screen to draw, double click polygon to remove and to merge click two adjacent polygons"
    
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
            attributions: attributions,
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
    //     loader: function(){
    //         let url = "http://localhost:4000/file1"
    //         fetch(url).then(res => res.json()).then(result => {
    //         result.features.forEach(feature => {
    //             if (feature.geometry.coordinates.length > 1){
    //                 let splitMulti = []
    //                 feature.geometry.coordinates.forEach(coordinateArr => {
    //                     splitMulti.push(new Feature(new Polygon(coordinateArr)))
    //                 })
    //                 source.addFeatures(splitMulti)
    //             }
    //             else{
    //                 source.addFeature(new Feature(new Polygon(feature.geometry.coordinates[0])))
    //             }
    //         })
    
    //     })
    // }

});

    const polygonLayer = new VectorLayer({
        source: source,
        style: defaultStyle
    });
    

    const modify = new Modify({
        source: source, 
        hitDetection: true
    })
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    //fixes overlaps for the latest polygon added to map
    const cleanUserInput = (map, modifiedFeatures=1) => {
        console.log("cleanuserinput, map has this many features:")
        
        console.log(getFeatureList(map).length)
        if(getFeatureList(map).length > 1)
        {
            let newPolygons = fixOverlaps(olFeatures2GeoJsonFeatureCollection(getFeatureList(map)), modifiedFeatures)
            let featureList = geoJsonFeatureCollection2olFeatures(newPolygons) 
            if(featureList.length > 0){
                getSource(map).clear()
                getSource(map).addFeatures(featureList)
            }else{
                console.log("cleaned input is empty")
            }
        }
    }

    const mousePositionControl = new MousePosition({
        coordinateFormat: createStringXY(2),
        projection: "EPSG:3006",
    })

    const cleanself = (evt) => {
        //alt 1: run this on all polygons who change. Stop propagation to hinder repeated firing.
        //alt 2: getPointClosestToPixel, get all features who share pixel, run cleanuserinput/handleintersections on all of them.
        
        //console.log("Feature change event provides:", evt.target)
    }

    useEffect(() => {
        const initialMap = new Map({
            controls: defaultControls().extend([mousePositionControl]),
            target: mapElement.current,
            layers: [
                swedenMapLayer,
                polygonLayer
            ],
            view: new View({
                center: [609924.45, 6877630.37],
                zoom: 9,
                minZoom: 5.8,
                maxZoom: 100,

            }),
        });
        const featurelist = getFeatureList(initialMap)
        if(featurelist.length > 0)
        {
            featurelist.forEach((feature) => {
                feature.on('change', cleanself)
            })
        }
        initialMap.on('click', onMapClickGetPixel) // can I get closest pixel from here?
        initialMap.addInteraction(modify)
        modify.on('modifyend', handleModifyend)
        modify.on('modifystart', handleModifyStart)
        setMap(initialMap)
    }, []);


    /* Contextual clickhandler, different actions depending on if you click on a polygon or somewhere on the map */
    const onMapClickGetPixel = (event) => {
        
        /* Check if clicked on an existing polygon */
        if (isPolygon(event.map, event.pixel)){
            currentClickedPolygon = getPolygon(event.map, event.pixel) 
            currentClickedPolygon.setStyle(selectedStyle)
            if(previousClickedPolygon != null){
                previousClickedPolygon.setStyle(defaultStyle)
                if(currentClickedPolygon !== -1){
                    if(currentClickedPolygon !== previousClickedPolygon){
                        merge(event.map)
                    }
                    
                    if (currentClickedPolygon === previousClickedPolygon) {
                        deletePolygon(event.map, currentClickedPolygon)
                    }
                }
            }
            previousClickedPolygon = currentClickedPolygon
        } 
        else {
            if(clickHandlerState === 'DRAWEND') {
                //console.log("Running checks because polygon is finished drawing")
                //unkink the drawn polygon HERE
                cleanUserInput(event.map)
                clickHandlerState = 'NONE'
            }
            else if(clickHandlerState === 'NONE'){
                clickHandlerState = 'DRAW'
                drawPolygon(event.map).addEventListener('drawend', (evt) => {
                    handleDrawend(evt, event.map)
                    clickHandlerState = 'DRAWEND'
                    event.map.getInteractions().getArray().pop()
                    event.map.getInteractions().getArray().pop()

                }) 
            }
        }
    }

    const merge = (map) => {
        const featureList = olFeatures2GeoJsonFeatureCollection(getFeatureList(map))
        let newPoly = handleMerge(olFeature2geoJsonFeature(currentClickedPolygon), olFeature2geoJsonFeature(previousClickedPolygon),featureList)
    
        if(newPoly !== -1){
            let OlPoly = (new GeoJSON()).readFeature(newPoly)
            deletePolygon(map, currentClickedPolygon)
            deletePolygon(map, previousClickedPolygon)
            getSource(map).addFeature(OlPoly)
                
        }else{
            console.log("didnt find the poly in the list")
        }
    }

    const handleDrawend = (evt, map) => {
        const mapSource = map.getLayers().getArray()[1].getSource()

        // check if valid
        let valid = false
        try {
            valid = isValid(olFeature2geoJsonFeature(evt.feature))
        } catch (error) {
            console.log("isvalid error from drawendevent") 
        }
        
        if (!valid)
        {
            // if not valid unkink
            // return geoJsonFeatureCollection
            const unkinkedCollection = unkink(olFeature2geoJsonFeature(evt.feature))
            
            // check intersection and add unkinked polys to the source
            const olFeatures = geoJsonFeatureCollection2olFeatures(unkinkedCollection)
            mapSource.addFeatures(olFeatures)
            cleanUserInput(map)
            return unkinkedCollection.features.length
        }
        else 
        {
            cleanUserInput(map)
            return 1
        }
    }


    const handleModifyStart = (event) => {
        // have to do unecessary conversion in order to actually save the current state of the polygon
        // otherwise beforemod becomes just a reference.
        if(event.features.getArray().length > 1)
        {
            beforeMod1 = olFeature2geoJsonFeature(event.features.getArray()[event.features.getArray().length - 1])
            beforeMod2 = olFeature2geoJsonFeature(event.features.getArray()[event.features.getArray().length - 2])
        }
    }


    const handleModifyend = (event) => {
        let features = event.features.getArray()
        let source2 = getSource(event.target.map_)

        features.forEach((latestFeature) => {
            source2.removeFeature(latestFeature)
        })


        let newPoly = "lel"
        let originalPoly = "kekw"
        
        for (let i = 0; i<features.length; i++) {
            if(!isValid(olFeature2geoJsonFeature(features[i])))
            {
                console.log("I AM INVALID G")
                beforeMod1 = geoJsonFeature2olFeature(beforeMod1)
                beforeMod2 = geoJsonFeature2olFeature(beforeMod2)

                const jsts1 = olFeature2Jsts(beforeMod1)
                const jsts2 = olFeature2Jsts(beforeMod2)
                
                features[i] = jstsGemetry2ol(mergeFeatures(jsts2, jsts1))
                originalPoly = features[i]
                // check if the lsat to polygons in the map
                // intersect wtih combined poly
                // delete the done that doesnt intersect
                //intersection 
                // add intersection node
            } else 
            {
                newPoly = features[i]
            }
            //source2.addFeature(features[i])
            //cleanUserInput(event.target.map_)


        }

        let intersection = turf.intersect(olFeature2geoJsonFeature(newPoly), olFeature2geoJsonFeature(originalPoly));
        console.log(intersection)
        // const newPolyJsts = olFeature2Jsts(newPoly) 
        // const originalPolyJsts = olFeature2Jsts(newPoly)
        //console.log(originalPolyJsts.isGeometryCollection()); 
        //const jsts = OverlayOp.intersection(newPolyJsts, originalPolyJsts)
        source2.addFeature(geoJsonFeature2olFeature(intersection));
        //source2.addFeature(newPoly)
        //source2.addFeatures(jstsGemetry2ol(jsts))

    }

    const handleNewPoly = (evt) => {
        // when add feature check if valid
        //console.log("EVENT FEATURE converted:")
        //console.log(olFeature2geoJsonFeature(evt.feature))
        if (!isValid(olFeature2geoJsonFeature(evt.feature))) {
            map.getLayers().getArray()[1].getSource().removeFeature(evt.feature)
        } else {
            evt.feature.on('change', cleanself)
        }
    }
    


    useEffect(() => {
        if (map) {
            map.getLayers().getArray()[1].getSource().addEventListener('addfeature', handleNewPoly)
            //cleanUserInput(map)
        }
    }, [map])
    

    /* check if we are clicking on a polygon*/
    const isPolygon = (map, pixel) => {
        if(map.getFeaturesAtPixel(pixel).length > 0){
            return map.getFeaturesAtPixel(pixel)[0].getGeometry().getType() === "Polygon"
        }
        return false 
    }

    /* get the polygon we are clicking on */
    const getPolygon = (map, pixel) => {
        let list = map.getFeaturesAtPixel(pixel)
        if (list.length === 0){return -1}
        return list[0]
    }

    /* get mapsource */
    const getSource = (map) => {
        return map.getLayers().getArray()[1].getSource()
    }

    /* get the array of features on map */
    const getFeatureList = (map) => {
        return map.getLayers().getArray()[1].getSource().getFeatures()
    }

    const saveFeatureCollection = () => {
        saveToDatabase(olFeatures2GeoJsonFeatureCollection(getFeatureList(map)))
    }


    return (
        <>
            <div style={{ height: '95vh', width: '100%' }}
            ref={mapElement}
            className="map-container">    
                <nav> 
                    <Button value="Import File" color="success" size='large'><UploadFileIcon/></Button>
                    <Button value="Save" color="success" size='large' onClick={saveFeatureCollection}><SaveIcon/></Button>
                </nav>
            </div>
        </>
    );
}

export default MapWrapper;