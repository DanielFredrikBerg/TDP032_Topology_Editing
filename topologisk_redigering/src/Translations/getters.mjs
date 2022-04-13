//Getters for geoJSON "Features"

export const getFeatureCoordinates = (feature) => {
    return feature.geometry.coordinates
}

//returns a list of ol feature objects
export const getListOfOlFeaturesFromMap = (map) => {
    return map.getLayers().getArray()[1].getSource().getFeatures()
}

//Getters for geoJSON "FeatureCollections"