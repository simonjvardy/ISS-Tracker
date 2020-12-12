/* 
Constructing the Map and Map tiles
ISS Map function code snippet from leaflet.js containing the method 
setView with lat & lon as an array and the zoom level
*/
const issMapContainer = L.map('issMap').setView([0, 0], 5);

/*
Attribution for the use of the OpenStreetMaps Foundation map tiles
Code adapted from https://leafletjs.com/examples/quick-start/
*/
const attribution = 'Map Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Code adapted from https://leafletjs.com/reference-1.7.1.html#tilelayer 
const mapTilesURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}{r}.png';
const mapTiles = L.tileLayer(mapTilesURL, { attribution });
mapTiles.addTo(issMapContainer);

/*
Creating a custom Map Marker icon
Code adapted from https://leafletjs.com/examples/custom-icons/
*/
const issMapIcon = L.icon({
    iconUrl: 'assets/img/iss200.png',
    iconSize:     [50, 32], // size of the icon
    iconAnchor:   [25, 16], // point of the icon which will correspond to marker's location
});

// Code adapted from https://leafletjs.com/examples/custom-icons/
const issMapMarker = L.marker([0, 0], { icon: issMapIcon }).addTo(issMapContainer);

// Where The ISS At? API Endpoints
const iss_api_url_metric = 'https://api.wheretheiss.at/v1/satellites/25544';
const iss_api_url_imperial = 'https://api.wheretheiss.at/v1/satellites/25544?units=miles';

let firstTime = true;

async function getISSDataInMetricUnits() {
    const response = await fetch(iss_api_url_metric);

    // create the data object containing the JSON response
    const data = await response.json();

    // even better, take the data object and place them into an object of separate variables
    const {name, latitude, longitude, altitude, visibility, velocity, units, footprint} = data;

    /*
    Code adapted from https://leafletjs.com/reference-1.7.1.html#marker
    Changes the marker position to the given point - in this case 
    the latitude & longitude values
    */
    issMapMarker.setLatLng([latitude, longitude]);

    // 
    issMapContainer.setView([latitude, longitude], issMapContainer.getZoom());
    

    // Add this into DOM elements
    if(latitude < 0) {
        latitudeSouth = latitude * -1;
        document.getElementById('lat').textContent = latitudeSouth.toFixed(2) + "° S";
    } else {
        document.getElementById('lat').textContent = latitude.toFixed(2) + "° N";
    }

    if(longitude < 0) {
        longitudeEast = longitude * -1;
        document.getElementById('lon').textContent = longitudeEast.toFixed(2) + "° W";
    } else {
        document.getElementById('lon').textContent = longitude.toFixed(2) + "° E";
    }
    document.getElementById('name').textContent = name.toUpperCase();
    document.getElementById('alt').textContent = altitude.toFixed(2);
    document.getElementById('visibility').textContent = visibility;
    document.getElementById('velocity').textContent = velocity.toFixed(2);
    document.getElementById('altUnits').textContent = units;
    document.getElementById('velocityUnits').textContent = units;

}

async function getISSDataInImperialUnits() {
    const response = await fetch(iss_api_url_imperial);
    const data = await response.json();
    console.log(data);
}

getISSDataInMetricUnits();
getISSDataInImperialUnits();

setInterval(getISSDataInMetricUnits, 2000);
