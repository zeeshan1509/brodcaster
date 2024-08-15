import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Map, { Layer, Popup, Source } from "react-map-gl";
import "./Map.css";

const geojsonUrl =
  "https://raw.githubusercontent.com/zeeshan1509/covid19livecases/main/src/data/countries.json";

const BroadCasterMap = ({ data }) => {
  const mapRef = useRef(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [countryName, setCountryName] = useState();
  const [clickedLatLong, setClickedLatLong] = useState();
  const selectedCountries = useMemo(
    () => data.map((item) => item.country_name),
    [data]
  );

  const findCountry = (name) => {
    return data.find((country) => country.country_name === name);
  };
  const [matchedCountry, setmatchedCountry] = useState();
  useEffect(() => {
    if (countryName) {
      const selectcountry = findCountry(countryName);
      setmatchedCountry(selectcountry);
    }
  }, [countryName, clickedLatLong]);
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
        "fill-color": [
          "match",
          ["get", "ADMIN"],
          ...selectedCountries.reduce(
            (acc, country) => acc.concat([country, "#3A45B0"]),
            []
          ),
          "#F2F3FA",
        ],
        "fill-opacity": 0.8,
        "fill-outline-color": "#3A45B0",
      },
    }),
    [selectedCountries]
  );
  const handleClick = useCallback((event) => {
    if (mapRef.current) {
      const features = mapRef.current.queryRenderedFeatures(event.point);
      if (features && features.length > 0) {
        setClickedLatLong(event.lngLat);
        const clickedFeature = features[0];
        const countryClicked = clickedFeature.properties.ADMIN;
        setCountryName(countryClicked);
      }
    }
  }, []);

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
      initialViewState={{
        longitude: 0,
        latitude: 60,
        zoom: 1.2,
      }}
      renderWorldCopies={false}
      maxZoom={20}
      minZoom={1.2}
      onClick={handleClick}
    >
      <Source type="geojson" data={geojsonData}>
        <Layer {...layerStyle} />
      </Source>
      {matchedCountry && countryName && clickedLatLong && (
        <Popup
          latitude={clickedLatLong.lat}
          longitude={clickedLatLong.lng}
          onClose={() => {
            setmatchedCountry();
            setCountryName();
            setClickedLatLong();
          }}
          closeOnClick={true}
          anchor="bottom"
        >
          <div className="popupStyle">
            <div
              style={{
                font: "12px",
                fontWeight: "bold",
                color: "#3A45B0",
                textAlign: "start",
              }}
            >
              {countryName}
            </div>
            {matchedCountry.broadcast_details.broadcasters.map((item, i) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  font: "10px",
                }}
                key={i}
              >
                <div>{item}</div>
                <div
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  {matchedCountry.broadcast_details.s3_urls[i] && (
                    <img
                      width={35}
                      height={25}
                      src={matchedCountry.broadcast_details.s3_urls[i]}
                      alt={item}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default BroadCasterMap;
