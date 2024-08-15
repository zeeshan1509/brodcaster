import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Map, { Layer, Marker, Popup, Source } from "react-map-gl";
import "./Map.css";
import { LngLatBounds } from "mapbox-gl";

const geojsonUrl =
  "https://raw.githubusercontent.com/zeeshan1509/covid19livecases/main/src/data/countries.json";

const MultipleStadium = ({ data }) => {
  const mapRef = useRef(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const selectedCountries = [];
  let bounds = new LngLatBounds();

  data.forEach((stadium) => {
    // Ensure longitude and latitude are correctly parsed as numbers
    const longitude = parseFloat(stadium.longitude);
    const latitude = parseFloat(stadium.latitude);
    bounds.extend([longitude, latitude]);
  });
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
  const onMapLoad = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 150 });
    }
  };
  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
      renderWorldCopies={false}
      maxZoom={20}
      minZoom={2}
      onLoad={onMapLoad}
    >
      <Source type="geojson" data={geojsonData}>
        <Layer {...layerStyle} />
      </Source>
      {data.map((item, i) => (
        <Marker
          latitude={item.latitude}
          longitude={item.longitude}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(item);
          }}
        >
          <div
            style={{
              backgroundImage: `url(${item.team_logo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: 33,
              height: 33,
              cursor: "pointer",
            }}
          />
        </Marker>
      ))}

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
                  backgroundImage: `url(${popupInfo.team_logo})`,
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

export default MultipleStadium;
