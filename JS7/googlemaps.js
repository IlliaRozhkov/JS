let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
function initMap() {
  const chicago = new google.maps.LatLng(41.85, -87.65);
  const map = new google.maps.Map(document.getElementById("map"), {
    center: chicago,
    zoom: 3,
  });
  const coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
  coordInfoWindow.setPosition(chicago);
  coordInfoWindow.open(map);
  map.addListener("zoom_changed", () => {
    coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
    coordInfoWindow.open(map);
  });
}
const TILE_SIZE = 256;
function createInfoWindowContent(latLng, zoom) {
  const scale = 1 << zoom;
  const worldCoordinate = project(latLng);
  const pixelCoordinate = new google.maps.Point(
    Math.floor(worldCoordinate.x * scale),
    Math.floor(worldCoordinate.y * scale)
  );
  const tileCoordinate = new google.maps.Point(
    Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
  );
  return [
    "Chicago, IL",
    "LatLng: " + latLng,
    "Zoom level: " + zoom,
    "World Coordinate: " + worldCoordinate,
    "Pixel Coordinate: " + pixelCoordinate,
    "Tile Coordinate: " + tileCoordinate,
  ].join("<br>");
}
function project(latLng) {
  let siny = Math.sin((latLng.lat() * Math.PI) / 180);
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 35.717, lng: 139.731 },
  });
}
const map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: -34.397, lng: 150.644 },
  zoom: 8,
});
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 0,
    center: { lat: 0, lng: 0 },
    mapTypeControl: false,
  });
  initGallPeters();
  map.mapTypes.set("gallPeters", gallPetersMapType);
  map.setMapTypeId("gallPeters");
  the mouse cursor.
  const coordsDiv = document.getElementById("coords");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(coordsDiv);
  map.addListener("mousemove", (event) => {
    coordsDiv.textContent =
      "lat: " +
      Math.round(event.latLng.lat()) +
      ", " +
      "lng: " +
      Math.round(event.latLng.lng());
  });
  map.data.setStyle((feature) => {
    return {
      title: feature.getProperty("name"),
      optimized: false,
    };
  });
  map.data.addGeoJson(cities);
}
let gallPetersMapType;

function initGallPeters() {
  const GALL_PETERS_RANGE_X = 800;
  const GALL_PETERS_RANGE_Y = 512;
  gallPetersMapType = new google.maps.ImageMapType({
    getTileUrl: function (coord, zoom) {
      const scale = 1 << zoom;
      const x = ((coord.x % scale) + scale) % scale;
      const y = coord.y;

      if (y < 0 || y >= scale) return "";
      return (
        "https://developers.google.com/maps/documentation/" +
        "javascript/examples/full/images/gall-peters_" +
        zoom +
        "_" +
        x +
        "_" +
        y +
        ".png"
      );
    },
    tileSize: new google.maps.Size(GALL_PETERS_RANGE_X, GALL_PETERS_RANGE_Y),
    minZoom: 0,
    maxZoom: 1,
    name: "Gall-Peters",
  });
  gallPetersMapType.projection = {
    fromLatLngToPoint: function (latLng) {
      const latRadians = (latLng.lat() * Math.PI) / 180;
      return new google.maps.Point(
        GALL_PETERS_RANGE_X * (0.5 + latLng.lng() / 360),
        GALL_PETERS_RANGE_Y * (0.5 - 0.5 * Math.sin(latRadians))
      );
    },
    fromPointToLatLng: function (point, noWrap) {
      const x = point.x / GALL_PETERS_RANGE_X;
      const y = Math.max(0, Math.min(1, point.y / GALL_PETERS_RANGE_Y));
      return new google.maps.LatLng(
        (Math.asin(1 - 2 * y) * 180) / Math.PI,
        -180 + 360 * x,
        noWrap
      );
    },
  };
}
const cities = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-87.65, 41.85] },
      properties: { name: "Chicago" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-149.9, 61.218] },
      properties: { name: "Anchorage" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-99.127, 19.427] },
      properties: { name: "Mexico City" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [-0.126, 51.5] },
      properties: { name: "London" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [28.045, -26.201] },
      properties: { name: "Johannesburg" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [15.322, -4.325] },
      properties: { name: "Kinshasa" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [151.207, -33.867] },
      properties: { name: "Sydney" },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [0, 0] },
      properties: { name: "0°N 0°E" },
    },
  ],
};
let map;

