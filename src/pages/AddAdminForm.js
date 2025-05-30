import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

export default function AddAdminForm({ open, setOpen, handleClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.0902, lng: -95.7129 });
  const [boundaryPaths, setBoundaryPaths] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [locationNames, setLocationNames] = useState([]);

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
    marginTop: "20px",
  };

  const fetchBoundariesData = async (zipCodesString) => {
    try {
      const response = await fetch(
        `https://vanitysoft-boundaries-io-v1.p.rapidapi.com/reaperfire/rest/v1/public/boundary?zipcode=${zipCodesString}`,
        {
          headers: {
            'x-rapidapi-host': 'vanitysoft-boundaries-io-v1.p.rapidapi.com',
            'x-rapidapi-key': 'e163d0e06amshc17b5bebe33fa65p18635ejsncf9f11d9cf1a'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.features) {
        const paths = [];
        const names = [];
        
        data.features.forEach(feature => {
          const coordinates = feature.geometry.coordinates[0].map(coord => ({
            lat: coord[1],
            lng: coord[0]
          }));
          paths.push(coordinates);
          
          const locationName = `${feature.properties.city}, ${feature.properties.state} (${feature.properties.zipCode})`;
          names.push(locationName);
        });
        
        setBoundaryPaths(paths);
        setLocationNames(names);
        setGeoJsonData(data);
        setLocation(names.join(', '));
        
        if (paths.length > 0) {
          const firstPath = paths[0];
          const center = firstPath.reduce(
            (acc, point) => ({
              lat: acc.lat + point.lat / firstPath.length,
              lng: acc.lng + point.lng / firstPath.length,
            }),
            { lat: 0, lng: 0 }
          );
          setMapCenter(center);
        }
      }
    } catch (error) {
      console.error("Error fetching boundaries:", error);
      toast.error("Error fetching boundaries data");
    }
  };

  const handleZipCodeChange = (e) => {
    const value = e.target.value;
    setZipCode(value);
    
    const zipCodesArray = value.split(',').map(zip => zip.trim()).filter(zip => /^\d{5}$/.test(zip));
    setZipCodes(zipCodesArray);
    
    if (zipCodesArray.length > 0) {
      fetchBoundariesData(zipCodesArray.join(','));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!name || !email || !location || !password || !mobile || !zipCode || !geoJsonData) {
      toast.error("Please fill all the fields and ensure location data is loaded");
      setIsSubmitting(false);
      return;
    }
    const token = localStorage.getItem("token");
    const data = {
      name,
      email,
      locationName: location,
      zipCode,
      geoJsonData,
      role: "admin",
      password,
      mobile,
    };
    try {
      const response = await registerUser(data, token);
      if (response.status === 201) {
        handleClose();
        setName("");
        setEmail("");
        setLocation("");
        setPassword("");
        setMobile("");
        setZipCode("");
        setGeoJsonData(null);
        setBoundaryPaths([]);
        setLocationNames([]);
        toast.success("User registered successfully");
        setIsSubmitting(false);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message[0]);
      console.error("Error registering user:", error?.response?.data?.message[0]);
      setIsSubmitting(false);
    }
  };

  return (
    <Offcanvas show={open} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add Your Admin</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="row gy-4">
          <div className="col-lg-12 me-auto">
            <TextField
              label="Enter Zip Codes (comma separated)"
              variant="standard"
              size="small"
              className="w-100"
              value={zipCode}
              onChange={handleZipCodeChange}
              required
              placeholder="e.g., 22066,20003,20019"
            />
          </div>

          {location && (
            <>
              <div className="col-lg-12 me-auto">
                <TextField
                  label="Location"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={location}
                  disabled
                />
              </div>

              <div className="col-lg-12 me-auto">
                <LoadScript googleMapsApiKey="AIzaSyByeL4973jLw5-DqyPtVl79I3eDN4uAuAQ">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={12}
                  >
                    {boundaryPaths.map((path, index) => (
                      <Polygon
                        key={index}
                        paths={path}
                        options={{
                          fillColor: "#FF0000",
                          fillOpacity: 0.35,
                          strokeColor: "#FF0000",
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              </div>

              <div className="col-lg-12 me-auto">
                <TextField
                  label="Enter Admin Name"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-12 me-auto">
                <TextField
                  label="Enter Admin Email"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-12 me-auto">
                <TextField
                  label="Enter Mobile"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="col-lg-12 me-auto">
                <TextField
                  label="Enter Password"
                  type="password"
                  variant="standard"
                  size="small"
                  className="w-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
        </div>

        <div className="kb-buttons-box d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="contained"
            color="error"
            className="rounded-4"
            onClick={handleClose}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="success"
            className="rounded-4"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Save
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
