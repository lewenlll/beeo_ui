import React, { useState, useEffect, useRef } from 'react';
import { 
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Divider,
  ListItemIcon,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BreadcrumbNav from '../common/BreadcrumbNav';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Expand from '@arcgis/core/widgets/Expand';
import Legend from '@arcgis/core/widgets/Legend';
import Basemap from '@arcgis/core/Basemap';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import './BuildingSearch.css';

// Mock data for initial development
const mockBuildings = [
  { 
    id: 'BLD001', 
    name: 'Building A',
    address: '123 Main Street',
    district: 'Central and Western',
    type: 'Commercial',
    coordinates: [114.1694, 22.3193],
    status: 'Active'
  },
  { 
    id: 'BLD002', 
    name: 'Building B',
    address: '456 Park Avenue',
    district: 'Wan Chai',
    type: 'Residential',
    coordinates: [114.1700, 22.3200],
    status: 'Under Maintenance'
  },
];

const districts = [
  'Central and Western',
  'Eastern',
  'Islands',
  'Kowloon City',
  'Kwai Tsing',
  'Kwun Tong',
  'North',
  'Sai Kung',
  'Sha Tin',
  'Sham Shui Po',
  'Southern',
  'Tai Po',
  'Tsuen Wan',
  'Tuen Mun',
  'Wan Chai',
  'Wong Tai Sin',
  'Yau Tsim Mong',
  'Yuen Long'
];

const buildingTypes = [
  'Commercial',
  'Residential',
  'Industrial',
  'Mixed Use',
  'Government',
  'Educational',
  'Healthcare',
  'Other'
];

// Map marker icons
const mapIcon = "data:image/png;base64,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";

const mapIcon2 = "data:image/png;base64,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";

// Add a utility to tint a base64 PNG icon (for marker color)
function colorizeIcon(base64, color) {
  // For simplicity, use two static icons for now: blue and green
  // In a real app, use SVG or canvas to tint dynamically
  if (color === 'green') {
    // Green marker icon (replace with your own or generate)
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGpklEQVR4Xu2baWhcVRiG3+/O3DuxLlRxwTZzky6aO0ldasXlh0uFilFwQawK1opiVdzB7Y8Y8Y9awa2lLih1ATfEBbRiwWr7o1XUWjXJjdqanMSKCyouaebcmfvJmWakxunknHPvTJV6/877vt93npx77nZC2M0P2s3Hj/8BNHsGfDVrrwNLsug7Dvkxk6/qO8QijllkvZyYvfn375vZU8NnwIfTMGUfNzc/juPTAZwHogPqDpD5BwAvOY7z5q9Rcc3RWzHaSCANA9CX9+Y4RFeD43MnHfTORqhgkPNyzLy8c1h+3ggQqQPYPLPFj0rxNQxcTcCUNJpmYJSA5W7WWTZry5hII7OakSqAMO9eyYQeAh2UZpPVLAZ/R4yeYDh6JK381ACEfm4FwFem1Vj9HHokEMWr0qiVCoCwzVsFxmlpNKSdQXgrGJLd2vqdCBMDCH3vaQCLkjZi6X8mEPJiS2/FlghAv+/1EHBHkgaSehm4syBkj22ONYAB37uDAevCtg3X8hHQ0yHknTaZVgD6W7Mnk+OssSnYKA/H8fzCSOld03wrAKHvvQbgTNNiDda/Hgh5lmkNYwCh710E4BnTQk3SLwqEfNakljGA/ry3ngjHmRRplpYZGwrD8niTekYAwvyUaaDSNyYF6mkJ6FW/M9CVViY4Oz0YHt2qm2cGwPcWAnhBN7y2jt9h4tvj0dKnXT/gd6XpPQB7OVOyhxPTXQCdkiwf5wdCvqibYQRgwHcfYtC1uuE1dLcGQt5bzx/63i0A7rGtQeCHO0R0na7fCECi85/5Kt2HGPVQBaIVuoPYUWe6DhgBCH1Pnf/TjBuzuG9P8HyxNRByum6P2gDWANmDfS/SDd5RR+AlHSJ63MQ74LuXM+gxE09V+62Q7nygpOPVBvCF3zIzRrxZJ3SiJiJ0HjYk+028n7V5BZfRZ+Kpah04sw4VY1t0vNoAEtz+DgVCtus0M1ET+t4ggDZTr8ltsTaA3nb3yExMG02bATAYCDnDwofQ974GYAyv7PDcrsHoE52a2gD621vaKY5VQ8ZHlnHYbMOXml/lvTklwmfGxdSNlePMKAyOqdkz6aENYGM7pu4Rez9PmlhTQDcEovigiTf0c9cD/ICJp6rd5sh95w7iFx2vNgAVFvoe64T+U0M/luNiR9cIftLx97Ziv4yTGwB4fx39RE0gpPa4tIXjAD4EMM+mKYDWBaJ4oo439HNrAT5BR1tD81Eg5NG6XiMAA37uUQYv0Q2fqCNg5VhRXnPEd/ijVsamg7BnS85bxsAl9jXosQ5RvELXbwQg9HPXAWx0LtdoRC1OKxxQn0eZj9TvksvzYnAnAPWq23jV/3sNuj4QxYcaAqDPzy1wwG/rhu8KXQw6tVMUV+vWNpoB4+uAujsr6BZosq4/EFLNJO3DBoB6VFWPrP/G495AyFtNGjMG0JvPnpAhZ61JkWZpyxyf2DVcWmdSzxjA+GnwPoBjTAo1QftBIOSxpnXsALS5l4LpCdNiDdUTXxYMRU+a1rACoIr0+7n3CKx1Y2PalKmeQWsLoniSqU/prQGEqbwgtWm5psfoReiOCdYAxteCNwCovT+78ngzEPIM2waSAWjNnQaHV9kWT8UXU3cwUnzLNisRgO1rgfcUAYm+0ds2z8DTBSEX2/oTrQHVon1t7lEO03oAXpJGLLwyJj6+cyj62ML7lyXxDKjMgry3lAg3JWnE1MuM+wrD8mZT30R9KgA2Td+jNZcpvwdgZtKGNP1biuXMSUd8s21EU79TWSoAxq8IKXw31B6O9WWvITOgGhr6nvrul3haToJhaSBkag9jqc0A1fSLQOZw310N0Hztv6WRkNd8KqIFC4Gyka2OOFUAqk5vq3tsxiH1QmLvtJocz/mtHPOCrpFIPYildqQOoHJV8N3FBFqZWpeVTRR8SUFET6WZqbIaAmB8UVQvJu5OqeHbAiGt9wzU66FhALZDcO8H6IZkEPiBQEQ3JsvYubuhAFTZgTbvOWZcYDMAIjzfMSQvtPHqehoO4Ot2tBTL7ioQnazbVEXH/G4uE3XPGMSYkc9Q3HAAlUVx+4dV9dQYaPYXsuN0637g1MysKWsKAFW5r909LhPTKgamTrIo/VJ2uLtzMNqQZGC63qYBqKwHee9sJrxSFwDjnI5h+aruAJLqmgqgcmWotwPMYCdZ0oFX/U0HUJkJ27faq/v56j9VjTKwNMm+f1sguwSAavbLNnduHKOyr9dxsP6Qochm+43tuP/y7TIAiTtPKeB/ACmB/M/G/AkqgAtfeuYalwAAAABJRU5ErkJggg==";
  }
  // Default: blue marker
  return base64;
}

const BuildingSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const mapViewRef = useRef(null);
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const [suggestedList, setSuggestedList] = useState([]); // For displaying SuggestedAddress list

  useEffect(() => {
    // Initialize map with Hong Kong basemap
    const basemapVTURL = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/basemap/HK80";
    const mapLabelVTUrl = "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/vt/label/hk/tc/HK80";

    const basemap = new Basemap({
      baseLayers: [
        new VectorTileLayer({
          url: basemapVTURL,
          copyright: '<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyright-url">&copy; 地圖資料由地政總署提供</a><div class="copyright-logo" ></div>'
        })
      ]
    });

    mapRef.current = new Map({
      basemap: basemap
    });

    // Initialize map view with explicit container dimensions
    const mapContainer = document.getElementById("map-view");
    if (mapContainer) {
      mapContainer.style.height = 'calc(100vh - 200px)'; // Adjust height based on your layout
      mapContainer.style.width = '100%';
    }

    mapViewRef.current = new MapView({
      container: "map-view",
      map: mapRef.current,
      zoom: 11,
      center: new Point(833359.88495, 822961.986247, new SpatialReference({
        wkid: 2326
      })),
      constraints: {
        minZoom: 8,
        maxZoom: 19
      }
    });

    // Add label layer
    mapRef.current.add(new VectorTileLayer({
      url: mapLabelVTUrl
    }));

    // Add legend widget
    legendRef.current = new Legend({
      view: mapViewRef.current,
      container: "legend-container"
    });

    // Add expand widget for legend
    const legendExpand = new Expand({
      view: mapViewRef.current,
      content: document.getElementById("legend-container"),
      expandIcon: "legend",
      expandTooltip: "Legend"
    });
    mapViewRef.current.ui.add(legendExpand, "top-right");

    // Load CSV data
    fetch('/cocr.csv')
      .then(response => response.text())
      .then(csvData => {
        const parsedData = parseCSV(csvData);
        setCsvData(parsedData);
      })
      .catch(error => console.error('Error loading CSV:', error));

    // Cleanup
    return () => {
      if (mapViewRef.current) {
        mapViewRef.current.destroy();
      }
    };
  }, []);

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.als.gov.hk/lookup?q=${encodeURIComponent(query)}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Search request failed');
      const data = await response.json();
      const suggestedAddresses = data.SuggestedAddress || [];
      setSuggestedList(suggestedAddresses); // Store for UI display
      
      // Match with CSV data
      const matchedResults = suggestedAddresses.map(address => {
        const csvMatch = csvData.find(csvItem => 
          csvItem.EngName === address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName ||
          csvItem.ChiName === address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName
        );

        return {
          id: address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
          name: address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
          nameZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName || '',
          address: address.Address?.PremisesAddress?.EngPremisesAddress?.EngStreet?.StreetName || '',
          addressZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.ChiStreet?.StreetName || '',
          district: address.Address?.PremisesAddress?.EngPremisesAddress?.EngDistrict?.DcDistrict || '',
          districtZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.ChiDistrict?.DcDistrict || '',
          coordinates: [
            address.Address?.PremisesAddress?.GeospatialInformation?.Easting,
            address.Address?.PremisesAddress?.GeospatialInformation?.Northing
          ],
          hasCsvMatch: !!csvMatch,
          csvData: csvMatch
        };
      });

      setSuggestions(matchedResults);
      setSearchResults(matchedResults);
      updateMapMarkers(matchedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event, newValue) => {
    setSearchQuery(newValue);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(newValue);
    }, 500);
  };

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    if (mapViewRef.current && building.coordinates[0] && building.coordinates[1]) {
      // Create point geometry
      const point = new Point({
        x: building.coordinates[0],
        y: building.coordinates[1],
        spatialReference: new SpatialReference({ wkid: 2326 })
      });

      // Create marker symbol for selected building
      const selectedSymbol = new PictureMarkerSymbol({
        url: building.hasCsvMatch ? mapIcon2 : mapIcon,
        width: "32px",
        height: "32px",
        yoffset: 16
      });

      // First, add or update the marker
      const existingGraphic = mapViewRef.current.graphics.find(g => 
        g.attributes.id === building.id
      );

      let graphic;
      if (existingGraphic) {
        // Update existing graphic
        existingGraphic.symbol = selectedSymbol;
        graphic = existingGraphic;
        // Bring to front
        mapViewRef.current.graphics.reorder(existingGraphic, mapViewRef.current.graphics.length - 1);
      } else {
        // Add new graphic
        graphic = new Graphic({
          geometry: point,
          symbol: selectedSymbol,
          attributes: building,
          popupTemplate: {
            title: building.name,
            content: [
              {
                type: "fields",
                fieldInfos: [
                  { fieldName: "nameZH", label: "Building Name (ZH)" },
                  { fieldName: "address", label: "Address" },
                  { fieldName: "addressZH", label: "Address (ZH)" },
                  { fieldName: "district", label: "District" },
                  { fieldName: "districtZH", label: "District (ZH)" }
                ]
              }
            ]
          }
        });
        mapViewRef.current.graphics.add(graphic);
      }

      // Ensure the graphic is visible before zooming
      graphic.visible = true;

      // Center map on selected building with animation
      mapViewRef.current.goTo({
        target: point,
        zoom: 17,
        scale: 2000
      }, {
        duration: 1000,
        easing: "ease-out"
      }).then(() => {
        // Ensure the graphic is still visible after zoom
        graphic.visible = true;
        // Bring to front again after zoom
        mapViewRef.current.graphics.reorder(graphic, mapViewRef.current.graphics.length - 1);
      }).catch(error => {
        console.error("Error during map navigation:", error);
      });
    }
  };

  const updateMapMarkers = (buildings) => {
    if (!mapViewRef.current) return;

    // Keep track of existing graphics using a regular object
    const existingGraphics = {};
    mapViewRef.current.graphics.forEach(g => {
      if (g.attributes.id) {
        existingGraphics[g.attributes.id] = g;
      }
    });
    
    buildings.forEach(building => {
      if (!building.coordinates[0] || !building.coordinates[1]) return;

      const point = new Point({
        x: building.coordinates[0],
        y: building.coordinates[1],
        spatialReference: new SpatialReference({ wkid: 2326 })
      });

      const symbol = new PictureMarkerSymbol({
        url: building.hasCsvMatch ? mapIcon2 : mapIcon,
        width: "24px",
        height: "24px",
        yoffset: 12
      });

      const existingGraphic = existingGraphics[building.id];
      if (existingGraphic) {
        // Update existing graphic
        existingGraphic.geometry = point;
        existingGraphic.symbol = symbol;
        existingGraphic.attributes = building;
        existingGraphic.visible = true;
      } else {
        // Add new graphic
        const graphic = new Graphic({
          geometry: point,
          symbol: symbol,
          attributes: building,
          visible: true,
          popupTemplate: {
            title: building.name,
            content: [
              {
                type: "fields",
                fieldInfos: [
                  { fieldName: "nameZH", label: "Building Name (ZH)" },
                  { fieldName: "address", label: "Address" },
                  { fieldName: "addressZH", label: "Address (ZH)" },
                  { fieldName: "district", label: "District" },
                  { fieldName: "districtZH", label: "District (ZH)" }
                ]
              }
            ]
          }
        });
        mapViewRef.current.graphics.add(graphic);
      }
    });

    // Remove graphics that are no longer in the results
    const currentIds = new Set(buildings.map(b => b.id));
    mapViewRef.current.graphics.forEach(g => {
      if (g.attributes.id && !currentIds.has(g.attributes.id)) {
        mapViewRef.current.graphics.remove(g);
      }
    });

    // Ensure selected building's marker is visible and on top
    if (selectedBuilding) {
      const selectedGraphic = mapViewRef.current.graphics.find(g => 
        g.attributes.id === selectedBuilding.id
      );
      if (selectedGraphic) {
        selectedGraphic.visible = true;
        mapViewRef.current.graphics.reorder(selectedGraphic, mapViewRef.current.graphics.length - 1);
      }
    }
  };

  // CSV parsing function
  const parseCSV = (csv) => {
    return csv.split('\n')
      .slice(1) // Skip header row
      .filter(row => row.trim()) // Filter empty rows
      .map(row => {
        const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        return {
          EngName: columns[0]?.replace(/^"|"$/g, ''),
          ChiName: columns[1]?.replace(/^"|"$/g, ''),
          EngAddress: columns[2]?.replace(/^"|"$/g, ''),
          ChiAddress: columns[3]?.replace(/^"|"$/g, ''),
          COCR_No: columns[4]?.replace(/^"|"$/g, ''),
          Easting: Number(columns[9]?.replace(/\D/g, '') || 0),
          Northing: Number(columns[12]?.replace(/\D/g, '') || 0)
        };
      });
  };

  // Update marker logic to use colorized icon
  const getMarkerIcon = (hasCsvMatch) => {
    // Use blue for normal, green for COCR
    return colorizeIcon(mapIcon, hasCsvMatch ? 'green' : 'blue');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? 240 : 65,
          flexShrink: 0,
          transition: theme => theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 240 : 65,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: theme => theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {/* Sidebar Header */}
        {drawerOpen ? (
          // Expanded sidebar header
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center' 
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              BEEO System
            </Typography>
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              sx={{ color: 'primary.main' }}
              aria-label="collapse sidebar"
            >
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        ) : (
          // Collapsed sidebar header
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            pb: 1
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: '1.1rem',
                mb: 1
              }}
            >
              BEEO
            </Typography>
            <Tooltip title="Expand sidebar" placement="right">
              <IconButton 
                onClick={() => setDrawerOpen(true)}
                sx={{ 
                  color: 'primary.main',
                  backgroundColor: 'action.hover',
                  width: 35,
                  height: 35,
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  }
                }}
                aria-label="expand sidebar"
              >
                <ChevronRightIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Divider />
        <List sx={{ pt: 1 }}>
          <Tooltip title={drawerOpen ? "" : "Home"} placement="right">
            <ListItem 
              button 
              component="a" 
              href="/" 
              sx={{ 
                py: 1.5,
                px: drawerOpen ? 2 : 'auto',
                justifyContent: drawerOpen ? 'flex-start' : 'center',
                minHeight: 48
              }}
            >
              <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
                <HomeIcon color="primary" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Home" />}
            </ListItem>
          </Tooltip>
          
          <Tooltip title={drawerOpen ? "" : "Cases"} placement="right">
            <ListItem 
              button 
              component="a" 
              href="/cases" 
              sx={{ 
                py: 1.5,
                px: drawerOpen ? 2 : 'auto',
                justifyContent: drawerOpen ? 'flex-start' : 'center',
                minHeight: 48
              }}
            >
              <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
                <SearchIcon color="primary" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Cases" />}
            </ListItem>
          </Tooltip>
          
          <Tooltip title={drawerOpen ? "" : "Buildings"} placement="right">
            <ListItem 
              button 
              component="a" 
              href="/buildings" 
              sx={{ 
                py: 1.5,
                px: drawerOpen ? 2 : 'auto',
                justifyContent: drawerOpen ? 'flex-start' : 'center',
                minHeight: 48
              }}
            >
              <ListItemIcon sx={{ minWidth: drawerOpen ? 40 : 0, mr: drawerOpen ? 2 : 'auto' }}>
                <ApartmentIcon color="primary" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Buildings" />}
            </ListItem>
          </Tooltip>
        </List>
        <Divider />
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        overflow: 'hidden',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Search Criteria */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : `${option.name} - ${option.address}`
                }
                value={searchQuery}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'object' && newValue) {
                    handleBuildingSelect(newValue);
                  }
                  handleInputChange(event, newValue);
                }}
                onInputChange={handleInputChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Buildings"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <ListItemText
                      primary={option.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {option.address}
                          </Typography>
                          {option.hasCsvMatch && (
                            <Chip 
                              label="COCR Registered" 
                              size="small" 
                              color="primary"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>District</InputLabel>
                <Select
                  value={selectedDistrict}
                  label="District"
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <MenuItem value="">All Districts</MenuItem>
                  {districts.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Building Type</InputLabel>
                <Select
                  value={selectedType}
                  label="Building Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {buildingTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="contained" 
                onClick={() => handleSearch(searchQuery)}
                fullWidth
                sx={{ height: '56px' }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* SuggestedAddress List UI */}
        {suggestedList.length > 0 && (
          <Paper sx={{ mt: 2, p: 2, bgcolor: '#f7f7f7', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>Suggested Addresses</Typography>
            <List>
              {suggestedList.map((item, idx) => {
                const eng = item.Address?.PremisesAddress?.EngPremisesAddress;
                const chi = item.Address?.PremisesAddress?.ChiPremisesAddress;
                return (
                  <ListItem button key={idx} alignItems="flex-start" onClick={() => handleBuildingSelect({
                    id: eng?.BuildingName || '',
                    name: eng?.BuildingName || '',
                    nameZH: chi?.BuildingName || '',
                    address: eng?.EngStreet?.StreetName || '',
                    addressZH: chi?.ChiStreet?.StreetName || '',
                    district: eng?.EngDistrict?.DcDistrict || '',
                    districtZH: chi?.ChiDistrict?.DcDistrict || '',
                    coordinates: [item.Address?.PremisesAddress?.GeospatialInformation?.Easting, item.Address?.PremisesAddress?.GeospatialInformation?.Northing],
                    hasCsvMatch: false // You can enhance this with CSV match logic
                  })}>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={<>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{eng?.BuildingName} {eng?.EngStreet?.StreetName} {eng?.EngDistrict?.DcDistrict}</Typography>
                      </>}
                      secondary={<>
                        <Typography variant="body2" color="text.secondary">{chi?.BuildingName} {chi?.ChiStreet?.StreetName} {chi?.ChiDistrict?.DcDistrict}</Typography>
                      </>}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        )}

        {/* Map Container */}
        <Paper sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          m: 2,
          height: 'calc(100vh - 200px)', // Set explicit height
          minHeight: '500px' // Ensure minimum height
        }}>
          <div id="map-view" style={{ height: '100%', width: '100%' }}></div>
          <div id="legend-container"></div>
          {selectedBuilding && (
            <Paper
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                p: 2,
                backgroundColor: 'white',
                boxShadow: 3
              }}
            >
              <Typography variant="h6">{selectedBuilding.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedBuilding.address}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={selectedBuilding.district} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                {selectedBuilding.hasCsvMatch && (
                  <Chip 
                    label="COCR Registered" 
                    size="small" 
                    color="primary"
                  />
                )}
              </Box>
            </Paper>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default BuildingSearch;