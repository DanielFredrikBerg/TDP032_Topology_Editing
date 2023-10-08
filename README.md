# Topology Editor

This topology editor was created as part of the project course TDP032: Agile System Development at Linköping University.

## Description

Using a combination of JSTS, GeoJson and Openlayers, this topology editor can handle drawing, removing, modifying, merging, saving and loading of polygon based topologies.

User input is interpreted and modified to become valid topology data. For example, overlapping areas of different polygons are removed and polygons being drawn that cross themselves are corrected into several different polygons. 

## Requirements

- Node package manager (NPM) must be installed on the system. For installation instructions, see: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Known issues

### We did not have time to fully implement multipolygons, leading to some known bugs when using these

- A node from one multipolygon can't be moved into another polygon, as can be done with regular polygons.
- Multipolygons can't be unkinked, this means modifying a multipolygon so it intersects with itself is not handled.

### Other known issues

- Some complex overlapping may result in the overlapping areas not being removed. Most of the time, this can be fixed by modifying a border anywhere on the drawn polygon.

- Putting a polygon inside a polygon that's inside a polygon, and so on, repeatedly will lead to inner polygons eventually disappearing. 

- Modifying a regular polygon so it intersects itself is bugged, the polygon will be removed if this happens.

- Several polygons fully encircled by another polygon leads to the inner polygons not being able to have their borders modified outside the encircling polygon.

- Each click on the map, for example when drawing a polygon, leads to updateSource() being called. This removes all features and then adds them back again. This happens in the function OnClickMapGetPixel and leads to a performance loss. 

- Properties are not preserved through GeoJSON <-> Geometry conversion. The fix for this would require one to go through all places in the code where geometries are handled and make sure that the SRID is the same going out of function as it was going into function.

- Loading GeoJson data that was not created by being drawn in this tool may may break the program.

- Functionality from the load button has been removed. To load GeoJson data from the server, simply reload the page.

## Getting started

- Open two instances of the terminal from the topologisk_redigering folder/directory. One will be running the mock server and one the topology editor.

- In one terminal, run "npm install" to install project dependencies. 

- In the same terminal, start the mock server by running 'npm run http' if you're on Windows, or 'npm run httpl' if you're on MacOS or Linux. 

- In the other terminal, start the topology editor with 'npm start'.

A browser window running the topology editor will shortly be opened. 

## Using the editor

The editor supports both multipolygons and regular polygons. Multipolygons share the same attributes but are split in several self contained areas. Regular polygons have orange points on their corners while multipolygons do not. If one area of a multipolygon is clicked, the entire multipolygon will be selected. 

Operations supported by the editor are listed below:

- **Draw**: Click to place a point on the map, then click somewhere else to create a line between the two points. Continue placing points until you reach the starting point. Doubleclick to auto-finish the polygon. This creates a line between where you clicked and where the first point was placed.

- **Modify**: Click and drag a line or point that has already been placed.

- **Merge**: Click on the polygon you want to merge, then click the polygon you want to merge it with. Merging two regular polygons that are not connected will turn them into a multipolygon. Though if the two polygons are connected when merged, they will form a single regular polygon.

- **Delete**: Double click a polygon to delete it. 

- **Save**: Click the save button in the top bar to save the current map to the server. Next time you reload the map, the map's current state will be loaded. 

## Credits

Andrei Platoga
Daniel Berg
Edvin Nilsson Sommermark
Josefin Bodin
Simon Gradin
Theodore Nilsson

## License

MIT License

Copyright (c) [2022] [Andrei Platoga, Daniel Berg, Edvin Nilsson Sommermark, Josefin Bodin, Simon Gradin, Theodore Nilsson]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
