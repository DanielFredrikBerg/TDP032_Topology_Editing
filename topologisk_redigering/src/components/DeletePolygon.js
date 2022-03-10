export const deleteLatest = (map) => {
  if (map) {
      //console.log(map.getLayers().getArray()[1].getSource().getFeatures())
      let layers = map.getLayers().getArray()[1].getSource()
      let length = getFeatureList(map).length
      let lastFeature = getFeatureList(map)[length-1]
      layers.removeFeature(lastFeature)                      
  } 
}

const getFeatureList = (map) => {
  return map.getLayers().getArray()[1].getSource().getFeatures()
}