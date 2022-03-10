//debugging for viewing last drawn polygon
export const zoomToLastPolygon = (map) => {
  let featureList = map.getLayers().getArray()[1].getSource().getFeatures()
  console.log("fl", featureList)
  if (featureList.length > 0){
      map.getView().fit(featureList[featureList.length - 1 ].getGeometry())
  }
  else {
      console.log("No features on map")
  } 
}

