import React, { useState, useEffect, useRef } from 'react';
import 'ol/ol.css';
import MapWrapper from './components/MapWrapper';
import Header from './components/Header';
import GeoJSON from 'ol/format/GeoJSON';

const App = () => {
  const [selectedTool, setSelectedTool] = useState('')
  const [geoJsonData, setGeoJsonData] = useState(new GeoJSON())

  const changeSelectedTool = (tool) => {
    setSelectedTool(tool)
    //console.log(selectedTool)
  }

  const changeGeoJsonData = (data) => {
      setGeoJsonData(data)
    }

  useEffect (() => {
      console.log(JSON.stringify(geoJsonData))
  }, [geoJsonData])

  return (
  <>
    <Header selectTool={changeSelectedTool}/>
    <MapWrapper changeSelectedTool={selectedTool} selectTool={changeSelectedTool} changeGeoJsonData={changeGeoJsonData} geoJsonData={geoJsonData}/>
  </>
  )
}

export default App;