import "mapbox-gl/dist/mapbox-gl.css";
import {   useEffect, useState, useCallback, useMemo } from "react";
import Map, { Layer, Source } from "react-map-gl";
import "./Map.css";

const geojsonUrl = 'https://raw.githubusercontent.com/zeeshan1509/covid19livecases/main/src/data/countries.json';

const BroadCasterMap = ({ data }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const selectedCountries = useMemo(() => data.map(item => item.country_name), [data]);

  const fetchGeoJson = useCallback(async () => {
    try {
      const response = await fetch(geojsonUrl);
      const geoJson = await response.json();
      setGeojsonData(geoJson);
      
    } catch (error) {
      console.error('Failed to fetch GeoJSON data:', error);
    }
  }, []);

  useEffect(() => {
    fetchGeoJson();
  }, [fetchGeoJson]);

  const layerStyle = useMemo(() => ({
    id: "countries",
    type: "fill",
    paint: {
      'fill-color': [
        'match',
        ['get', 'ADMIN'],
        ...selectedCountries.reduce((acc, country) => acc.concat([country, '#3A45B0']), []),
        '#F2F3FA'
      ],
      'fill-opacity': 0.8,
      'fill-outline-color': '#3A45B0'
    }
  }), [selectedCountries]);

  return (
   
      <Map
        mapboxAccessToken="pk.eyJ1IjoiZm94aGFtcyIsImEiOiJjbHQ2ZHJ4bHIwOXE2MmtxdWtlOHY0OTVzIn0.K8G7E12xvQOhwMh0CX2s7w"
        initialViewState={{
          longitude: 0,
          latitude: 60,
          zoom: 1.2,
        }}
        renderWorldCopies={false}
        maxZoom={20}
        minZoom={1.2}
      >
        <Source type="geojson" data={geojsonData}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    
  );
};

export default BroadCasterMap;