function initMap() {
  const mapOptions = {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  const marker = new google.maps.Marker({
    position: { lat: -34.397, lng: 150.644 },
    map: map,
  });
  const infowindow = new google.maps.InfoWindow({
    content: "<p>Marker Location:" + marker.getPosition() + "</p>",
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.open(map, marker);
  });
}
function initMap() {
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });
  const marker = new google.maps.Marker({
    position: myLatlng,
    map,
    title: "Click to zoom",
  });
  map.addListener("center_changed", () => {
    window.setTimeout(() => {
      map.panTo(marker.getPosition());
    }, 3000);
  });
  marker.addListener("click", () => {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
}
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: -25.363882, lng: 131.044922 },
  });
  const bounds = {
    north: -25.363882,
    south: -31.203405,
    east: 131.044922,
    west: 125.244141,
  };
  map.fitBounds(bounds);
  const secretMessages = ["This", "is", "the", "secret", "message"];
  const lngSpan = bounds.east - bounds.west;
  const latSpan = bounds.north - bounds.south;

  for (let i = 0; i < secretMessages.length; ++i) {
    const marker = new google.maps.Marker({
      position: {
        lat: bounds.south + latSpan * Math.random(),
        lng: bounds.west + lngSpan * Math.random(),
      },
      map: map,
    });
    attachSecretMessage(marker, secretMessages[i]);
  }
}
function attachSecretMessage(marker, secretMessage) {
  const infowindow = new google.maps.InfoWindow({
    content: secretMessage,
  });
  marker.addListener("click", () => {
    infowindow.open(marker.get("map"), marker);
  });
}
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: -25.363882, lng: 131.044922 },
  });
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });
}
function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}
function initMap() {
  const originalMapCenter = new google.maps.LatLng(-25.363882, 131.044922);
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: originalMapCenter,
  });
  const infowindow = new google.maps.InfoWindow({
    content: "Change the zoom level",
    position: originalMapCenter,
  });
  infowindow.open(map);
  map.addListener("zoom_changed", () => {
    infowindow.setContent("Zoom: " + map.getZoom());
  });
}function initMap() {
  const myLatlng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatlng,
  });
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to get Lat/Lng!",
    position: myLatlng,
  });
  infoWindow.open(map);
  map.addListener("click", (mapsMouseEvent) => {
    infoWindow.close();
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    infoWindow.open(map);
  });
}function initMap() {
  const mapDiv = document.getElementById("map");
  const map = new google.maps.Map(mapDiv, {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644),
  });
  google.maps.event.addDomListener(mapDiv, "click", () => {
    window.alert("Map was clicked!");
  });
}
function initMap() {
  const origin = { lat: -33.871, lng: 151.197 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: origin,
  });
  new ClickEventHandler(map, origin);
}

function isIconMouseEvent(e) {
  return "placeId" in e;
}

class ClickEventHandler {
  constructor(map, origin) {
    this.origin = origin;
    this.map = map;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);
    this.placesService = new google.maps.places.PlacesService(map);
    this.infowindow = new google.maps.InfoWindow();
    this.infowindowContent = document.getElementById("infowindow-content");
    this.infowindow.setContent(this.infowindowContent);
    // Listen for clicks on the map.
    this.map.addListener("click", this.handleClick.bind(this));
  }
  handleClick(event) {
    console.log("You clicked on: " + event.latLng);
    if (isIconMouseEvent(event)) {
      console.log("You clicked on place:" + event.placeId);
      event.stop();

      if (event.placeId) {
        this.calculateAndDisplayRoute(event.placeId);
        this.getPlaceInformation(event.placeId);
      }
    }
  }
  calculateAndDisplayRoute(placeId) {
    const me = this;
    this.directionsService.route(
      {
        origin: this.origin,
        destination: { placeId: placeId },
        travelMode: google.maps.TravelMode.WALKING,
      },
      (response, status) => {
        if (status === "OK") {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }
  getPlaceInformation(placeId) {
    const me = this;
    this.placesService.getDetails({ placeId: placeId }, (place, status) => {
      if (
        status === "OK" &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        me.infowindow.close();
        me.infowindow.setPosition(place.geometry.location);
        me.infowindowContent.children["place-icon"].src = place.icon;
        me.infowindowContent.children["place-name"].textContent = place.name;
        me.infowindowContent.children["place-id"].textContent = place.place_id;
        me.infowindowContent.children["place-address"].textContent =
          place.formatted_address;
        me.infowindow.open(me.map);
      }
    });
  }
}
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: -28.643387, lng: 153.612224 },
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
    },
    fullscreenControl: true,
  });
}
function initMap() {
  const myLatLng = { lat: -25.363, lng: 131.044 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: myLatLng,
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
  });
}
let map;
let service;
let infowindow;

function initMap() {
  const sydney = new google.maps.LatLng(-33.867, 151.195);
  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: sydney,
    zoom: 15,
  });
  const request = {
    query: "Museum of Contemporary Art Australia",
    fields: ["name", "geometry"],
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }
      map.setCenter(results[0].geometry.location);
    }
  });
}
function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}
