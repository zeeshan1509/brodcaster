import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import "./Map.css";

const geojsonUrl = "https://foxhams.s3.eu-west-2.amazonaws.com/countries.json";

const SingleStadium = ({ data }) => {
  const mapRef = useRef(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const selectedCountries = [];

  const fetchGeoJson = useCallback(async () => {
    try {
      const response = await fetch(geojsonUrl);
      const geoJson = await response.json();
      setGeojsonData(geoJson);
    } catch (error) {
      console.error("Failed to fetch GeoJSON data:", error);
    }
  }, []);

  useEffect(() => {
    fetchGeoJson();
  }, [fetchGeoJson]);

  const layerStyle = useMemo(
    () => ({
      id: "countries",
      type: "fill",
      paint: {
        "fill-color": "#F2F3FA",

        "fill-opacity": 0.8,
        "fill-outline-color": "#3A45B0",
      },
    }),
    [selectedCountries]
  );

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
      initialViewState={{
        longitude: data.team_stadium.longitude,
        latitude: data.team_stadium.latitude,
        zoom: 6,
      }}
      renderWorldCopies={false}
      maxZoom={20}
      minZoom={2}
    >
      <Source type="geojson" data={geojsonData}>
        <Layer {...layerStyle} />
      </Source>
      <Marker
        latitude={data.team_stadium.latitude}
        longitude={data.team_stadium.longitude}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setPopupInfo(data.team_stadium);
        }}
      >
        <div
          style={{
            backgroundImage: `url(${data.team_stadium.team_logo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: 33,
            height: 33,
            cursor: "pointer",
          }}
        />
      </Marker>

      {popupInfo && (
        <Popup
          latitude={popupInfo.latitude}
          longitude={popupInfo.longitude}
          onClose={() => setPopupInfo(null)}
          closeOnClick={true}
          anchor="bottom"
        >
          <div className="popupStyle">
            <div style={{ display: "flex", fontFamily: "Noto Sans" }}>
              <div
                style={{
                  backgroundImage: `url(${data.team_stadium.team_logo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: 40,
                  height: 40,
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              />

              <div
                style={{
                  textAlign: "start",
                }}
              >
                <div
                  style={{
                    font: "12px",
                    fontWeight: "bold",
                    color: "#3A45B0",
                    textAlign: "start",
                  }}
                >
                  {popupInfo.team_name}
                </div>
                <div>{popupInfo.venue_name}</div>
                <div>{popupInfo.city}</div>
                <div>Capacity: {popupInfo.capacity}</div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default SingleStadium;
