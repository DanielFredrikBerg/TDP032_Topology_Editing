import { Circle as NodeStyle, Fill, Stroke, Style, CircleStyle } from 'ol/style.js';
import MultiPoint from 'ol/geom/MultiPoint.js';

 export const defaultStyle = [
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
        image: new NodeStyle({
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
            color: 'rgba(255,255,0,0.1)'
        })

    })
];

/* style for selected polygon */
export const selectedStyle = [
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
        image: new NodeStyle({
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