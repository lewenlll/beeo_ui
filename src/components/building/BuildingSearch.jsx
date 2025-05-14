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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DeleteIcon from '@mui/icons-material/Delete';
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

const mapIcon2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHT0lEQVR4XtVba4wb1Rk938xuUqCEeBxeCRWQ+HqVpGoVEQSBUkWKFVEEFLUliEepaAkbz6yIgB9BPJTwKCBUEEri2SyEIBDlqbYivCG0qlCUIgFqqVKxHm9EgA2P2ONFArFs4vmQvbsQ0l3PfYy9xH/8Y8453/nO3LlzfT1DaNMnXSjOZ/BFsOzZAOaAeU79m4AjGRgE8x4QDQIYJMvaXvl4+DmsWzjSanvUygKzNg0s5ihazqALAD5VqRbRMMCPIaJXatT5ymfuiVUlviS4JQGk/YFchMgj4AJJH3GwQULkR3ZHodo977M4sMrxRANw/OB0AjwGLlMxIY+lfqLIr6RFASuoJs+bHJlYAI4f3APg2iRMxWkw421wdHO1p+uFOGzcceMAZve9efjw/hkvg+hnccUSP05YF+bFLSa6RgHM7A0W2YwdDEw3MWHG5SdCN3uxroZ2AOne/jnM1oe6hZPl8f2hm+3W0dQL4Cm2ncrAB2A+XqdoKzgMOqfqZl5U1dYKwCkED4Lwe9VircbbTGKvlymp1FEOIOWX/kjgG1SKtBH7YuiKc1TqKQUwyy+dEoHfVCkwBdhrQlfcJ1tXKQDHL/YBdJWs+BThdlv2viXl7gUfydSXDuAQOfuNnonp7oqXWZNoAIfI2R/vecSKsKTcI96OC0FqBBzlv5OycdguADPjBL8/x/n20M3eHOdHKgDHH7gCiLbEickfpycJ/HqE2uuwO3cjwlnEtZ8DtBzAT+V1miL/HbpiUZyWVAApv/Q3Aifx0/Z9Zuv6qjfv8YmMZdYH00MbflJrDMvGKeXu5pdBfAD1VV+59BUAOy7Npsc5uiX0utbJaBy9aUDUoqgog22Oib8MYgNwCruWg2ovm5mhYuhmulQ0Ur0D5xJHz6pw/g/L2BF64oxmGvEBJHD9M1nnVfPznlNtJu0HWxk4T5V3AP790BUnGgWQ9ks3Mfg2bROEd8O8mK/DdwqllSC+X4c7xqmFrugwDaCXwat0TTDwaNUVv9XhN3aSif6nwx3ndHTax326cu4nk2nEXgLGw5BxZeiJB3WbcPzSewA3HcbNtOPuBC0PgAmXVfPiz7oBpPwgICCjy7dAi8tu5i3tEWC6BGbwhqqbvVqnAeeB4ATswwc63HGOZXfOLnefNOkPo9gR4BT614GstQYm3ghdcboO3/GDCwE8pcMd54SuaNpjbAApv3QVgftMTBDRsko+83dVjVQheJgIl6vyDsDvCV1R/wtu0k98AEksSAg7wnzzBcnBDpM4+wy8VXXFYqMAju0tHbOPedLbiMLZWRG64mlZvOMHZQBpWfxEOGb4VU94RgHUySk/+AcBS03M1LkM3HnE8A9u+/DaH305mdbMDcFSy+atAB1pWo+iKFfp6XrNOACnUFwNIul9tqbGmd9ly3rIAoL9+/idafbIJzVM/wmIFwA4DcCVpo43wmbsrXviiDit2DmgMQJ6Sz8m5v/GiX3Pjm8OXbEyzpNUAHURp1D8F4jqZ+iQ+DDzJVUvO+G+w4ENSAeQ8ouXEEh7RdfW1IheC/OZnExN6QAao6A3eBqM38gITynGol+EqzIvyXhQCiC9sXgaW9Z2gM12h2Sc6WIYD4SekP7vQimAuqe0H9zFgNSeu24PBryyFe0/s9wzX3o7TTmAows7f1ijafUtsqZbTQZNmFBXhq7YrCKgHEDjtuj3n0WwtgGYplKsxdh7Q1dcp1pDK4DRCbF0HZj/pFqwRfjtMw7ryL13xcnDqvraAYzdFZ4EY4Vq0YTx+yMgN+SKf+roGgVwVF8wz67RNoBP0imeBIeZ11S97N26WkYBjM4HU7lA4r+GbvbXus3XecYBjM0H94F5tYkRdS4PWuhYVnbn9qtzv2UkEsDsvj2HD0dfbANjiYkZFS4x/a7iZR5R4UyETSSAuvCs3mBpxKj/9rZMTcXxieBX8s03OuI0xo8nFsDofBCsIeAu2eI6uPo2F3/1eW7omkVDOvyDOYkG0JgP/NJfAP5VEuYm1CCcHeaF4Z+1Cc8BBxqd5e/qiqhWnw9OaEEIa0NX3JqkbuIjoG4uXei/nMl6OEmjAD0fuplzk9VM6DY4kamUH2ysvzuQkOFyZEW5oVVd/0lI7xuZloyAxlywPpiBjsYqUe1VmQk6ZFB31c2Y/E0+aW4tC6BxKfgDOUb0qtFZY2wJPfEHI40m5JYGMDofFG9kots1G9hp80hur7fwY01+LK3lAYytD54h4PxYNwcBLOCXZVdsVeWp4NsSgLMxWAirMR8cJ2uOQXdU3cyNsnhdXFsCaEyKKg9bKWxr6zY+zmtbAI0QCsVNIIp7teVzijhX6cm+YdqcDL+tAczYvNPpHJm2jYFJH2El4tWVfHa9jPkkMG0NYHQUlM4G8YTv9hDwWMUVlybRmKxG2wMYDSFYC8J3HpslYKAW2cuGeubuljWfBG5KAhibD54H0bfv9xAuCvPC6HkgnUCmLoBNwQJE2AKwAPMG2QepdZpsxvkaKUJfX0VQzQwAAAAASUVORK5CYII=";

