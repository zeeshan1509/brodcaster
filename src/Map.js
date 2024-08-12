import React, { useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl";
import foxhamMarker from "./images/marker.png";
import MuseumIcon from "./images/museum.png";
import subwayIcon from "./images/subway.png";
import "./Map.css";
const Landmarks = [
  {
    name: "Foxham",
    icon: foxhamMarker,
    height: "45px",
    width: "25px",
    lat: 51.519339796644964,
    long: -0.11681045900716144,
  },
  {
    name: "British Museum",
    icon: MuseumIcon,
    height: "35px",
    width: "35px",
    lat: 51.519781039486105,
    long: -0.1270152131463094,
  },
  {
    name: "Holborn",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.51844623728697,
    long: -0.11969491555994083,
  },
  {
    name: "Covent Garden",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.51374598251372,
    long: -0.12407228045217562,
  },
  {
    name: "Goodge Street",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.52118147191416,
    long: -0.13461925997294122,
  },
  {
    name: "Tottenham Court Road",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.51717833735463,
    long: -0.1298246346907746,
  },
  {
    name: "Russell Square",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.523862620061664,
    long: -0.12466586078088186,
  },
  {
    name: "Chancery Lane",
    icon: subwayIcon,
    height: "45px",
    width: "35px",
    lat: 51.51896237550964,
    long: -0.1113062934363057,
  },
];

const MapArea = () => {
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiZm94aGFtcyIsImEiOiJjbHQ2ZHJ4bHIwOXE2MmtxdWtlOHY0OTVzIn0.K8G7E12xvQOhwMh0CX2s7w"
      initialViewState={{
        longitude: -0.11681045900716144,
        latitude: 51.519339796644964,
        zoom: 15,
      }}
      mapStyle={"mapbox://styles/foxhams/clzoaa4u2007w01qtb0zlcpf0"}
    >
      {Landmarks.map((item, i) => (
        <Marker
          key={i}
          latitude={item.lat}
          longitude={item.long}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(item);
          }}
        >
          <div
            style={{
              backgroundImage: `url(${item.icon})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: item.width,
              height: item.height,
              cursor: "pointer",
            }}
          />
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          latitude={popupInfo.lat}
          longitude={popupInfo.long}
          onClose={() => setPopupInfo(null)} // Close the popup when clicked outside
          closeOnClick={true}
          anchor="bottom"
        >
          <div className="popupStyle">{popupInfo.name}</div>
        </Popup>
      )}
    </Map>
  );
};

export default MapArea;
