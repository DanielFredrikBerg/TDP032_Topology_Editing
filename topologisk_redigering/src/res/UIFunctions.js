import { Draw, Snap } from 'ol/interaction'

export const drawPolygon = (map, setCurrentTool) => {
  if (map) {

    const snap = new Snap({source: getMapSource(map)})
    const draw = new Draw({
      source: getMapSource(map),
      type: "Polygon",
      geometryName: "Polygon",    //TODO: change to value from tool selection in menu/header.
  })
  
  map.addInteraction(draw)
  map.addInteraction(snap)
  setCurrentTool('DRAW')

  draw.addEventListener('drawend', () => {
    map.removeInteraction(snap)
    map.removeInteraction(draw)
    setCurrentTool('DRAWEND')
  })
  
}
} 

const getMapSource = (map) => {
  return map.getLayers().getArray()[1].getSource()
}

export const highlightPolygon = (map) => {
  console.log(map)
}
