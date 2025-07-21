// components/Map/Map.jsx

// Import React
import React from "react";

// Import components from @react-google-maps/api library
// These are used to load the Google Maps script and show the map and markers
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Import Material UI components for styling and responsiveness
import { Paper, Typography, useMediaQuery } from "@material-ui/core";

// Import a location icon from MUI icons
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";

// Import Rating component from Material UI (v4-compatible version)
import Rating from "@material-ui/lab/Rating";

// Import custom styles using makeStyles() defined in a separate file
import useStyles from "./styles";

// Define style for the Google Map container (width and height)
const containerStyle = {
  width: "100%",      // Full width of the parent container
  height: "85vh",     // 85% of the viewport height
};

// Set a fallback center location (New Delhi) in case user location is not available
const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

// Define the main functional component called Map
// It receives props from its parent component
const Map = ({
  coordinates = defaultCenter,  // Current center of the map (lat/lng)
  places = [],                  // List of places to be shown as markers
  setCoordinates,               // Function to update the center coordinates
  setBounds,                    // Function to update map's visible boundaries
  onChildClick,                 // Function to handle marker click events (if needed)
}) => {

  // Use the custom styles defined in the styles.js file
  const classes = useStyles();

  // Detect if the device screen width is larger than 600px
  // This helps us render different UI for mobile vs desktop
  const isMobile = useMediaQuery("(min-width:600px)");

  // Access the Google Maps API key from the .env file using Vite
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


  // This function is triggered when the map loads completely
  const handleMapLoad = (map) => {
    // You can store this map instance for future use if needed
    // For example, calling methods like map.setZoom(), etc.
  };

  // This function runs when the user drags the map and releases
  // It updates the center and visible bounds of the map
  const handleDragEnd = (map) => {
    // Get the new center of the map after dragging
    const newCenter = map.getCenter();

    // Update the state with new center coordinates
    setCoordinates({ lat: newCenter.lat(), lng: newCenter.lng() });

    // Get the new bounds (visible rectangular area) of the map
    const bounds = map.getBounds();

    // Update the parent component with the new northeast and southwest corners
    setBounds({
      ne: bounds.getNorthEast().toJSON(),
      sw: bounds.getSouthWest().toJSON(),
    });
  };

  // Return the JSX that renders the map on screen
  return (
    // This is the main wrapper div for the map, with applied styling
    <div className={classes.mapContainer}>

      {/* Load the Google Maps JavaScript API using your API key */}
      <LoadScript googleMapsApiKey={apiKey}>

        {/* The GoogleMap component renders the actual map */}
        <GoogleMap
          mapContainerStyle={containerStyle}  // Size of the map container
          center={coordinates}                // Current center of the map
          zoom={14}                           // Initial zoom level (14 is city-level zoom)
          onLoad={handleMapLoad}              // Triggered when the map loads
          onDragEnd={(e) => handleDragEnd(e)} // Triggered after map is dragged
          onClick={onChildClick}              // Optional: handle clicks on the map
        >

          {/* Render one Marker per place in the `places` array */}
          {places?.map((place, i) => (
            <Marker
              key={i} // Unique key required for each item in a list in React

              // Marker position (latitude & longitude)
              position={{
                lat: Number(place.latitude),
                lng: Number(place.longitude),
              }}

              // Use a custom icon instead of the default red marker
              icon={{
                url: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png",
                scaledSize: new window.google.maps.Size(30, 30), // Resize the icon
              }}

              // Show label (place name) only if the screen is *not* mobile
              label={
                isMobile
                  ? undefined // No label for mobile users (to save space)
                  : {
                      text: place.name,      // Label text
                      color: "#333",         // Font color
                      fontSize: "12px",      // Size of the text
                      fontWeight: "bold",    // Make it bold
                    }
              }
            />
          ))}

        </GoogleMap>
      </LoadScript>
    </div>
  );
};

// Export the Map component so it can be imported in other files
export default Map;
