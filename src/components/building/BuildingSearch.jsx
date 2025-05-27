import React, { useState, useEffect, useRef } from 'react';
import { 
  Box,
  TextField,
  Button,
  Paper,
  Typography,
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
  Tooltip,
  IconButton,
  ListItemIcon,
  Collapse,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
  Switch,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayersIcon from '@mui/icons-material/Layers';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import AppSidebar from '../common/AppSidebar';
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
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import LayerList from '@arcgis/core/widgets/LayerList';
import './BuildingSearch.css';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

// Icon Type Definitions
const ICON_TYPES = {
  DEFAULT: 'default', // Blue
  CSV_MATCHED: 'csv_matched', // Green for single CSV match
  CSV_MULTIPLE_MATCH: 'csv_multiple_match', // Orange for multiple CSV matches
  SUGGESTED: 'suggested', // Red
  SELECTED: 'selected', // Red (potentially larger or more prominent)
  BOOKMARKED: 'bookmarked', // Purple
};

// Base64 Icon Data Constants
const ICON_DATA_BLUE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUtMi41eiIgZmlsbD0iYmx1ZSIvPjwvc3ZnPg==";
const ICON_DATA_RED = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUtMi41eiIgZmlsbD0icmVkIi8+PC9zdmc+";
const ICON_DATA_GREEN = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUtMi41eiIgZmlsbD0iZ3JlZW4iLz48L3N2Zz4=";
const ICON_DATA_PURPLE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUtMi41eiIgZmlsbD0icHVycGxlIi8+PC9zdmc+";
const ICON_DATA_ORANGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUtMi41eiIgZmlsbD0ib3JhbmdlIi8+PC9zdmc+";

// Helper function to get icon data based on type
const getIconDataByType = (iconType) => {
  switch (iconType) {
    case ICON_TYPES.CSV_MATCHED:
      return ICON_DATA_GREEN;
    case ICON_TYPES.CSV_MULTIPLE_MATCH:
      return ICON_DATA_ORANGE; // Return new orange icon data
    case ICON_TYPES.SUGGESTED:
    case ICON_TYPES.SELECTED:
      return ICON_DATA_RED;
    case ICON_TYPES.BOOKMARKED:
      return ICON_DATA_PURPLE;
    case ICON_TYPES.DEFAULT:
    default:
      return ICON_DATA_BLUE;
  }
};

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

// Helper to build a unique label for an address suggestion
function buildAddressLabel(address) {
  if (!address) return '';
  const eng = address.PremisesAddress?.EngPremisesAddress || {};
  const chi = address.PremisesAddress?.ChiPremisesAddress || {};
  
  // Compose English address with more details
  const engParts = [];
  
  // Add building name if available
  if (eng.BuildingName) engParts.push(eng.BuildingName);
  
  // Add estate name if available
  if (eng.EngEstate?.EstateName) engParts.push(`${eng.EngEstate.EstateName} Estate`);
  
  // Add block information if available - fix [object Object] issue
  if (eng.EngBlock) engParts.push(`Block ${typeof eng.EngBlock === 'string' ? eng.EngBlock : 'Unknown'}`);
  
  // Add floor and unit if available
  if (eng.EngFloor) engParts.push(`Floor ${typeof eng.EngFloor === 'string' ? eng.EngFloor : 'Unknown'}`);
  if (eng.EngUnit) engParts.push(`Unit ${typeof eng.EngUnit === 'string' ? eng.EngUnit : 'Unknown'}`);
  
  // Add street address with building number if available
  if (eng.EngStreet) {
    let streetText = '';
    if (eng.EngStreet.BuildingNoFrom) {
      streetText += `${eng.EngStreet.BuildingNoFrom}`;
      if (eng.EngStreet.BuildingNoTo) streetText += `-${eng.EngStreet.BuildingNoTo}`;
    }
    if (eng.EngStreet.StreetName) {
      if (streetText) streetText += ' ';
      streetText += eng.EngStreet.StreetName;
    }
    if (streetText) engParts.push(streetText);
  }
  
  // Add location/area name if available
  if (eng.EngStreet?.LocationName) engParts.push(eng.EngStreet.LocationName);
  
  // Add district if available
  if (eng.EngDistrict?.DcDistrict) engParts.push(eng.EngDistrict.DcDistrict);
  
  // Chinese parts processing - fix [object Object] issue
  const chiParts = [];
  
  // Add building name if available
  if (chi.BuildingName) chiParts.push(chi.BuildingName);
  
  // Add estate name if available
  if (chi.ChiEstate?.EstateName) chiParts.push(chi.ChiEstate.EstateName);
  
  // Add block information if available
  if (chi.ChiBlock) chiParts.push(`${typeof chi.ChiBlock === 'string' ? chi.ChiBlock : '未知'}座`);
  
  // Add floor and unit if available
  if (chi.ChiFloor) chiParts.push(`${typeof chi.ChiFloor === 'string' ? chi.ChiFloor : '未知'}樓`);
  if (chi.ChiUnit) chiParts.push(`${typeof chi.ChiUnit === 'string' ? chi.ChiUnit : '未知'}室`);
  
  // Add street address with building number if available
  if (chi.ChiStreet) {
    let streetText = '';
    if (chi.ChiStreet.BuildingNoFrom) {
      streetText += `${chi.ChiStreet.BuildingNoFrom}`;
      if (chi.ChiStreet.BuildingNoTo) streetText += `-${chi.ChiStreet.BuildingNoTo}`;
    }
    if (chi.ChiStreet.StreetName) {
      if (streetText) streetText += '號 ';
      streetText += chi.ChiStreet.StreetName;
    }
    if (streetText) chiParts.push(streetText);
  }
  
  // Add location/area name if available
  if (chi.ChiStreet?.LocationName) chiParts.push(chi.ChiStreet.LocationName);
  
  // Add district if available
  if (chi.ChiDistrict?.DcDistrict) chiParts.push(chi.ChiDistrict.DcDistrict);
  
  return `${engParts.join(' ')}${chiParts.length ? ' / ' + chiParts.join(' ') : ''}`;
}

const BuildingSearch = () => {
  // Existing state variables
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
  const [addressPanelOpen, setAddressPanelOpen] = useState(true);
  const mapViewRef = useRef(null);
  const mapRef = useRef(null);
  const legendRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchControllerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const [suggestedList, setSuggestedList] = useState([]);
  const componentMountedRef = useRef(true);
  const [lotLayerVisible, setLotLayerVisible] = useState(false);
  const lotLayerRef = useRef(null);
  
  // New state variables for bookmark functionality
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showBookmarkedBuildingsLayer, setShowBookmarkedBuildingsLayer] = useState(false);
  const [deleteBookmarkDialogOpen, setDeleteBookmarkDialogOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

  // New state variables for bookmark groups
  const [bookmarkGroups, setBookmarkGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);

  // Add at the top of the component, alongside other state declarations
  const [selectedGroupsInDialog, setSelectedGroupsInDialog] = useState([]);

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
  const safeSetBookmarkGroups = safeSetState(setBookmarkGroups);

  // Load bookmarks and bookmark groups from sessionStorage on initial render
  useEffect(() => {
    try {
      const savedBookmarks = sessionStorage.getItem('buildingBookmarks');
      if (savedBookmarks) {
        safeSetBookmarks(JSON.parse(savedBookmarks));
      }
      
      const savedGroups = sessionStorage.getItem('buildingBookmarkGroups');
      if (savedGroups) {
        safeSetBookmarkGroups(JSON.parse(savedGroups));
      }
    } catch (error) {
      console.error('Error loading bookmarks from sessionStorage:', error);
    }
  }, [safeSetBookmarks, safeSetBookmarkGroups]);

  // Update the useEffect for bookmarks storage to prevent re-adding after deletion
  useEffect(() => {
    // Only if component is mounted to prevent memory leaks
    if (componentMountedRef.current) {
      try {
        if (bookmarks && bookmarks.length > 0) {
          sessionStorage.setItem('buildingBookmarks', JSON.stringify(bookmarks));
        } else if (bookmarks && bookmarks.length === 0) {
          // Always remove storage when bookmarks are empty - don't check if it exists first
          sessionStorage.removeItem('buildingBookmarks');
        }
      } catch (error) {
        console.error("Error syncing bookmarks with sessionStorage:", error);
      }
    }
  }, [bookmarks]);

  // Update the useEffect for bookmark groups storage
  useEffect(() => {
    // Only if component is mounted to prevent memory leaks
    if (componentMountedRef.current) {
      try {
        if (bookmarkGroups && bookmarkGroups.length > 0) {
          sessionStorage.setItem('buildingBookmarkGroups', JSON.stringify(bookmarkGroups));
        } else if (bookmarkGroups && bookmarkGroups.length === 0) {
          // Always remove storage when groups are empty - don't check if it exists first
          sessionStorage.removeItem('buildingBookmarkGroups');
        }
      } catch (error) {
        console.error("Error syncing bookmark groups with sessionStorage:", error);
      }
    }
  }, [bookmarkGroups]);

  // Function to create a unique identifier for a building
  const getUniqueId = (building) => {
    // Add a timestamp-based uniqueId if not already present
    if (!building.uniqueId) {
      // Use GeoAddress as the primary unique identifier if available
      if (building.geoAddress) {
        return `geo_${building.geoAddress}`;
      }
      // Fallback 1: Use coordinates for buildings without GeoAddress
      else if (building.coordinates && building.coordinates.length === 2) {
        return `loc_${building.name || 'unnamed'}_${building.coordinates[0]}_${building.coordinates[1]}_${Date.now()}`;
      }
      // Fallback 2: Use name + address + timestamp
      else if (building.address && building.name) {
        return `addr_${building.name}_${building.address}_${Date.now()}`;
      }
      // Last fallback to original id + timestamp
      return `id_${building.id || 'unknown'}_${Date.now()}`;
    }
    return building.uniqueId;
  };

  // Function to open bookmark dialog for a building
  const openBookmarkDialog = (building, isEditing = false) => {
    // Create a unique ID that differentiates buildings with the same name
    const uniqueId = getUniqueId(building);
    
    // Set the building object with uniqueId
    const buildingWithUniqueId = { ...building, uniqueId };
    
    if (isEditing) {
      // Find the existing bookmark
      const existingBookmark = bookmarks.find(b => getUniqueId(b) === uniqueId);
      if (existingBookmark) {
        setBookmarkName(existingBookmark.customName || existingBookmark.name || '');
        setEditingBookmark(existingBookmark);
      }
    } else {
      // Default name for new bookmark
      setBookmarkName(building.name || 'Building Bookmark');
      setEditingBookmark(null);
    }
    
    // Store the building data for the bookmark dialog
    sessionStorage.setItem('bookmarkBuilding', JSON.stringify(buildingWithUniqueId));
    
    // Initialize the selected groups with any groups the building is already in
    const initialSelectedGroups = bookmarkGroups
      .filter(group => group.bookmarks.some(b => getUniqueId(b) === uniqueId))
      .map(group => group.id);
    
    setSelectedGroupsInDialog(initialSelectedGroups);
    
    // Open the dialog
    setBookmarkDialogOpen(true);
  };

  // Function to toggle bookmark status
  const toggleBookmark = (building) => {
    // Create a unique ID that differentiates buildings with the same name
    const uniqueId = getUniqueId(building);
    
    // Check if building is already bookmarked
    const isAlreadyBookmarked = bookmarks.some(b => getUniqueId(b) === uniqueId);
    
    if (isAlreadyBookmarked) {
      // If bookmarked, open confirmation dialog for deletion
      setBookmarkToDelete(building);
      setDeleteBookmarkDialogOpen(true);
    } else {
      // If not bookmarked, open dialog to add bookmark with name
      openBookmarkDialog(building, false);
    }
  };

  // Function to check if a building is bookmarked
  const isBookmarked = (buildingOrId) => {
    // Check if we got a building object or just an ID
    if (typeof buildingOrId === 'object') {
      return bookmarks.some(b => getUniqueId(b) === getUniqueId(buildingOrId));
    }
    
    // If we just got an ID (string), check if any bookmark has this ID or uniqueId
    // This maintains backward compatibility
    return bookmarks.some(b => 
      b.id === buildingOrId || 
      b.uniqueId === buildingOrId
    );
  };
  
  // Function to clear all bookmarks
  const clearAllBookmarks = () => {
    // Create a new empty array for bookmarks
    safeSetBookmarks([]);
    
    // Also clear bookmarks from all groups
    const updatedGroups = bookmarkGroups.map(group => ({
      ...group,
      bookmarks: [] // Clear all bookmarks in each group
    }));
    
    // Update groups state
    safeSetBookmarkGroups(updatedGroups);
    
    // Clear sessionStorage directly to prevent race conditions
    try {
      sessionStorage.removeItem('buildingBookmarks');
    } catch (error) {
      console.error("Error clearing bookmarks from sessionStorage:", error);
    }
    
    // Also update map if layer is visible
    if (showBookmarkedBuildingsLayer) {
      setTimeout(() => {
        if (componentMountedRef.current) {
          displayBookmarkedBuildingsOnMap([]);
        }
      }, 300);
    }
    
    // Close the delete dialog
    setDeleteBookmarkDialogOpen(false);
  };

  // Update handleConfirmBookmark to handle selected groups from dialog state
  const handleConfirmBookmark = () => {
    try {
      // Get the building data from session storage
      const buildingData = JSON.parse(sessionStorage.getItem('bookmarkBuilding'));
      
      if (!buildingData) {
        setBookmarkDialogOpen(false);
        return;
      }
      
      let updatedBookmarks;
      
      if (editingBookmark) {
        // Update existing bookmark
        updatedBookmarks = bookmarks.map(bookmark => {
          if (getUniqueId(bookmark) === getUniqueId(editingBookmark)) {
            return { 
              ...bookmark, 
              customName: bookmarkName 
            };
          }
          return bookmark;
        });
      } else {
        // Add new bookmark with custom name and ensure uniqueId is set
        const newBookmark = {
          ...buildingData,
          customName: bookmarkName,
          uniqueId: getUniqueId(buildingData),
          timestamp: Date.now() // Add timestamp for additional uniqueness
        };
        
        // Create a completely new array to ensure state update is detected
        updatedBookmarks = [...bookmarks, newBookmark];
      }
      
      // Important: Update sessionStorage BEFORE updating React state
      // This ensures storage is consistent when state triggers re-render
      try {
        sessionStorage.setItem('buildingBookmarks', JSON.stringify(updatedBookmarks));
      } catch (error) {
        console.error("Error saving bookmarks to sessionStorage:", error);
      }
      
      // Now update the React state with the new bookmarks array
      safeSetBookmarks(updatedBookmarks);
      
      // Handle group assignments after bookmark is saved
      if (selectedGroupsInDialog.length > 0 && buildingData) {
        // Create a copy of the current groups
        const buildingUniqueId = getUniqueId(buildingData);
        const updatedGroups = [...bookmarkGroups];
        let groupsChanged = false;
        
        // Process group memberships separately to avoid race conditions
        updatedGroups.forEach((group, index) => {
          const isSelected = selectedGroupsInDialog.includes(group.id);
          const isCurrentlyInGroup = group.bookmarks.some(b => getUniqueId(b) === buildingUniqueId);
          
          // Only update groups that need changes
          if (isSelected !== isCurrentlyInGroup) {
            groupsChanged = true;
            
            if (isSelected) {
              // Add to group
              updatedGroups[index] = {
                ...group,
                bookmarks: [...group.bookmarks, {
                  ...buildingData,
                  customName: bookmarkName,
                  uniqueId: buildingUniqueId,
                  timestamp: Date.now()
                }]
              };
            } else {
              // Remove from group
              updatedGroups[index] = {
                ...group,
                bookmarks: group.bookmarks.filter(b => getUniqueId(b) !== buildingUniqueId)
              };
            }
          }
        });
        
        // Only update groups state if changes were made
        if (groupsChanged) {
          // Update sessionStorage first
          try {
            sessionStorage.setItem('buildingBookmarkGroups', JSON.stringify(updatedGroups));
          } catch (error) {
            console.error("Error saving bookmark groups to sessionStorage:", error);
          }
          
          // Then update React state
          safeSetBookmarkGroups(updatedGroups);
        }
      }
      
      // Close dialog and clean up
      setBookmarkDialogOpen(false);
      sessionStorage.removeItem('bookmarkBuilding');
      setSelectedGroupsInDialog([]);
      
      // If bookmark layer is visible, update it with delay to ensure state is updated
      if (showBookmarkedBuildingsLayer) {
        setTimeout(() => {
          if (componentMountedRef.current) {
            displayBookmarkedBuildingsOnMap(updatedBookmarks);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      // Close dialog even on error to prevent UI getting stuck
      setBookmarkDialogOpen(false);
    }
  };

  // Function to edit a bookmark
  const editBookmark = (building) => {
    openBookmarkDialog(building, true);
  };

  // Function to delete bookmark after confirmation
  const handleDeleteBookmark = () => {
    if (bookmarkToDelete) {
      const uniqueId = getUniqueId(bookmarkToDelete);
      
      // Create a completely new array for bookmarks
      const updatedBookmarks = bookmarks.filter(b => getUniqueId(b) !== uniqueId);
      
      // Create a completely new array for groups, ensuring any references to the deleted bookmark are removed
      const updatedGroups = bookmarkGroups.map(group => {
        // Check if this group contains the building
        const containsBuilding = group.bookmarks.some(b => getUniqueId(b) === uniqueId);
        
        if (containsBuilding) {
          // Return group with the building filtered out
          return {
            ...group,
            bookmarks: group.bookmarks.filter(b => getUniqueId(b) !== uniqueId)
          };
        }
        
        // Otherwise return the group unchanged
        return group;
      });
      
      // Batch state updates to avoid race conditions
      // First update the bookmarks
      safeSetBookmarks(updatedBookmarks);
      
      // Then update groups
      safeSetBookmarkGroups(updatedGroups);
      
      // Update bookmark layer if visible - with delay to ensure state is updated first
      if (showBookmarkedBuildingsLayer) {
        setTimeout(() => {
          if (componentMountedRef.current) {
            displayBookmarkedBuildingsOnMap(updatedBookmarks);
          }
        }, 300);
      }
    }
    
    // Close dialog and cleanup
    setDeleteBookmarkDialogOpen(false);
    setBookmarkToDelete(null);
  };

  // Function to display all bookmarked buildings on map
  const displayBookmarkedBuildingsOnMap = (bookmarksToShow = null) => {
    if (!mapViewRef.current || !componentMountedRef.current) return;
    
    // Use provided bookmarks or current state
    const bmList = bookmarksToShow || bookmarks;
    
    // Clear existing bookmarked building graphics
    mapViewRef.current.graphics.removeMany(
      mapViewRef.current.graphics.filter(g => g.attributes && g.attributes.isBookmarked)
    );
    
    if (!showBookmarkedBuildingsLayer) return;
    
    // Add markers for all bookmarks
    bmList.forEach(building => {
      if (!building.coordinates || !Array.isArray(building.coordinates) || 
          building.coordinates.length !== 2 ||
          isNaN(Number(building.coordinates[0])) ||
          isNaN(Number(building.coordinates[1]))) {
        return;
      }
      
      const point = new Point({
        x: Number(building.coordinates[0]),
        y: Number(building.coordinates[1]),
        spatialReference: new SpatialReference({ wkid: 2326 })
      });
      
      // Use green icon for bookmarked buildings - same base icon, green color
      const symbol = new PictureMarkerSymbol({
        url: getIconDataByType(ICON_TYPES.BOOKMARKED),
        width: "24px",
        height: "24px",
        yoffset: 12
      });
      
      const displayName = building.customName || building.name || "Bookmarked Building";
      const uniqueId = getUniqueId(building);
      
      const graphic = new Graphic({
        geometry: point,
        symbol: symbol,
        attributes: {
          ...building,
          uniqueId: uniqueId, // Ensure uniqueId is set
          isBookmarked: true,
          displayName: displayName
        },
        visible: true,
        popupTemplate: {
          title: displayName,
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "nameZH", label: "Building Name (ZH)" },
                { fieldName: "address", label: "Address" },
                { fieldName: "addressZH", label: "Address (ZH)" },
                { fieldName: "district", label: "District" },
                { fieldName: "districtZH", label: "District (ZH)" },
                { fieldName: "geoAddress", label: "GeoAddress" },
                { fieldName: "latitude", label: "Latitude" },
                { fieldName: "longitude", label: "Longitude" }
              ]
            }
          ],
          actions: [
            {
              title: "Edit Name",
              id: "edit-bookmark",
              className: "esri-icon-edit"
            }
          ]
        }
      });
      
      mapViewRef.current.graphics.add(graphic);
    });
    
    // If we have bookmarks, zoom to show all of them
    if (bmList.length > 0) {
      const bookmarkedGraphics = mapViewRef.current.graphics.filter(
        g => g.attributes && g.attributes.isBookmarked
      );
      
      if (bookmarkedGraphics.length > 0) {
        mapViewRef.current.goTo(bookmarkedGraphics)
          .catch(err => console.warn("Zoom failed:", err));
      }
    }
  };

  // Effect to toggle bookmarked buildings layer when state changes
  useEffect(() => {
    if (mapViewRef.current && initialLoadComplete) {
      displayBookmarkedBuildingsOnMap();
    }
  }, [showBookmarkedBuildingsLayer, initialLoadComplete]);

  // Main initialization effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              url: mapLabelVTUrl,
              title: "Map Labels"
            }));

            // Create a feature layer with proper renderer for the legend
            const buildingLayer = new FeatureLayer({
              title: "Buildings",
              url: "https://portal.csdi.gov.hk/server/rest/services/open/landsd_rcd_1637211194312_35158/MapServer/0",
              outFields: ["*"],
              objectIdField: "OBJECTID",
              visible: false, // Set to true for visibility
              definitionExpression: "1=1", // Show all features
              editable: false, // Explicitly disable editing capabilities
              minScale: 15000, // Only show when zoomed in beyond 1:value scale
              renderer: {
                type: "unique-value",
                field: "status", // You may want to update this field to match the actual field in the CSDI building layer
                defaultSymbol: new PictureMarkerSymbol({
                  url: getIconDataByType(ICON_TYPES.DEFAULT),
                  width: "24px",
                  height: "24px",
                  yoffset: 12
                }),
                uniqueValueInfos: [
                  {
                    value: "registered",
                    symbol: new PictureMarkerSymbol({
                      url: getIconDataByType(ICON_TYPES.CSV_MATCHED),
                      width: "24px",
                      height: "24px",
                      yoffset: 12
                    }),
                    label: "COCR Registered"
                  },
                  {
                    value: "unregistered",
                    symbol: new PictureMarkerSymbol({
                      url: getIconDataByType(ICON_TYPES.DEFAULT),
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

            // Add lot layer from CSDI portal
            lotLayerRef.current = new MapImageLayer({
              url: "https://portal.csdi.gov.hk/server/rest/services/open/landsd_rcd_1637217253134_22729/MapServer",
              title: "Land Lots",
              visible: lotLayerVisible,
              opacity: 0.7,
              sublayers: [
                {
                  id: 0,
                  title: "Land Lots",
                  outFields: ["OBJECTID", "PRN", "LOTCODE", "LOTNO", "LOTNAME", "SURVEYAREA", "AREAUNIT"],
                  popupTemplate: {
                    title: "Land Lot Information",
                    outFields: ["*"],
                    content: function(feature) {
                      // Get the feature attributes
                      const attributes = feature.graphic.attributes;

                      // Create a div element to hold our content
                      const div = document.createElement("div");
                      
                      // Create a loading indicator
                      const loadingDiv = document.createElement("div");
                      loadingDiv.innerHTML = "<div style='text-align: center; padding: 20px;'><b>Loading related data...</b></div>";
                      div.appendChild(loadingDiv);
                      
                      // Create the main content div (initially empty)
                      const contentDiv = document.createElement("div");
                      div.appendChild(contentDiv);
                      
                      // Show basic information immediately
                      contentDiv.innerHTML = `
                        <table class="esri-widget__table">
                          <tr><th>Object ID</th><td>${attributes.OBJECTID}</td></tr>
                        </table>
                        <div id="relatedInfo"></div>
                      `;
                      
                      // Now fetch the related records from LOTLANDINFO.json
                      const objectId = attributes.OBJECTID;
                      
                      if (objectId) {
                        // Query the local LOTLANDINFO.json file
                        const relatedUrl = "/LOTLANDINFO_filtered.json"; // Changed to local JSON file
                        
                        fetch(relatedUrl) // Removed query parameters
                          .then(response => response.json())
                          .then(jsonData => {
                            // Remove loading indicator
                            div.removeChild(loadingDiv);
                            
                            // Handle the related data
                            const relatedInfoDiv = contentDiv.querySelector("#relatedInfo");
                            
                            // Find the matching record in the JSON data using OBJECTID
                            // Assuming LOTLANDINFO.json is an array of objects, and each object has an OBJECTID field
                            const relatedRecord = jsonData.find(record => record.OBJECTID === objectId);
                            
                            if (relatedRecord) {
                              const relatedAttributes = relatedRecord; // Use the found record directly
                              
                              // Add the related information to our content
                              let relatedHTML = `
                                <h3 style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">Detailed Information</h3>
                                <table class="esri-widget__table">
                              `;
                              
                              // Add LOTDISPLAYNAME if available
                              if (relatedAttributes.LOTDISPLAYNAME) {
                                relatedHTML += `<tr><th>Lot Display Name</th><td>${relatedAttributes.LOTDISPLAYNAME}</td></tr>`;
                              }
                              
                              // Add LOTNUMBER if available
                              if (relatedAttributes.LOTNUMBER) {
                                relatedHTML += `<tr><th>Lot Number</th><td>${relatedAttributes.LOTNUMBER}</td></tr>`;
                              }
                              
                              // Add other useful fields from LOTLANDINFO
                              const additionalFields = [
                                { field: "LANDCLASS", label: "Land Class" },
                                { field: "AREAFIGURE", label: "Area Figure" },
                                { field: "VALIDFROM", label: "Valid From" },
                                { field: "VALIDTO", label: "Valid To" }
                              ];
                              
                              additionalFields.forEach(item => {
                                if (relatedAttributes[item.field] !== undefined && relatedAttributes[item.field] !== null) {
                                  // Format dates if needed
                                  let value = relatedAttributes[item.field];
                                  if (item.field === "VALIDFROM" || item.field === "VALIDTO") {
                                    // Convert from epoch milliseconds if it's a number
                                    if (typeof value === "number") {
                                      value = new Date(value).toLocaleDateString();
                                    }
                                  }
                                  relatedHTML += `<tr><th>${item.label}</th><td>${value}</td></tr>`;
                                }
                              });
                              
                              relatedHTML += `</table>`;
                              relatedInfoDiv.innerHTML = relatedHTML;
                            } else {
                              relatedInfoDiv.innerHTML = `
                                <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                                  <p>No related detail information found for OBJECTID: ${objectId}.</p>
                                </div>
                              `;
                            }
                          })
                          .catch(error => {
                            // Remove loading indicator
                            div.removeChild(loadingDiv);
                            
                            // Show error message
                            const relatedInfoDiv = contentDiv.querySelector("#relatedInfo");
                            relatedInfoDiv.innerHTML = `
                              <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; color: #d9534f;">
                                <p>Error loading related information: ${error.message}</p>
                              </div>
                            `;
                            console.error("Error fetching related data:", error);
                          });
                      } else {
                        // No OBJECTID available to query related data
                        div.removeChild(loadingDiv);
                        
                        const relatedInfoDiv = contentDiv.querySelector("#relatedInfo");
                        relatedInfoDiv.innerHTML = `
                          <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                            <p>No OBJECTID available to fetch detailed information.</p>
                          </div>
                        `;
                      }
                      
                      return div;
                    }
                  }
                }
              ]
            });
            
            if (!componentMountedRef.current) return; // Exit if component unmounted
            mapRef.current.add(lotLayerRef.current);

            // Add legend widget with proper configuration - Wrap with try/catch
            try {
              if (!componentMountedRef.current) return; // Exit if component unmounted
              
              // Create legend with error handling
              try {
                legendRef.current = new Legend({
                  view: mapViewRef.current,
                  layerInfos: [
                    {
                      layer: buildingLayer,
                      title: "Building Registration Status"
                    },
                    {
                      layer: lotLayerRef.current,
                      title: "Land Lots"
                    }
                  ]
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

            // Add layer list widget
            try {
              if (!componentMountedRef.current) return; // Exit if component unmounted
              
              const layerListWidget = new LayerList({
                view: mapViewRef.current,
                listItemCreatedFunction: (event) => {
                  // Add additional actions or styling to layer list items
                  const item = event.item;
                  if (item.layer.title === "Land Lots") {
                    item.panel = {
                      content: "panel",
                      open: false
                    };
                  }
                }
              });
              
              const layerListExpand = new Expand({
                view: mapViewRef.current,
                content: layerListWidget,
                expandIcon: "layers",
                expandTooltip: "Layer List"
              });
              
              mapViewRef.current.ui.add(layerListExpand, "top-right");
            } catch (layerListError) {
              if (layerListError.name !== 'AbortError' && componentMountedRef.current) {
                console.error('Error creating layer list widget:', layerListError);
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

  // Effect to toggle lot layer visibility when state changes
  useEffect(() => {
    if (lotLayerRef.current) {
      lotLayerRef.current.visible = lotLayerVisible;
    }
  }, [lotLayerVisible]);



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
        // Get GeoAddress as primary identifier
        const geoAddress = address.Address?.PremisesAddress?.GeoAddress || '';
        
        // CSV match logic - Updated to match by Easting and Northing
        const apiEastingStr = address.Address?.PremisesAddress?.GeospatialInformation?.Easting;
        const apiNorthingStr = address.Address?.PremisesAddress?.GeospatialInformation?.Northing;

        const apiEasting = parseInt(apiEastingStr?.replace(/,/g, ''), 10);
        const apiNorthing = parseInt(apiNorthingStr?.replace(/,/g, ''), 10);

        let matchingCsvRows = [];
        if (!isNaN(apiEasting) && !isNaN(apiNorthing)) {
          matchingCsvRows = csvData.filter(csvItem => 
            !isNaN(csvItem.Easting) && !isNaN(csvItem.Northing) &&
            Math.abs(csvItem.Easting - apiEasting) <= 1 && 
            Math.abs(csvItem.Northing - apiNorthing) <= 1
          );
        } else {
          // If API coordinates are not valid, fall back to name matching or no match
          // For now, we will consider it no match by coordinates
          // Alternatively, you could re-introduce name matching here as a fallback:
          // const buildingEngName = address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName;
          // const buildingChiName = address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName;
          // matchingCsvRows = csvData.filter(csvItem =>
          //  (buildingEngName && csvItem.EngName === buildingEngName) ||
          //  (buildingChiName && csvItem.ChiName === buildingChiName)
          // );
        }

        let csvMatchType = 'NONE';
        if (matchingCsvRows.length === 1) {
          csvMatchType = 'SINGLE';
        } else if (matchingCsvRows.length > 1) {
          csvMatchType = 'MULTIPLE';
        }
        
        return {
          label,
          engDistrict,
          chiDistrict,
          data: {
            id: geoAddress || address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
            name: address.Address?.PremisesAddress?.EngPremisesAddress?.BuildingName || '',
            nameZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.BuildingName || '',
            address: address.Address?.PremisesAddress?.EngPremisesAddress?.EngStreet?.StreetName || '',
            addressZH: address.Address?.PremisesAddress?.ChiPremisesAddress?.ChiStreet?.StreetName || '',
            district: engDistrict,
            districtZH: chiDistrict,
            // Include building numbers if available
            buildingNoFrom: address.Address?.PremisesAddress?.EngPremisesAddress?.EngStreet?.BuildingNoFrom || '',
            buildingNoTo: address.Address?.PremisesAddress?.EngPremisesAddress?.EngStreet?.BuildingNoTo || '',
            // Include block and estate info
            block: address.Address?.PremisesAddress?.EngPremisesAddress?.EngBlock || '',
            estate: address.Address?.PremisesAddress?.EngPremisesAddress?.EngEstate?.EstateName || '',
            coordinates: [
              address.Address?.PremisesAddress?.GeospatialInformation?.Easting,
              address.Address?.PremisesAddress?.GeospatialInformation?.Northing
            ],
            // Include latitude and longitude information from GeospatialInformation
            latitude: address.Address?.PremisesAddress?.GeospatialInformation?.Latitude || '',
            longitude: address.Address?.PremisesAddress?.GeospatialInformation?.Longitude || '',
            geoAddress: geoAddress,
            matchingCsvRows: matchingCsvRows, // Store all matches
            csvMatchType: csvMatchType, // Store the type of match
            // Keep COCR_No from the first match if needed for display, or adapt display logic
            COCR_No: matchingCsvRows.length > 0 ? matchingCsvRows[0].COCR_No : null
            // Removed: hasCsvMatch: !!csvMatch,
            // Removed: csvData: csvMatch 
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

      // Remove duplicates based on GeoAddress for more accurate deduplication
      let uniqueSuggestions = [];
      if (Array.isArray(filteredSuggestions)) {
        const geoAddressEntries = filteredSuggestions.map(s => [s.data.geoAddress || s.label, s]);
        const uniqueMap = new window.Map(geoAddressEntries);
        uniqueSuggestions = [...uniqueMap.values()]; 
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
    setSelectedBuilding(building);

    if (!mapViewRef.current) {
      console.error('mapViewRef.current is null in handleBuildingSelect');
      return;
    }

    if (
      !building ||
      !Array.isArray(building.coordinates) ||
      building.coordinates.length !== 2 ||
      isNaN(Number(building.coordinates[0])) ||
      isNaN(Number(building.coordinates[1]))
    ) {
      console.error('Invalid building data or coordinates for map centering');
      return;
    }

    const easting = Number(building.coordinates[0]);
    const northing = Number(building.coordinates[1]);

    // Create point geometry
    const point = new Point({
      x: easting,
      y: northing,
      spatialReference: new SpatialReference({ wkid: 2326 })
    });

    // Create marker symbol for selected building - explicitly use RED for selected/suggested buildings
    const selectedSymbol = new PictureMarkerSymbol({
      url: getIconDataByType(
        isBookmarked(building) ? ICON_TYPES.BOOKMARKED :
        building.csvMatchType === 'MULTIPLE' ? ICON_TYPES.CSV_MULTIPLE_MATCH :
        building.csvMatchType === 'SINGLE' ? ICON_TYPES.CSV_MATCHED :
        ICON_TYPES.SELECTED
      ),
      width: "24px",
      height: "24px",
      yoffset: 12
    });

    // First, add or update the marker
    // Use GeoAddress as primary identifier, fall back to id when GeoAddress is not available
    const uniqueId = building.geoAddress || building.id;
    let graphic = mapViewRef.current.graphics.find(g => 
      g.attributes && (
        (building.geoAddress && g.attributes.geoAddress === building.geoAddress) ||
        (building.id && g.attributes.id === building.id)
      )
    );

    if (graphic) {
      graphic.geometry = point; // Update geometry
      graphic.symbol = selectedSymbol;
      graphic.visible = true; // Ensure it's visible
      mapViewRef.current.graphics.reorder(graphic, mapViewRef.current.graphics.length - 1);
    } else {
      graphic = new Graphic({
        geometry: point,
        symbol: selectedSymbol,
        attributes: building, // Ensure building has an ID or GeoAddress
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
                { fieldName: "districtZH", label: "District (ZH)" },
                { fieldName: "geoAddress", label: "GeoAddress" },
                { fieldName: "latitude", label: "Latitude" },
                { fieldName: "longitude", label: "Longitude" }
              ]
            }
          ]
        }
      });
      mapViewRef.current.graphics.add(graphic);
    }

    // Ensure the graphic is visible before zooming
    graphic.visible = true;

    mapViewRef.current.goTo({
      target: point,
      zoom: 17, // Consider making zoom level more dynamic or ensuring scale is appropriate
    }, {
      duration: 1000,
      easing: "ease-out"
    }).then(() => {
      // Ensure the graphic is still visible and on top after zoom
      graphic.visible = true;
      mapViewRef.current.graphics.reorder(graphic, mapViewRef.current.graphics.length - 1);
    }).catch(error => {
      console.error("Error during map navigation (goTo):", error);
    });
  };

  const updateMapMarkers = (buildings) => {
    if (!mapViewRef.current) return;

    // Find the buildingLayer - we'll just use it for legend, not for actual features
    const buildingLayer = mapRef.current.layers.find(layer => 
      layer.title === "Buildings" && layer.type === "feature"
    );

    // Keep track of existing graphics using a regular object
    const existingGraphics = {};
    mapViewRef.current.graphics.forEach(g => {
      if (g.attributes && g.attributes.id) {
        existingGraphics[g.attributes.id] = g;
      }
    });
    
    // Also update regular graphics for better control over appearance
    buildings.forEach(building => {
      if (!building.coordinates[0] || !building.coordinates[1]) return;

      const point = new Point({
        x: building.coordinates[0],
        y: building.coordinates[1],
        spatialReference: new SpatialReference({ wkid: 2326 })
      });

      // Always use red for suggested buildings in search results
      const symbol = new PictureMarkerSymbol({
        url: getIconDataByType(
          isBookmarked(building) ? ICON_TYPES.BOOKMARKED :
          building.csvMatchType === 'MULTIPLE' ? ICON_TYPES.CSV_MULTIPLE_MATCH :
          building.csvMatchType === 'SINGLE' ? ICON_TYPES.CSV_MATCHED :
          ICON_TYPES.SUGGESTED
        ),
        width: "24px",
        height: "24px",
        yoffset: 12
      });

      // Use GeoAddress as primary identifier with fallback to ID
      const uniqueId = building.geoAddress || building.id;
      const existingGraphic = existingGraphics[uniqueId] || 
                              (building.geoAddress && existingGraphics[building.geoAddress]) || 
                              (building.id && existingGraphics[building.id]);
                              
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
                  { fieldName: "districtZH", label: "District (ZH)" },
                  { fieldName: "geoAddress", label: "GeoAddress" },
                  { fieldName: "latitude", label: "Latitude" },
                  { fieldName: "longitude", label: "Longitude" }
                ]
              }
            ]
          }
        });
        mapViewRef.current.graphics.add(graphic);
      }
    });

    // Remove graphics that are no longer in the results
    // Use GeoAddress for identification when available
    const currentIds = new Set();
    buildings.forEach(b => {
      if (b.geoAddress) currentIds.add(b.geoAddress);
      if (b.id) currentIds.add(b.id);
    });
    
    mapViewRef.current.graphics.forEach(g => {
      if (g.attributes) {
        const graphicId = g.attributes.geoAddress || g.attributes.id;
        if (graphicId && !currentIds.has(graphicId)) {
          mapViewRef.current.graphics.remove(g);
        }
      }
    });

    // Ensure selected building's marker is visible and on top
    if (selectedBuilding) {
      // Find by GeoAddress first, then fall back to ID
      const selectedGraphic = mapViewRef.current.graphics.find(g => 
        g.attributes && (
          (selectedBuilding.geoAddress && g.attributes.geoAddress === selectedBuilding.geoAddress) ||
          (selectedBuilding.id && g.attributes.id === selectedBuilding.id)
        )
      );
      
      if (selectedGraphic) {
        selectedGraphic.visible = true;
        mapViewRef.current.graphics.reorder(selectedGraphic, mapViewRef.current.graphics.length - 1);
      }
    }
  };

  // CSV parsing function
  const parseCSV = (csv) => {
    // Remove debug logging to clean up console
    // console.log("CSV Headers:", csv.split('\n')[0]);
    const rows = csv.split('\n')
      .slice(1) // Skip header row
      .filter(row => row.trim()); // Filter empty rows
    
    // console.log(`Total CSV rows: ${rows.length}`);
    
    // Clean up debug statements
    // rows.slice(0, 5).forEach((row, index) => {
    //   console.log(`Row ${index + 1}:`, row);
    // });
    
    return rows.map((row, rowIndex) => {
      // Split by comma but respect quoted fields
      let inQuotes = false;
      let currentToken = '';
      const columns = [];
      
      // Manual CSV parsing to handle quoted fields correctly
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          columns.push(currentToken);
          currentToken = '';
        } else {
          currentToken += char;
        }
      }
      
      // Add the last token
      columns.push(currentToken);
      
      // Clean up quotes from each column value
      const cleanedColumns = columns.map(col => col.replace(/^"|"$/g, ''));
      
      // Debug specific problematic rows if needed
      // if (cleanedColumns[9]?.includes('831989') || cleanedColumns[12]?.includes('825021')) {
      //   console.log(`Fixed parsing for row ${rowIndex + 1}:`);
      //   console.log(`  Easting (index 9): "${cleanedColumns[9]}"`);
      //   console.log(`  Northing (index 12): "${cleanedColumns[12]}"`);
      // }
      
      return {
        EngName: cleanedColumns[0],
        ChiName: cleanedColumns[1],
        EngAddress: cleanedColumns[2],
        ChiAddress: cleanedColumns[3],
        COCR_No: cleanedColumns[4],
        // Use correct columns for coordinates based on the raw data
        Easting: parseInt(cleanedColumns[9]?.replace(/[\s,]/g, ''), 10),
        Northing: parseInt(cleanedColumns[12]?.replace(/[\s,]/g, ''), 10)
      };
    });
  };

  // Update the showBookmarks state management to ensure we don't accidentally modify bookmarks
  const toggleBookmarksPanel = () => {
    setShowBookmarks(prevState => !prevState);
    // No bookmark modifications here, just UI toggle
  };

  // Function to create a new bookmark group
  const createBookmarkGroup = () => {
    setGroupName('New Group');
    setEditingGroup(null);
    setGroupDialogOpen(true);
  };
  
  // Function to edit an existing bookmark group
  const editBookmarkGroup = (group) => {
    setGroupName(group.name);
    setEditingGroup(group);
    setGroupDialogOpen(true);
  };
  
  // Function to handle saving a new or edited bookmark group
  const handleSaveGroup = () => {
    try {
      let updatedGroups;
      const newGroupId = `group_${Date.now()}`;
      
      if (editingGroup) {
        // Update existing group
        updatedGroups = bookmarkGroups.map(group => {
          if (group.id === editingGroup.id) {
            return {
              ...group,
              name: groupName
            };
          }
          return group;
        });
      } else {
        // Create new group with a stable ID
        const newGroup = {
          id: newGroupId,
          name: groupName,
          bookmarks: []
        };
        // Create a completely new array with the new group appended
        updatedGroups = [...bookmarkGroups, newGroup];
      }
      
      // Important: Update sessionStorage BEFORE updating React state
      // This ensures storage is consistent when state triggers re-render
      try {
        sessionStorage.setItem('buildingBookmarkGroups', JSON.stringify(updatedGroups));
      } catch (error) {
        console.error("Error saving groups to sessionStorage:", error);
      }
      
      // Now update the React state with the new groups array
      safeSetBookmarkGroups(updatedGroups);
      
      // Reset dialog state
      setGroupDialogOpen(false);
      setGroupName('');
      setEditingGroup(null);
      
    } catch (error) {
      console.error("Error creating/editing bookmark group:", error);
    }
  };
  
  // Function to delete a bookmark group
  const deleteBookmarkGroup = (groupId) => {
    // Create a completely new array to ensure React detects the state change
    const updatedGroups = bookmarkGroups.filter(group => group.id !== groupId);
    
    // Set with new reference
    safeSetBookmarkGroups([...updatedGroups]);
    
    // Update sessionStorage immediately
    try {
      if (updatedGroups.length > 0) {
        sessionStorage.setItem('buildingBookmarkGroups', JSON.stringify(updatedGroups));
      } else {
        sessionStorage.removeItem('buildingBookmarkGroups');
      }
    } catch (error) {
      console.error("Error updating bookmark groups in sessionStorage:", error);
    }
    
    // If we just deleted the selected group, clear the selection
    if (selectedGroup === groupId) {
      setSelectedGroup(null);
    }
  };
  
  // Function to get all groups that contain a building
  const getBuildingGroups = (building) => {
    const buildingUniqueId = getUniqueId(building);
    return bookmarkGroups.filter(group => 
      group.bookmarks.some(b => getUniqueId(b) === buildingUniqueId)
    );
  };

  // Add this effect to ensure clean state when dialog closes
  useEffect(() => {
    if (!bookmarkDialogOpen) {
      setSelectedGroupsInDialog([]);
    }
  }, [bookmarkDialogOpen]);

  // Add this effect to handle group selection updates in a batched manner
  // using a ref to track pending updates
  const pendingGroupSelectionRef = useRef(null);

  // Use this function to update selected groups in dialog
  const updateSelectedGroupsInDialog = (action) => {
    // Store the action and process it in the next render cycle
    pendingGroupSelectionRef.current = action;
    // Force a re-render to process the action
    setSelectedGroupsInDialog(prev => [...prev]);
  };

  // Process pending group selection updates
  useEffect(() => {
    if (pendingGroupSelectionRef.current) {
      const action = pendingGroupSelectionRef.current;
      pendingGroupSelectionRef.current = null;
      
      // Process the action - set the state directly here
      setSelectedGroupsInDialog(action);
    }
  }, [selectedGroupsInDialog]);

  // Add a complete cleanup effect that runs once on component mount
  useEffect(() => {
    // Clear all bookmark data when component mounts to ensure a fresh state
    try {
      // Clear both bookmarks and groups from sessionStorage
      sessionStorage.removeItem('buildingBookmarks');
      sessionStorage.removeItem('buildingBookmarkGroups');
      
      // Initialize empty arrays for both bookmarks and groups
      safeSetBookmarks([]);
      safeSetBookmarkGroups([]);
    } catch (error) {
      console.error('Error clearing bookmark data:', error);
    }
    
    // Also check and clear any remaining localStorage items (in case they were previously saved there)
    try {
      localStorage.removeItem('buildingBookmarks');
      localStorage.removeItem('buildingBookmarkGroups');
    } catch (error) {
      console.error('Error clearing localStorage bookmark data:', error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        overflow: 'auto',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh'
      }}>
        {/* Content Container with proper scrolling */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Search Criteria - Fixed at top */}
          <Paper sx={{ 
            borderRadius: 2, 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
            overflow: 'hidden',
            mb: 1.5,
            flexShrink: 0 // Prevent this from shrinking
          }}>
            {/* Search Header */}
            <Box sx={{ 
              p: 0.75,
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              bgcolor: 'primary.main', 
              color: 'white'
            }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <SearchIcon sx={{ mr: 0.75, fontSize: '1.1rem' }} />
                Building Search
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Bookmarked Buildings">
                  <IconButton 
                    color="inherit"
                    size="small"
                    onClick={toggleBookmarksPanel}
                  >
                    <BookmarksIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ p: 1.5 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={7} md={8} lg={8}>
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
                    renderOption={(props, option) => {
                      // Extract key from props to pass it directly (fix for React warning)
                      const { key, ...otherProps } = props;
                      
                      return (
                        <li key={key} {...otherProps}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <LocationOnIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.1rem' }} />
                            <Box sx={{ flexGrow: 1 }}>
                              {option.label}
                              {(option.data?.csvMatchType === 'SINGLE' || option.data?.csvMatchType === 'MULTIPLE') && (
                                <Chip 
                                  size="small" 
                                  label="COCR Registered" 
                                  color="primary" 
                                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                                />
                              )}
                            </Box>
                            {option.data && (
                              <Tooltip title={isBookmarked(option.data) ? "Remove bookmark" : "Add bookmark"}>
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(option.data);
                                  }}
                                >
                                  {isBookmarked(option.data) ? 
                                    <BookmarkIcon color="primary" fontSize="small" /> : 
                                    <BookmarkBorderIcon fontSize="small" />}
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Buildings"
                        variant="outlined"
                        fullWidth
                        onKeyDown={handleInputKeyDown}
                        onChange={handleInputChange}
                        size="small"
                        placeholder="Enter building name or address"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                          style: { fontSize: '0.875rem' }
                        }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12} sm={5} md={4} lg={4}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel id="district-select-label" sx={{ fontSize: '0.875rem' }}>District</InputLabel>
                      <Select
                        labelId="district-select-label"
                        value={selectedDistrict}
                        label="District"
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        sx={{ fontSize: '0.875rem' }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.875rem' }}>All Districts</MenuItem>
                        {districts.map((district) => (
                          <MenuItem key={district} value={district} sx={{ fontSize: '0.875rem' }}>
                            {district}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <Button 
                      variant="contained" 
                      onClick={() => handleSearch(searchQuery, false)}
                      size="small"
                      sx={{ height: '36px', minWidth: '36px', px: 2 }}
                    >
                      <SearchIcon sx={{ fontSize: '1rem' }} />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Scrollable container for the rest of the content */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'auto' 
          }}>
            {/* Bookmarks Panel - Placed inside scroll area */}
            {showBookmarks && (
              <Paper sx={{ 
                mb: 1.5, 
                borderRadius: 2, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                flexShrink: 0 // Prevent from shrinking
              }}>
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                      <BookmarksIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.1rem' }} />
                      Bookmarked Buildings ({bookmarks.length})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showBookmarkedBuildingsLayer}
                            onChange={(e) => setShowBookmarkedBuildingsLayer(e.target.checked)}
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Show on map
                          </Typography>
                        }
                        sx={{ mr: 1 }}
                      />
                      {bookmarks.length > 0 && (
                        <Tooltip title="Clear all bookmarks">
                          <IconButton color="error" onClick={() => {
                            setBookmarkToDelete(null);
                            setDeleteBookmarkDialogOpen(true);
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Add Group Management UI */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        Bookmark Groups
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={createBookmarkGroup}
                        variant="outlined"
                      >
                        New Group
                      </Button>
                    </Box>
                    
                    {bookmarkGroups.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', my: 1 }}>
                        No groups created yet. Create groups to organize your bookmarks.
                      </Typography>
                    ) : (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {bookmarkGroups.map((group, index) => (
                          <Chip
                            key={`group_display_${group.id}_${index}`} // Use composite key for stability
                            label={`${group.name} (${group.bookmarks.length})`}
                            size="small"
                            variant={selectedGroup === group.id ? "filled" : "outlined"}
                            color="primary"
                            onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
                            onDelete={() => deleteBookmarkGroup(group.id)}
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  
                  {bookmarks.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      No bookmarked buildings yet. Click the bookmark icon to save buildings for quick access.
                    </Typography>
                  ) : (
                    <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
                      {/* Filter bookmarks by selected group if needed */}
                      {bookmarks
                        .filter(building => {
                          if (!selectedGroup) return true;
                          const buildingUniqueId = getUniqueId(building);
                          const group = bookmarkGroups.find(g => g.id === selectedGroup);
                          return group && group.bookmarks.some(b => getUniqueId(b) === buildingUniqueId);
                        })
                        .map((building, index) => (
                          <ListItem 
                            key={`bookmark_${building.uniqueId || building.id}_${index}_${building.timestamp || 0}`}
                            sx={{ 
                              borderBottom: '1px solid #eee',
                              '&:last-child': { borderBottom: 'none' }
                            }}
                          >
                            <ListItemIcon>
                              <LocationOnIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={building.customName || building.name || building.id}
                              secondary={
                                <Box component="span">
                                  {building.address}
                                  {(building.csvMatchType === 'SINGLE' || building.csvMatchType === 'MULTIPLE') && (
                                    <Chip 
                                      size="small" 
                                      label="COCR Registered" 
                                      color="primary" 
                                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                                    />
                                  )}
                                  {/* Display groups this building belongs to */}
                                  {getBuildingGroups(building).length > 0 && (
                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {getBuildingGroups(building).map((group, groupIndex) => (
                                        <Chip
                                          key={`group_chip_${group.id}_${groupIndex}`}
                                          label={group.name}
                                          size="small"
                                          variant="outlined"
                                          sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                      ))}
                                    </Box>
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
                              <Tooltip title="Edit bookmark name">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => editBookmark(building)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove bookmark">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => {
                                    setBookmarkToDelete(building);
                                    setDeleteBookmarkDialogOpen(true);
                                  }}
                                >
                                  <BookmarkIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Box>
              </Paper>
            )}

            {/* Map and Results Container - Takes remaining space */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: 2, 
              flexGrow: 1,
              minHeight: '500px'
            }}>
              {/* Suggested Address List - Left Column */}
              {suggestedList.length > 0 && (
                <Paper sx={{ 
                  width: addressPanelOpen ? '350px' : '50px',
                  flexShrink: 0,
                  p: addressPanelOpen ? 2 : 1,
                  bgcolor: '#f7f7f7', 
                  borderRadius: 2, 
                  boxShadow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'width 0.3s ease, padding 0.3s ease',
                  position: 'relative'
                }}>
                  {/* Vertical label for collapsed state */}
                  {!addressPanelOpen && (
                    <Tooltip title="Click to expand suggested addresses" placement="right">
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(180deg, rgba(245,247,250,1) 0%, rgba(233,236,239,1) 100%)',
                          borderRadius: 2,
                          borderRight: '1px solid rgba(0,0,0,0.1)',
                          boxShadow: 'inset -2px 0px 4px rgba(0,0,0,0.05)',
                          cursor: 'pointer',
                          '&:hover': {
                            background: 'linear-gradient(180deg, rgba(236,239,242,1) 0%, rgba(227,230,235,1) 100%)',
                            '& .MuiSvgIcon-root': {
                              transform: 'scale(1.1)',
                            },
                            '& .expand-hint': {
                              opacity: 1
                            }
                          }
                        }}
                        onClick={() => setAddressPanelOpen(true)}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2.5,
                            position: 'relative',
                            py: 3,
                          }}
                        >
                          <LocationOnIcon 
                            color="primary" 
                            fontSize="medium"
                            sx={{ 
                              transition: 'transform 0.2s ease',
                              filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))'
                            }} 
                          />
                          
                          <Box sx={{ position: 'relative', height: 180, display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                transform: 'rotate(-90deg)', 
                                transformOrigin: 'center',
                                whiteSpace: 'nowrap',
                                fontWeight: '600',
                                letterSpacing: 1.2,
                                color: 'primary.main',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                textShadow: '0px 1px 1px rgba(255,255,255,0.8)'
                              }}
                            >
                              Suggested Addresses
                            </Typography>
                          </Box>
                          
                          <Chip 
                            label={suggestedList.length} 
                            size="small" 
                            color="primary" 
                            sx={{ 
                              height: '24px', 
                              minWidth: '24px',
                              fontWeight: 'bold',
                              boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                              '& .MuiChip-label': { 
                                padding: '0 8px',
                                fontSize: '0.75rem'
                              }
                            }} 
                          />
                          
                          <Box 
                            className="expand-hint"
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              mt: 2,
                              opacity: 0.7,
                              transition: 'opacity 0.2s ease'
                            }}
                          >
                            <ChevronRightIcon 
                              fontSize="small" 
                              color="action"
                              sx={{ 
                                animation: 'pulse 1.5s infinite',
                                '@keyframes pulse': {
                                  '0%': { opacity: 0.5, transform: 'translateX(0)' },
                                  '50%': { opacity: 1, transform: 'translateX(2px)' },
                                  '100%': { opacity: 0.5, transform: 'translateX(0)' }
                                }
                              }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Tooltip>
                  )}

                  {/* Toggle button for collapsing the panel */}
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up to parent
                      setAddressPanelOpen(!addressPanelOpen);
                    }}
                    sx={{ 
                      position: 'absolute', 
                      right: addressPanelOpen ? 8 : '50%', 
                      top: addressPanelOpen ? 8 : 8, 
                      transform: addressPanelOpen ? 'none' : 'translateX(50%)',
                      zIndex: 20,
                      bgcolor: addressPanelOpen ? 'background.paper' : 'primary.main',
                      color: addressPanelOpen ? 'inherit' : 'white',
                      boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
                      transition: 'background-color 0.2s ease, transform 0.3s ease, right 0.3s ease',
                      '&:hover': { 
                        bgcolor: addressPanelOpen ? 'background.default' : 'primary.dark' 
                      }
                    }}
                    size="small"
                  >
                    {addressPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>

                  <Collapse in={addressPanelOpen} orientation="horizontal" sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 1, 
                          pr: 4,
                          cursor: 'pointer',
                          py: 1,
                          pl: 1,
                          borderRadius: '4px',
                          transition: 'background-color 0.2s ease',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                        onClick={() => setAddressPanelOpen(false)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }} component="div">
                            Suggested Addresses
                          </Typography>
                          <Tooltip title="Collapse panel">
                            <ChevronLeftIcon fontSize="small" color="action" sx={{ fontSize: '1rem', opacity: 0.7 }} />
                          </Tooltip>
                        </Box>
                        <Chip 
                          label={`${suggestedList.length} results`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <List sx={{ overflowY: 'auto', flex: 1 }}>
                        {suggestedList.map((item, idx) => {
                          const eng = item.Address?.PremisesAddress?.EngPremisesAddress;
                          const chi = item.Address?.PremisesAddress?.ChiPremisesAddress;
                          // Get formatted address using buildAddressLabel
                          const formattedAddress = buildAddressLabel(item.Address);
                          // Split address into English and Chinese parts if it contains a separator
                          const addressParts = formattedAddress.split(' / ');
                          const engAddress = addressParts[0] || '';
                          const chiAddress = addressParts[1] || '';
                          
                          // CSV match logic - ensure this is consistent with handleSearch (by Easting/Northing)
                          const itemApiEastingStr = item.Address?.PremisesAddress?.GeospatialInformation?.Easting;
                          const itemApiNorthingStr = item.Address?.PremisesAddress?.GeospatialInformation?.Northing;

                          const itemApiEasting = parseInt(itemApiEastingStr?.replace(/,/g, ''), 10);
                          const itemApiNorthing = parseInt(itemApiNorthingStr?.replace(/,/g, ''), 10);

                          let currentMatchingCsvRows = [];
                          if (!isNaN(itemApiEasting) && !isNaN(itemApiNorthing)) {
                            currentMatchingCsvRows = csvData.filter(csvRow =>
                              !isNaN(csvRow.Easting) && !isNaN(csvRow.Northing) &&
                              Math.abs(csvRow.Easting - itemApiEasting) <= 1 &&
                              Math.abs(csvRow.Northing - itemApiNorthing) <= 1
                            );
                          }
                          console.log(currentMatchingCsvRows, itemApiEasting, itemApiNorthing);
                          let currentCsvMatchType = 'NONE';
                          if (currentMatchingCsvRows.length === 1) {
                            currentCsvMatchType = 'SINGLE';
                          } else if (currentMatchingCsvRows.length > 1) {
                            currentCsvMatchType = 'MULTIPLE';
                          }
                          
                          // Get GeoAddress for unique identifier
                          const geoAddress = item.Address?.PremisesAddress?.GeoAddress || '';
                          
                          return (
                            <ListItem 
                              button 
                              key={idx} 
                              alignItems="flex-start" 
                              onClick={() => handleBuildingSelect({
                                id: geoAddress || eng?.BuildingName || '',
                                name: eng?.BuildingName || '',
                                nameZH: chi?.BuildingName || '',
                                address: eng?.EngStreet?.StreetName || '',
                                addressZH: chi?.ChiStreet?.StreetName || '',
                                district: eng?.EngDistrict?.DcDistrict || '',
                                districtZH: chi?.ChiDistrict?.DcDistrict || '',
                                // Include building numbers if available
                                buildingNoFrom: eng?.EngStreet?.BuildingNoFrom || '',
                                buildingNoTo: eng?.EngStreet?.BuildingNoTo || '',
                                // Include block and estate info
                                block: eng?.EngBlock || '',
                                estate: eng?.EngEstate?.EstateName || '',
                                coordinates: [item.Address?.PremisesAddress?.GeospatialInformation?.Easting, item.Address?.PremisesAddress?.GeospatialInformation?.Northing],
                                // Include latitude and longitude information from GeospatialInformation
                                latitude: item.Address?.PremisesAddress?.GeospatialInformation?.Latitude || '',
                                longitude: item.Address?.PremisesAddress?.GeospatialInformation?.Longitude || '',
                                geoAddress: geoAddress,
                                matchingCsvRows: currentMatchingCsvRows, 
                                csvMatchType: currentCsvMatchType, 
                                COCR_No: currentMatchingCsvRows.length > 0 ? currentMatchingCsvRows[0].COCR_No : null
                              })}
                              sx={{
                                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                                py: 1.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                              }}
                            >
                              <ListItemIcon>
                                <LocationOnIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText
                                disableTypography
                                primary={
                                  <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.3 }} component="span">
                                    {engAddress}
                                  </Typography>
                                }
                                secondary={
                                  <Box component="span" sx={{ display: 'block' }}>
                                    <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                                      {chiAddress}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                                      <Chip 
                                        label={eng?.EngDistrict?.DcDistrict} 
                                        size="small" 
                                        sx={{ height: '20px', fontSize: '0.7rem' }}
                                      />
                                      {(currentCsvMatchType === 'SINGLE' || currentCsvMatchType === 'MULTIPLE') && (
                                        <Chip 
                                          label="COCR Registered" 
                                          size="small" 
                                          color="primary" 
                                          sx={{ height: '20px', fontSize: '0.7rem', maxWidth: '100%', whiteSpace: 'nowrap' }} 
                                        />
                                      )}
                                    </Box>
                                  </Box>
                                }
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Box>
                  </Collapse>
                </Paper>
              )}

              {/* Map Container - Right Column (or full width if no suggestions) */}
              <Paper sx={{ 
                flex: 1, 
                position: 'relative',
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                <div id="map-view" style={{ height: '100%', width: '100%', flexGrow: 1 }}></div>
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
                      <Tooltip title={isBookmarked(selectedBuilding) ? "Remove bookmark" : "Add to bookmarks"}>
                        <IconButton 
                          onClick={() => toggleBookmark(selectedBuilding)}
                          color={isBookmarked(selectedBuilding) ? "primary" : "default"}
                        >
                          {isBookmarked(selectedBuilding) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {/* Display a more detailed address */}
                      {selectedBuilding.buildingNoFrom && (
                        <span>
                          {selectedBuilding.buildingNoFrom}
                          {selectedBuilding.buildingNoTo && `-${selectedBuilding.buildingNoTo}`}{' '}
                        </span>
                      )}
                      {selectedBuilding.address}
                      {selectedBuilding.block && `, Block ${selectedBuilding.block}`}
                      {selectedBuilding.estate && ` (${selectedBuilding.estate})`}
                    </Typography>
                    {/* Display latitude and longitude if available */}
                    {(selectedBuilding.latitude || selectedBuilding.longitude) && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Coordinates: {selectedBuilding.latitude && `${selectedBuilding.latitude}°N`}
                        {selectedBuilding.latitude && selectedBuilding.longitude && ', '}
                        {selectedBuilding.longitude && `${selectedBuilding.longitude}°E`}
                      </Typography>
                    )}
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={selectedBuilding.district} 
                        size="small" 
                        sx={{ mr: 1 }}
                      />
                      {(selectedBuilding.csvMatchType === 'SINGLE' || selectedBuilding.csvMatchType === 'MULTIPLE') && (
                        <Chip 
                          label="COCR Registered" 
                          size="small" 
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {selectedBuilding.geoAddress && (
                        <Tooltip title="GeoAddress Identifier">
                          <Chip 
                            label={`ID: ${selectedBuilding.geoAddress.substring(0, 10)}...`}
                            size="small" 
                            color="secondary"
                            variant="outlined"
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Paper>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>

        {/* Bookmark Dialog */}
        <Dialog open={bookmarkDialogOpen} onClose={() => setBookmarkDialogOpen(false)}>
          <DialogTitle>{editingBookmark ? 'Edit Building Bookmark' : 'Save Building Bookmark'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editingBookmark 
                ? 'Edit the name for this bookmarked building.' 
                : 'Enter a name for this building bookmark.'}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Bookmark Name"
              type="text"
              fullWidth
              variant="outlined"
              value={bookmarkName}
              onChange={(e) => setBookmarkName(e.target.value)}
            />
            
            {/* Group selection */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add to Bookmark Group (Optional)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                {bookmarkGroups.map((group, index) => {
                  // Use the local state to determine selection
                  const isSelected = selectedGroupsInDialog.includes(group.id);
                  
                  return (
                    <Chip
                      key={`${group.id}_${index}`} // Use both ID and index for stable keys
                      label={group.name}
                      onClick={() => {
                        // Toggle selection safely with function form of setState
                        setSelectedGroupsInDialog(prev => {
                          if (isSelected) {
                            return prev.filter(id => id !== group.id);
                          } else {
                            return [...prev, group.id];
                          }
                        });
                      }}
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      sx={{ 
                        m: 0.5,
                        borderWidth: isSelected ? 2 : 1,
                        position: 'relative',
                        pl: isSelected ? 2 : 1,
                        '&:hover': {
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
                        }
                      }}
                      icon={isSelected ? 
                        <CheckIcon fontSize="small" sx={{ color: 'white' }} /> : 
                        null
                      }
                    />
                  );
                })}
                <Chip
                  icon={<AddIcon />}
                  label="New Group"
                  variant="outlined"
                  onClick={createBookmarkGroup}
                  sx={{ m: 0.5 }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBookmarkDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmBookmark} color="primary" variant="contained">
              {editingBookmark ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteBookmarkDialogOpen}
          onClose={() => setDeleteBookmarkDialogOpen(false)}
        >
          <DialogTitle>
            {bookmarkToDelete ? 'Remove Bookmark' : 'Clear All Bookmarks'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {bookmarkToDelete 
                ? `Are you sure you want to remove the bookmark for "${bookmarkToDelete.customName || bookmarkToDelete.name || 'this building'}"?` 
                : 'Are you sure you want to remove all building bookmarks? This action cannot be undone.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteBookmarkDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={bookmarkToDelete ? handleDeleteBookmark : clearAllBookmarks} 
              color="error" 
              variant="contained"
            >
              {bookmarkToDelete ? 'Remove' : 'Clear All'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Group Management Dialog */}
        <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)}>
          <DialogTitle>{editingGroup ? 'Edit Group' : 'Create New Group'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editingGroup 
                ? 'Edit the name for this bookmark group.' 
                : 'Enter a name for your new bookmark group.'}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="groupName"
              label="Group Name"
              type="text"
              fullWidth
              variant="outlined"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGroupDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveGroup} color="primary" variant="contained">
              {editingGroup ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default BuildingSearch;