// Add a utility to tint a base64 PNG icon (for marker color)
function colorizeIcon(base64, color) {
  // For simplicity, use two static icons for now: blue and green
  // In a real app, use SVG or canvas to tint dynamically
  if (color === 'green') {
    // Green marker icon (replace with your own or generate)
    return "data:image/png;base64,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";
  }
  // Default: blue marker
  return base64;
}

// Helper to build a unique label for an address suggestion
function buildAddressLabel(address) {
  if (!address) return '';
  const eng = address.PremisesAddress?.EngPremisesAddress || {};
  const chi = address.PremisesAddress?.ChiPremisesAddress || {};
  // Compose English address
  const engParts = [
    eng.BuildingName,
    eng.EngBlock,
    eng.EngFloor,
    eng.EngUnit,
    eng.EngStreet?.StreetName,
    eng.EngDistrict?.DcDistrict
  ].filter(Boolean);
  // Compose Chinese address
  const chiParts = [
    chi.BuildingName,
    chi.ChiBlock,
    chi.ChiFloor,
    chi.ChiUnit,
    chi.ChiStreet?.StreetName,
    chi.ChiDistrict?.DcDistrict
  ].filter(Boolean);
  return `${engParts.join(' ')}${chiParts.length ? ' / ' + chiParts.join(' ') : ''}`;
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
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const mapViewRef = useRef(null);
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchControllerRef = useRef(null);
  const abortControllerRef = useRef(null); // Initialize as null and create later
  const [suggestedList, setSuggestedList] = useState([]);
  const componentMountedRef = useRef(true);

  // Create a safe version of setState that checks if component is still mounted
  const safeSetState = (setter) => (...args) => {
    if (componentMountedRef.current) {
      setter(...args);
    }
  };

  const safeSetLoading = safeSetState(setLoading);
  const safeSetCsvData = safeSetState(setCsvData);
  const safeSetSuggestedList = safeSetState(setSuggestedList);
  const safeSetSuggestions = safeSetState(setSuggestions);
  const safeSetSearchResults = safeSetState(setSearchResults);
  const safeSetBookmarks = safeSetState(setBookmarks);
  const safeSetInitialLoadComplete = safeSetState(setInitialLoadComplete);

  // Load bookmarks from localStorage on initial render
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('buildingBookmarks');
      if (savedBookmarks) {
        safeSetBookmarks(JSON.parse(savedBookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (bookmarks.length > 0 || localStorage.getItem('buildingBookmarks')) {
      localStorage.setItem('buildingBookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  // Function to toggle bookmark status
  const toggleBookmark = (building) => {
    const buildingId = building.id;
    // Check if building is already bookmarked
    const isBookmarked = bookmarks.some(b => b.id === buildingId);
    
    if (isBookmarked) {
      // Remove from bookmarks
      safeSetBookmarks(bookmarks.filter(b => b.id !== buildingId));
    } else {
      // Add to bookmarks
      safeSetBookmarks([...bookmarks, building]);
    }
  };

  // Function to check if a building is bookmarked
  const isBookmarked = (buildingId) => {
    return bookmarks.some(b => b.id === buildingId);
  };
  
  // Function to clear all bookmarks
  const clearAllBookmarks = () => {
    safeSetBookmarks([]);
    localStorage.removeItem('buildingBookmarks');
  };

  // Main initialization effect
  useEffect(() => {
    // Mark component as mounted
    componentMountedRef.current = true;
    
    // Create a new AbortController for this component instance
    abortControllerRef.current = new AbortController();
    
    // Initialize ArcGIS map with error handling
    let mapInitialized = false;
    
    try {
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

      // Initialize map view with error handling
      const initMapView = async () => {
        try {
          if (!componentMountedRef.current) return; // Exit if component unmounted
          
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
          
          // Wait for the view to be ready with error handling
          try {
            if (!componentMountedRef.current) return; // Exit if component unmounted
            
            await mapViewRef.current.when();
            mapInitialized = true;
            
            // Only proceed if component is still mounted
            if (!componentMountedRef.current) return;
            
            // Add label layer
            mapRef.current.add(new VectorTileLayer({
              url: mapLabelVTUrl
            }));

            // Create a feature layer with proper renderer for the legend
            const buildingLayer = new FeatureLayer({
              title: "Buildings",
              source: [], // Empty source, will be populated via graphics
              fields: [
                { name: "ObjectID", type: "oid" },
                { name: "status", type: "string" }
              ],
              objectIdField: "ObjectID",
              geometryType: "point",
              spatialReference: { wkid: 2326 },
              renderer: {
                type: "unique-value",
                field: "status",
                defaultSymbol: new PictureMarkerSymbol({
                  url: mapIcon,
                  width: "24px",
                  height: "24px",
                  yoffset: 12
                }),
                uniqueValueInfos: [
                  {
                    value: "registered",
                    symbol: new PictureMarkerSymbol({
                      url: mapIcon2, // Green icon for registered buildings
                      width: "24px",
                      height: "24px",
                      yoffset: 12
                    }),
                    label: "COCR Registered"
                  },
                  {
                    value: "unregistered",
                    symbol: new PictureMarkerSymbol({
                      url: mapIcon, // Blue icon for unregistered buildings
                      width: "24px",
                      height: "24px",
                      yoffset: 12
                    }),
                    label: "Not Registered"
                  }
                ]
              }
            });
            
            if (!componentMountedRef.current) return; // Exit if component unmounted
            mapRef.current.add(buildingLayer);

            // Add legend widget with proper configuration - Wrap with try/catch
            try {
              if (!componentMountedRef.current) return; // Exit if component unmounted
              
              // Create legend with error handling
              try {
                legendRef.current = new Legend({
                  view: mapViewRef.current,
                  layerInfos: [{
                    layer: buildingLayer,
                    title: "Building Registration Status"
                  }]
                });
              } catch (legendError) {
                if (legendError.name !== 'AbortError' && componentMountedRef.current) {
                  console.error('Error creating legend widget:', legendError);
                }
                // Early return on legend error
                return;
              }

              // Check if component is still mounted
              if (!componentMountedRef.current) return;

              // Create expand widget with error handling
              let legendExpand;
              try {
                legendExpand = new Expand({
                  view: mapViewRef.current,
                  content: legendRef.current,
                  expandIcon: "legend",
                  expandTooltip: "Legend"
                });
              } catch (expandError) {
                if (expandError.name !== 'AbortError' && componentMountedRef.current) {
                  console.error('Error creating expand widget:', expandError);
                }
                // Early return on expand error
                return;
              }
              
              // Add the widget with error handling
              if (!componentMountedRef.current) return; // Exit if component unmounted
              
              // Use a Promise with explicit error handling for ui.add
              try {
                // Wrap in a promise to catch any potential errors from ui.add
                await new Promise((resolve, reject) => {
                  try {
                    mapViewRef.current.ui.add(legendExpand, "top-right");
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                });
              } catch (uiError) {
                if (uiError.name !== 'AbortError' && componentMountedRef.current) {
                  console.error('Error adding widget to UI:', uiError);
                }
              }
            } catch (error) {
              // Silently handle errors during legend creation
              if (error.name !== 'AbortError' && componentMountedRef.current) {
                console.error('Error creating legend widget:', error);
              }
            }
          } catch (viewError) {
            // Handle errors during view initialization
            if (viewError.name !== 'AbortError' && componentMountedRef.current) {
              console.error('Error initializing map view:', viewError);
            }
          }
        } catch (mapViewError) {
          // Handle errors during map view creation
          if (mapViewError.name !== 'AbortError' && componentMountedRef.current) {
            console.error('Error creating map view:', mapViewError);
          }
        } finally {
          // Mark initialization as complete
          if (componentMountedRef.current) {
            safeSetInitialLoadComplete(true);
          }
        }
      };
      
      // Start map initialization
      initMapView().catch(error => {
        // Handle any unhandled promises during map initialization
        if (error.name !== 'AbortError' && componentMountedRef.current) {
          console.error('Unhandled error during map initialization:', error);
        }
        // Ensure initialization is marked as complete even on error
        if (componentMountedRef.current) {
          safeSetInitialLoadComplete(true);
        }
      });

    } catch (mapError) {
      // Handle errors during map creation
      if (mapError.name !== 'AbortError' && componentMountedRef.current) {
        console.error('Error creating map:', mapError);
      }
      // Ensure initialization is marked as complete even on error
      if (componentMountedRef.current) {
        safeSetInitialLoadComplete(true);
      }
    }

    // Load CSV data safely - wrap in a try/catch
    const loadCsvData = async () => {
      // Only proceed if component is still mounted and controller exists
      if (!componentMountedRef.current || !abortControllerRef.current) return;
      
      try {
        const response = await fetch('/cocr.csv', { 
          signal: abortControllerRef.current.signal 
        });
        
        // Check if component is still mounted after fetch completes
        if (!componentMountedRef.current) return;
        
        if (!response.ok) {
          throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        // Check again if component is still mounted
        if (!componentMountedRef.current) return;
        
        const parsedData = parseCSV(csvText);
        safeSetCsvData(parsedData);
        
        // Mark initial load as complete only after data is loaded
        safeSetInitialLoadComplete(true);
      } catch (error) {
        // Silently handle AbortError since it's expected during cleanup
        if (error.name !== 'AbortError' && componentMountedRef.current) {
          console.error('Error loading CSV:', error);
        }
        
        // Even if there's an error, mark initialization as complete
        // so we don't block the UI
        safeSetInitialLoadComplete(true);
      }
    };

    // Start loading data separately from map initialization
    loadCsvData().catch(error => {
      // Handle any unhandled promises during CSV loading
      if (error.name !== 'AbortError' && componentMountedRef.current) {
        console.error('Unhandled error during CSV loading:', error);
      }
      // Always mark initialization as complete on error
      if (componentMountedRef.current) {
        safeSetInitialLoadComplete(true);
      }
    });

    // Cleanup function
    return () => {
      // Mark component as unmounted first to prevent new operations
      componentMountedRef.current = false;
      
      // Clear any pending timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      
      // Abort any ongoing search requests
      if (searchControllerRef.current) {
        try {
          searchControllerRef.current.abort();
        } catch (error) {
          // Silently handle any errors during abort
        }
      }
      
      // Abort any pending fetch requests
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (error) {
          // Silently handle any errors during abort
        }
      }
      
      // Cleanup map if initialized
      if (mapViewRef.current) {
        try {
          mapViewRef.current.destroy();
        } catch (error) {
          console.error('Error destroying map:', error);
        }
      }
    };
  }, []);

  // --- Search Input Handler with debounce for autocomplete ---
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    
    // Cancel any previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    // Only fetch suggestions if input has reasonable length
    if (value && value.length >= 2) {
      // Debounce API call with 300ms delay
      searchTimeoutRef.current = setTimeout(() => {
        if (componentMountedRef.current) {
          // Call handleSearch with a flag to indicate this is for autocomplete
          handleSearch(value, true);
        }
      }, 300);
    } else {
      // Clear suggestions if input is too short
      safeSetSuggestions([]);
    }
  };

  // --- Search on Enter ---
  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      // Cancel any existing timeout to prevent duplicate searches
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      // Full search (not just for autocomplete)
      handleSearch(searchQuery, false);
    }
  };

  // --- API Search ---
  const handleSearch = async (query, isAutocomplete = false) => {
    // Don't attempt search if not fully initialized
    if (!query || !componentMountedRef.current || !initialLoadComplete) return;
    
    safeSetLoading(true);
    
    try {
      // Cancel any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
      
      // Abort any ongoing requests
      if (searchControllerRef.current) {
        try {
          searchControllerRef.current.abort();
        } catch (error) {
          // Silently handle any errors during abort
        }
      }
      
      // Create a new controller for this request
      searchControllerRef.current = new AbortController();
      
      // Set a safety timeout to abort the request if it takes too long
      const timeoutId = setTimeout(() => {
        if (searchControllerRef.current && componentMountedRef.current) {
          searchControllerRef.current.abort();
        }
      }, 15000); // 15 second timeout
      
      // Make the API request with proper error handling
      let response;
      try {
        response = await fetch(`https://www.als.gov.hk/lookup?q=${encodeURIComponent(query)}`, {
          headers: {
            'Accept': 'application/json'
          },
          signal: searchControllerRef.current.signal
        });
      } catch (fetchError) {
        // Clear timeout if fetch fails
        clearTimeout(timeoutId);
        
        // Re-throw if not an abort error
        if (fetchError.name !== 'AbortError') {
          throw fetchError;
        } else {
          // Return early if it's an abort (component unmounted, etc.)
          return;
        }
      }
      
      // Clear the timeout since request completed
      clearTimeout(timeoutId);
      
      // Only process if component is still mounted
      if (!componentMountedRef.current) return;
      
      if (!response.ok) throw new Error('Search request failed');
      
      // Parse JSON with error handling
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(`Failed to parse response: ${jsonError.message}`);
      }
      
      // Only process if component is still mounted
      if (!componentMountedRef.current) return;
      
      const suggestedAddresses = data.SuggestedAddress || [];
      safeSetSuggestedList(suggestedAddresses);

      // Build robust suggestion objects for Autocomplete
      const suggestionObjs = suggestedAddresses.map(address => {
        const label = buildAddressLabel(address.Address);
        const engDistrict = address.Address?.PremisesAddress?.EngPremisesAddress?.EngDistrict?.DcDistrict || '';
        const chiDistrict = address.Address?.PremisesAddress?.ChiPremisesAddress?.ChiDistrict?.DcDistrict || '';
        // CSV match logic
        const csvMatch = csvData.find(csvItem =>
          csvItem.EngName === address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName ||
          csvItem.ChiName === address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName
        );
        return {
          label,
          engDistrict,
          chiDistrict,
          data: {
            id: address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
            name: address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
            nameZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName || '',
            address: address.Address?.PremisesAddress?.EngPremisesAddress?.EngStreet?.StreetName || '',
            addressZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.ChiStreet?.StreetName || '',
            district: engDistrict,
            districtZH: chiDistrict,
            coordinates: [
              address.Address?.PremisesAddress?.GeospatialInformation?.Easting,
              address.Address?.PremisesAddress?.GeospatialInformation?.Northing
            ],
            hasCsvMatch: !!csvMatch,
            csvData: csvMatch
          }
        };
      });

      // Only process if component is still mounted
      if (!componentMountedRef.current) return;

      // Filter by district if selected
      let filteredSuggestions = suggestionObjs;
      if (selectedDistrict) {
        filteredSuggestions = suggestionObjs.filter(sug =>
          sug.engDistrict === selectedDistrict || sug.chiDistrict === selectedDistrict
        );
      }

      // Remove duplicates by label
      let uniqueSuggestions = [];
      if (Array.isArray(filteredSuggestions)) {
        const mapEntries = filteredSuggestions.map(s => [s.label, s]);
        const mapObj = new window.Map(mapEntries);
        uniqueSuggestions = [...mapObj.values()]; 
      }

      safeSetSuggestions(uniqueSuggestions);
      safeSetSearchResults(uniqueSuggestions.map(s => s.data));
      
      // Only update map if component is mounted
      if (componentMountedRef.current) {
        updateMapMarkers(uniqueSuggestions.map(s => s.data));
      }
    } catch (error) {
      // Only log errors if component is mounted and it's not an abort error
      if (componentMountedRef.current && error.name !== 'AbortError') {
        console.error('Search error:', error);
      }
    } finally {
      // Only update loading state if component is mounted
      safeSetLoading(false);
    }
  };

  const handleBuildingSelect = (building) => {
    console.log('handleBuildingSelect called with:', JSON.stringify(building, null, 2));
    setSelectedBuilding(building);

    if (!mapViewRef.current) {
      console.error('mapViewRef.current is null in handleBuildingSelect');
      return;
    }
    console.log('mapViewRef.current is available');

    if (
      !building ||
      !Array.isArray(building.coordinates) ||
      building.coordinates.length !== 2 ||
      isNaN(Number(building.coordinates[0])) ||
      isNaN(Number(building.coordinates[1]))
    ) {
      console.error('Invalid building data or coordinates for map centering:', JSON.stringify(building, null, 2));
      return;
    }
    console.log('Building coordinates are valid:', building.coordinates);

    const easting = Number(building.coordinates[0]);
    const northing = Number(building.coordinates[1]);

    // Create point geometry
    const point = new Point({
      x: easting,
      y: northing,
      spatialReference: new SpatialReference({ wkid: 2326 })
    });
    console.log('Created ArcGIS Point:', JSON.stringify(point.toJSON(), null, 2));

    // Create marker symbol for selected building (Reverted to PictureMarkerSymbol)
    const selectedSymbol = new PictureMarkerSymbol({
      url: getMarkerIcon(building.hasCsvMatch),
      width: "32px",
      height: "32px",
      yoffset: 16
    });
    console.log('Created PictureMarkerSymbol for selection');

    // First, add or update the marker
    let graphic = mapViewRef.current.graphics.find(g => 
      g.attributes && building.id && g.attributes.id === building.id // Check if building.id exists
    );

    if (graphic) {
      console.log('Found existing graphic for ID:', building.id);
      graphic.geometry = point; // Update geometry
      graphic.symbol = selectedSymbol;
      graphic.visible = true; // Ensure it's visible
      mapViewRef.current.graphics.reorder(graphic, mapViewRef.current.graphics.length - 1);
      console.log('Updated existing graphic');
    } else {
      console.log('No existing graphic found for ID:', building.id, '. Creating new one.');
      graphic = new Graphic({
        geometry: point,
        symbol: selectedSymbol,
        attributes: building, // Ensure building has an ID here
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
      console.log('Added new graphic to map');
    }

    // Ensure the graphic is visible before zooming
    graphic.visible = true;

    console.log('Attempting to goTo point:', JSON.stringify(point.toJSON(), null, 2));
    mapViewRef.current.goTo({
      target: point,
      zoom: 17, // Consider making zoom level more dynamic or ensuring scale is appropriate
      // scale: 2000 // Using zoom OR scale, not typically both unless intended.
    }, {
      duration: 1000,
      easing: "ease-out"
    }).then(() => {
      console.log('mapView.goTo completed successfully.');
      // Ensure the graphic is still visible and on top after zoom
      graphic.visible = true;
      mapViewRef.current.graphics.reorder(graphic, mapViewRef.current.graphics.length - 1);
      console.log('Graphic reordered and ensured visible after goTo.');
    }).catch(error => {
      console.error("Error during map navigation (goTo):", error);
    });
  };

  const updateMapMarkers = (buildings) => {
    if (!mapViewRef.current) return;

    // Find the buildingLayer to update for the legend
    const buildingLayer = mapRef.current.layers.find(layer => 
      layer.title === "Buildings" && layer.type === "feature"
    );

    // Keep track of existing graphics using a regular object
    const existingGraphics = {};
    mapViewRef.current.graphics.forEach(g => {
      if (g.attributes.id) {
        existingGraphics[g.attributes.id] = g;
      }
    });
    
    // Create features for the legend layer
    if (buildingLayer) {
      // Clear existing features
      buildingLayer.queryFeatures().then(result => {
        if (result.features.length > 0) {
          buildingLayer.applyEdits({
            deleteFeatures: result.features
          });
        }
      }).catch(error => {
        console.error("Error clearing features:", error);
      });

      // Add new features based on COCR registration status
      const legendFeatures = buildings.map((building, index) => {
        if (!building.coordinates[0] || !building.coordinates[1]) return null;
        
        return {
          geometry: new Point({
            x: building.coordinates[0],
            y: building.coordinates[1],
            spatialReference: { wkid: 2326 }
          }),
          attributes: {
            ObjectID: index + 1,
            status: building.hasCsvMatch ? "registered" : "unregistered",
            // Add other attributes for popup display
            id: building.id,
            name: building.name,
            address: building.address,
            district: building.district
          }
        };
      }).filter(f => f !== null);

      if (legendFeatures.length > 0) {
        buildingLayer.applyEdits({
          addFeatures: legendFeatures
        });
      }
    }
    
    // Also update regular graphics for better control over appearance
    buildings.forEach(building => {
      if (!building.coordinates[0] || !building.coordinates[1]) return;

      const point = new Point({
        x: building.coordinates[0],
        y: building.coordinates[1],
        spatialReference: new SpatialReference({ wkid: 2326 })
      });

      // Reverted to PictureMarkerSymbol for updateMapMarkers
      const symbol = new PictureMarkerSymbol({
        url: building.hasCsvMatch ? mapIcon2 : mapIcon, // Or use getMarkerIcon if preferred for consistency
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
      if (g.attributes && g.attributes.id && !currentIds.has(g.attributes.id)) {
        mapViewRef.current.graphics.remove(g);
      }
    });

    // Ensure selected building's marker is visible and on top
    if (selectedBuilding) {
      const selectedGraphic = mapViewRef.current.graphics.find(g => 
        g.attributes && g.attributes.id === selectedBuilding.id
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
            <Grid item xs={12} md={8}>
              <Autocomplete
                freeSolo
                options={suggestions}
                getOptionLabel={(option) => {
                  // Handle both string options and object options
                  return typeof option === 'string' ? option : option.label || '';
                }}
                inputValue={searchQuery}
                onInputChange={(event, newValue) => {
                  setSearchQuery(newValue);
                }}
                onChange={(event, newValue) => {
                  // Handle selection of an autocomplete option
                  if (newValue && typeof newValue === 'object' && newValue.data) {
                    handleBuildingSelect(newValue.data);
                  }
                }}
                filterOptions={(options) => options}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <LocationOnIcon sx={{ color: 'primary.main', mr: 1 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        {option.label}
                        {option.data?.hasCsvMatch && (
                          <Chip 
                            size="small" 
                            label="COCR Registered" 
                            color="primary" 
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                          />
                        )}
                      </Box>
                      {option.data && (
                        <Tooltip title={isBookmarked(option.data.id) ? "Remove bookmark" : "Add bookmark"}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(option.data);
                            }}
                          >
                            {isBookmarked(option.data.id) ? 
                              <BookmarkIcon color="primary" fontSize="small" /> : 
                              <BookmarkBorderIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Buildings"
                    variant="outlined"
                    fullWidth
                    onKeyDown={handleInputKeyDown}
                    onChange={handleInputChange}
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
            <Grid item xs={12} md={1}>
              <Button 
                variant="contained" 
                onClick={() => handleSearch(searchQuery, false)}
                fullWidth
                sx={{ height: '56px' }}
              >
                Search
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              <Tooltip title="Bookmarked Buildings">
                <Button
                  variant={showBookmarks ? "contained" : "outlined"}
                  color="secondary"
                  fullWidth
                  sx={{ height: '56px' }}
                  onClick={() => setShowBookmarks(!showBookmarks)}
                >
                  <BookmarksIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>

        {/* Bookmarks Panel */}
        {showBookmarks && (
          <Paper sx={{ mt: 2, p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="div">
                <BookmarksIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Bookmarked Buildings ({bookmarks.length})
              </Typography>
              {bookmarks.length > 0 && (
                <Tooltip title="Clear all bookmarks">
                  <IconButton color="error" onClick={clearAllBookmarks}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            
            {bookmarks.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No bookmarked buildings yet. Click the bookmark icon to save buildings for quick access.
              </Typography>
            ) : (
              <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                {bookmarks.map((building) => (
                  <ListItem 
                    key={building.id}
                    sx={{ 
                      borderBottom: '1px solid #eee',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={building.name || building.id}
                      secondary={
                        <Box component="span">
                          {building.address}
                          {building.hasCsvMatch && (
                            <Chip 
                              size="small" 
                              label="COCR Registered" 
                              color="primary" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View on map">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleBuildingSelect(building)}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove bookmark">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => toggleBookmark(building)}
                        >
                          <BookmarkIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}

        {/* SuggestedAddress List UI */}
        {suggestedList.length > 0 && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: '#f7f7f7', 
            borderRadius: 2, 
            boxShadow: 1,
            maxHeight: '250px', // Constrain max height
            overflowY: 'auto'   // Add vertical scroll if content overflows
          }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }} component="div">Suggested Addresses</Typography>
            <List>
              {suggestedList.map((item, idx) => {
                const eng = item.Address?.PremisesAddress?.EngPremisesAddress;
                const chi = item.Address?.PremisesAddress?.ChiPremisesAddress;
                // CSV match logic
                const csvMatch = csvData.find(csvItem =>
                  csvItem.EngName === eng?.BuildingName ||
                  csvItem.ChiName === chi?.BuildingName
                );
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
                    hasCsvMatch: !!csvMatch,
                    csvData: csvMatch
                  })}>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }} component="span">
                          {eng?.BuildingName} {eng?.EngStreet?.StreetName} {eng?.EngDistrict?.DcDistrict}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'block' }}>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {chi?.BuildingName} {chi?.ChiStreet?.StreetName} {chi?.ChiDistrict?.DcDistrict}
                          </Typography>
                          {csvMatch && (
                            <Chip label="COCR Registered" size="small" color="primary" sx={{ ml: 1, mt: 0.5, display: 'inline-flex' }} />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}

        {/* Map Container */}
        <Paper sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          m: 2,
          minHeight: '400px', // Adjust as needed, ensures map has some height
          display: 'flex', // Added to make inner div take full height if needed
          flexDirection: 'column' // Added for inner div
        }}>
          <div id="map-view" style={{ height: '100%', width: '100%', flexGrow: 1 }}></div> {/* Ensure this div takes full height of Paper */}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedBuilding.name}</Typography>
                <Tooltip title={isBookmarked(selectedBuilding.id) ? "Remove bookmark" : "Add to bookmarks"}>
                  <IconButton 
                    onClick={() => toggleBookmark(selectedBuilding)}
                    color={isBookmarked(selectedBuilding.id) ? "primary" : "default"}
                  >
                    {isBookmarked(selectedBuilding.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
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