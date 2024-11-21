import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import "./App.css";
import { Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { parse } from 'papaparse';

// importing components
import countries from "./components/Countries.js";
import DisasterCards from "./components/DisasterCards.js";
import StatsPanel from "./components/StatsPanel.js";
import HistoricalTrends from "./components/HistoricalTrends.js";
import DisasterMap from "./components/DisasterMap.js";

// Import CSV and GeoJSON files
import disastersData from './data/data.csv';
import countriesGeoJSON from './data/countries.geo.json';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Main App Component
const App = () => {
  const [country, setCountry] = useState(null);
  const [year, setYear] = useState(null);
  const [disasterType, setDisasterType] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allDisastersData, setAllDisastersData] = useState([]);

  // data structure
  const disasters = [
    { label: "Drought" },
    { label: "Earthquake" },
    { label: "Epidemic" },
    { label: "Extreme Temperature" },
    { label: "Flood" },
    { label: "Landslide" },
    { label: "Storm" },
    { label: "Wildfire" },
  ];

  // Load CSV data on component mount
  // useEffect(() => {
  //   const loadCSVData = () => {
  //     fetch(disastersData)
  //       .then(response => response.text())
  //       .then(csvText => {
  //         const parsedData = parse(csvText, { 
  //           header: true,
  //           dynamicTyping: true,
  //           skipEmptyLines: true
  //         }).data;

  //         // Transform data to match your UI requirements
  //         const transformedData = parsedData.map(item => ({
  //           country: item.ISO,
  //           year: item['Start Year'],
  //           disaster_type: item['Disaster Type'],
  //           total_deaths: item['Total Deaths'] || 0,
  //           affected_population: item['Total Affected'] || 0,
  //           economic_loss: item['Total Damages (\'000 US$)'] || 0
  //         }));

  //         setAllDisastersData(transformedData);
  //       })
  //       .catch(error => {
  //         console.error('Error loading CSV:', error);
  //         setError('Failed to load disaster data');
  //       });
  //   };

  //   // Load GeoJSON data
  //   const loadGeoJSON = () => {
  //     fetch(countriesGeoJSON)
  //       .then(response => response.json())
  //       .then(data => {
  //         setGeoJsonData(data);
  //       })
  //       .catch(error => {
  //         console.error('Error loading GeoJSON:', error);
  //         setError('Failed to load geographic data');
  //       });
  //   };

  //   loadCSVData();
  //   loadGeoJSON();
  // }, []);

  useEffect(() => {
    const loadCSVData = () => {
      fetch(disastersData)
        .then((response) => response.text())
        .then((csvText) => {
          const parsedData = parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }).data;
  
          // Log parsed data for debugging
          console.log(parsedData);
  
          // Transform data to match your UI requirements
          const transformedData = parsedData.map((item) => ({
            country: item.ISO,
            year: item['Start Year'],
            disaster_type: item['Disaster Type'],
            total_deaths: item['Total Deaths'] || 0,
            affected_population: item['Total Affected'] || 0,
            economic_loss: item["Total Damages ('000 US$)"] || 0,
          }));
  
          setAllDisastersData(transformedData);
        })
        .catch((error) => {
          console.error('Error loading CSV:', error);
          setError('Failed to load disaster data');
        });
    };
  
    const loadGeoJSON = () => {
      fetch(countriesGeoJSON)
        .then((response) => response.json())
        .then((data) => {
          setGeoJsonData(data);
        })
        .catch((error) => {
          console.error('Error loading GeoJSON:', error);
          setError('Failed to load geographic data');
        });
    };
  
    loadCSVData();
    loadGeoJSON();
  }, []);  

  // Modify years fetching to be local
  useEffect(() => {
    if (!country || !disasterType) {
      setAvailableYears([]);
      return;
    }

    // Filter unique years based on country and disaster type
    const years = [...new Set(
      allDisastersData
        .filter(item => 
          item.country === country.code && 
          item.disaster_type === disasterType.label
        )
        .map(item => item.year)
    )].sort();

    setAvailableYears(years.map(String)); // Convert to strings for Autocomplete
  }, [country, disasterType, allDisastersData]);

  const handleSearch = () => {
    if (!country || !disasterType || !year) return;

    setLoading(true);
    setError(null);

    try {
      // Filter data based on selected criteria
      const filteredResults = allDisastersData.filter(item => 
        item.country === country.code && 
        item.disaster_type === disasterType.label && 
        item.year === parseInt(year)
      );

      // Filter GeoJSON for specific country
      const countryGeoJson = geoJsonData.features.filter(feature => 
        feature.id === country.code
      );

      if (filteredResults.length > 0) {
        setSearchResults(filteredResults);
        // Update geoJsonData with filtered country data
        setGeoJsonData({
          type: 'FeatureCollection',
          features: countryGeoJson
        });
      } else {
        setError('No data found for selected criteria');
        setSearchResults(null);
      }
    } catch (error) {
      console.error('Error processing data:', error);
      setError('Failed to process disaster data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl">
           <AppBar position="static" sx={{ backgroundColor: "#2b2d42", mb: 4 }}>
        <Toolbar>
          <Typography
            variant="h2"
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              fontFamily: "DisplayFont",
              color: "#edf2f4",
            }}
          >
            DoomIndex
          </Typography>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" sx={{ mb: 2 }}>
        Welcome to DoomIndex
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
      DoomIndex is your comprehensive platform for accessing and understanding disaster-related information from across the globe. This interactive tool merges historical disaster data with advanced AI technology to offer valuable insights and enhance disaster response and preparedness.
      </Typography>

      <Typography variant="h4" sx={{ mb: 2 }}>
      Key Features
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        <ul>
          <li> Advanced disaster search and filtering capabilities </li>
          <li> AI-powered disaster summaries and analysis</li>
          <li> Real-time public information updates</li>
          <li> Interactive disaster response chatbot</li>
          <li> Educational resources and preparedness guides</li>
        </ul>
      </Typography>

      <Typography variant="h4" sx={{ mb: 2 }}>
      What You Can Do
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
      <ul>
        <li>Search and explore historical disaster data</li>
        <li>Gain detailed insights about specific disasters</li>
        <li>Access preparedness and response plans</li>
        <li>Engage with our AI-powered chatbot for disaster-related queries</li>
        <li>Learn about disaster prevention and preparedness</li>
      </ul>
      </Typography>

      <Typography variant="h4" sx={{ mb: 2 }}>
      How It Works
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
      The DoomIndex dashboard utilizes cutting-edge AI technology powered by Google's Gemini to analyze disaster data and deliver meaningful insights. Simply search for a disaster by country, year, or type, and instantly access comprehensive information, including summaries, public updates, response plans, and educational content. Our interactive chatbot is available to answer your specific questions about any disaster in our database.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
      Data is sourced from verified global disaster databases and processed in real-time to ensure the most up-to-date and relevant information. In case of an emergency, please always contact your local emergency services first.
      </Typography>

      <DisasterCards />

      <Grid container spacing={2} sx={{ mt: 4, mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={countries}
            value={country}
            onChange={(_, newValue) => {
              setCountry(newValue);
              setYear(null); // Reset year when country changes
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                    backgroundColor: '#edf2f4',
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={disasters}
            value={disasterType}
            onChange={(_, newValue) => {
              setDisasterType(newValue);
              setYear(null); // Reset year when disaster type changes
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Disaster Type"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                    backgroundColor: '#edf2f4',
                  }
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={availableYears}
            value={year}
            onChange={(_, newValue) => setYear(newValue)}
            disabled={!country || !disasterType}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Year"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                    backgroundColor: '#edf2f4',
                  }
                }}
                helperText={
                  !country || !disasterType 
                    ? "Select country and disaster type first" 
                    : availableYears.length === 0 
                    ? "No years available" 
                    : ""
                }
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!country || !disasterType || !year || loading}
            sx={{
              borderRadius: '30px',
              backgroundColor: '#ef233c',
              color: '#edf2f4',
              padding: '15px 30px',
              '&:hover': {
                backgroundColor: '#d90429',
              },
              '&:disabled': {
                backgroundColor: '#8d99ae',
              },
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Grid>
      </Grid>

      
      {error && (
        <Typography color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
      )}

      {searchResults && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <DisasterMap country={country} geoJsonData={geoJsonData} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatsPanel data={searchResults} />
          </Grid>
          <Grid item xs={12} md={4}>
            <HistoricalTrends data={searchResults} />
          </Grid>
        </Grid>
      )}

      <footer style={{
        backgroundColor: "#2b2d42",
        color: "#edf2f4",
        padding: "20px",
        marginTop: "40px",
        textAlign: "center"
      }}>
        <Typography variant="body2">
          Contact: info@doomindex.com | © 2024 DoomIndex. All Rights Reserved.
        </Typography>
      </footer>
    </Container>
  );
};

export default App;