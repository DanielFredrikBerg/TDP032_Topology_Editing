//Getters for geoJSON "Features"

export const getFeatureCoordinates = (feature) => {
    return feature.geometry.coordinates
}

//Getters for geoJSON "FeatureCollections"