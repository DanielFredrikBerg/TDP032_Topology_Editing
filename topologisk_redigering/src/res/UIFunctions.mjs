import { Draw, Snap } from 'ol/interaction.js'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////



const style = [
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
  }),
  new Style({
    fill: new Fill({
      color: 'rgba(0,157,71,0.3)'
    })
  })
];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Adds Drawinteraction to map, allowing user to draw a polygon. Interaction is removed when feature is complete */
export const drawPolygon = (map) => {
  if (map) {
    const draw = new Draw({
      source: getMapSource(map),
      type: "Polygon",
      geometryName: "Polygon",    
    })
    
    const snap = new Snap({source: getMapSource(map)})

    map.addInteraction(draw)
    map.addInteraction(snap)
    
    return draw
}} 


/* Get the source from the map */
const getMapSource = (map) => {
  return map.getLayers().getArray()[1].getSource()

}


export const highlightPolygon = (polygon) => {
  //console.log(map.getFeaturesAtPixel(pixel).length > 0)
    {
      polygon.setStyle(style)
    }
}
