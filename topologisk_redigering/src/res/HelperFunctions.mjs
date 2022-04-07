
export const deletePolygon = (map, polygon) => {
    if (map) {
        //console.log(polygon)
        let layers = map.getLayers().getArray()[1].getSource()
        layers.removeFeature(polygon)                      
    } 
  }
  
/*   const getFeatureList = (map) => {
    return map.getLayers().getArray()[1].getSource().getFeatures()
  } */