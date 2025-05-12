import React, { useState, useMemo } from 'react';

import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Drawer,
  Divider,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputAdornment from '@mui/material/InputAdornment';
import BreadcrumbNav from '../common/BreadcrumbNav';
import AttachmentUpload from '../common/AttachmentUpload';

// Remove the ResizablePanel styled component and replace with regular Box
const TimelineContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'relative'
}));

const TimelineEntry = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&:last-child': {
    marginBottom: 0
  }
}));

const TimelineDot = styled(CircleIcon)(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  marginTop: theme.spacing(0.5)
}));

const TaskDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '60%',
    maxWidth: 1000,
    padding: theme.spacing(3),
    borderLeft: `1px solid ${theme.palette.divider}`
  }
}));

// Mock data - moved outside component to avoid temporal dead zone
const casesData = {
  'CASE001': {
    caseId: 'CASE001',
    fileNo: 'EMSD/EEO/BC/19/01/06',
    caseEngineer: 'E/EEB2/1',
    status: 'In Progress',
    caseType: 'REA Registration',
    createdDate: '2023-11-20',
    wbrsNo: 'WBRS001',
    description: 'REA registration application',
    applicationForm: {
        "applicationType": "new", // new/renewal/change
        "applicantInfo": {
          "currentCompany": {
            "name": "ABC Engineering Ltd",
            "address": {
              "flat": "12",
              "floor": "3",
              "block": "A",
              "building": "Energy Tower",
              "street": "123 Cyberport Rd",
              "city": "Hong Kong"
            }
          },
          "position": "Senior Energy Engineer",
          "contact": {
            "officePhone": "+852 1234 5678",
            "fax": "+852 8765 4321"
          },
          "declaration": {
            "knowledge": true,
            "criminalRecord": "haveNot",
            "dataAccuracy": true
          },
          "signature": {
            "date": "2023-10-05",
            "imageData": "base64EncodedImageString"
          }
        },
        "qualifications": [
          {
            "type": "professionalEngineer",
            "registrationNumber": "ENG12345",
            "discipline": "BSS",
            "yearOfQualification": 2015,
            "hkieMembership": {
              "corporateMember": true,
              "equivalentQualification": false
            }
          },
          {
            "type": "otherQualification",
            "issuingBody": "Chartered Institution of Building Services Engineers",
            "yearOfQualification": 2018
          }
        ],
        "practicalExperience": [
          {
            "startDate": "2018-03-01",
            "endDate": "2021-08-31",
            "position": "Energy Auditor",
            "company": "XYZ Consultants",
            "description": "Conducted energy audits for 20+ commercial buildings under BEAM Plus certification"
          },
          {
            "startDate": "2021-09-01",
            "endDate": "2023-10-05",
            "position": "Energy Manager",
            "company": "GreenTech Solutions",
            "description": "Led implementation of ISO 50001 energy management system in industrial facilities"
          }
        ],
        "supportingDocuments": [
          {
            "documentType": "professionalQualificationProof",
            "status": "attached"
          },
          {
            "documentType": "experienceVerificationLetter",
            "status": "pending"
          }
        ],
        "disclosurePreferences": {
          "emailDisclosure": true,
          "phoneDisclosure": false
        },
        "applicationFee": {
          "amount": 2100,
          "currency": "HKD",
          "paymentMethod": "cheque",
          "referenceNumber": "EA123456789"
        },
        "submissionInfo": {
          "submissionDate": "2023-10-06",
          "submissionMethod": "inPerson",
          "interviewScheduled": true,
          "interviewTime": "2023-10-12T10:00:00"
        },
        "regulatoryCompliance": {
          "antiCorruptionDeclaration": true,
          "dataPrivacyConsent": true
        }
      }
    },
    'CASE002': {
      caseId: 'CASE002',
      fileNo: 'EMSD/EEO/BC/19/01/07',
      caseEngineer: 'E/EEB3/2',
      status: 'In Progress',
      caseType: 'COCR S1',
      createdDate: '2023-11-25',
      wbrsNo: 'WBRS002',
      description: 'REA renewal application with updated qualifications',
      applicationForm: {
        "applicationType": "stageOne", // 首阶段声明类型
        "buildingInfo": {
          "name": {
            "english": "GreenTech Tower",
            "chinese": "綠能科技大廈"
          },
          "address": {
            "streetNo": "123",
            "streetEnglish": "Energy Avenue",
            "streetChinese": "能源大道",
            "districtEnglish": "Kowloon",
            "districtChinese": "九龍",
            "locationType": ["residential", "commercial"] // 复合用途需多选
          },
          "buildingCategory": [
            "composite(commercial&residential)", // 必须单选
            "dataCentre" // 若适用可多选
          ],
          "lotNo": "LT001234",
          "grossFloorArea": {
            "total": 15000,
            "commercialPortion": 5000
          }
        },
        "declarationInfo": {
          "submissionPurpose": "replacePrevious", // 替代之前表格/新申请
          "previousReference": "EE1-2023-001",
          "consentDate": "2023-09-15",
          "constructionStartDate": "2024-01-01",
          "occupancyApprovalDate": "2025-06-30",
          "declarant": {
            "name": {
              "prefix": "Mr.",
              "english": "John Doe",
              "chinese": "約翰·杜"
            },
            "position": "Chief Energy Officer",
            "signatureDate": "2023-10-01",
            "companySeal": true
          }
        },
        "supportingFiles": [
          {
            "type": "consentDocument",
            "status": "attached",
            "fileSize": "2MB",
            "mimeType": "application/pdf"
          },
          {
            "type": "sitePlan",
            "status": "pending",
            "remarks": "A3 size required"
          },
          {
            "type": "reaQualification",
            "status": "attached",
            "details": {
              "membership": "MHKIE",
              "expiryDate": "2025-12-31"
            }
          }
        ],
        "complianceDeclaration": {
          "codeVersion": "BEAM Plus v3.0",
          "designStandards": [
            "ASHRAE 90.1",
            "HKIE M14343"
          ],
          "declarantCertification": true
        },
        "submissionMetadata": {
          "submissionChannel": "physical",
          "receivedDate": "2023-10-05",
          "paymentStatus": "exempt",
          "trackingId": "EE1-TRACK-20231005"
        },
        "regulatoryNotes": {
          "antiCorruption": true,
          "privacyConsent": true,
          "dataUsage": [
            "processing",
            "auditTrail",
            "statisticalAnalysis"
          ]
        }
      }
    }
  };
  
const CaseDetail = () => {
  const [caseId, setCaseId] = useState('CASE001');
  const caseData = casesData[caseId];

  const handleCaseChange = (newCaseId) => {
    setCaseId(newCaseId);
    setEditMode(false);
    setEditableData(casesData[newCaseId].applicationForm || {});
  };

  const [tabValue, setTabValue] = useState(0); // Default to Application tab
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // For the main sidebar
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState(caseData.applicationForm || {});
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  
  // Task filtering state
  const [taskFilter, setTaskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stoFilter, setStoFilter] = useState('');
  const [dueDateFromFilter, setDueDateFromFilter] = useState('');
  const [dueDateToFilter, setDueDateToFilter] = useState('');
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);

  const applicationData = caseData.applicationForm; // Use the applicationForm from caseData
  
  const handleFieldChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleNestedFieldChange = (section, field, value) => {
    setEditableData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleAddressChange = (section, addressField, value) => {
    setEditableData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section]?.address,
          [addressField]: value
        }
      }
    }));
  };

  const mockTasks = [
    { id: 1, name: 'Prepare / Issue Acknowledgement Letter Annex F1', status: 'Pending', sto: 'STO/EEB5/1', se: 'SE/EEB1/1', description: 'Initial review of submitted documents', dueDate: '2023-12-01' },
    { id: 2, name: 'Review Submitted Documents', status: 'In Progress', sto: 'STO/EEB5/1', description: 'Conduct on-site inspection', dueDate: '2023-12-05' },
    { id: 3, name: 'Checklist for General Checking of Application Submission', status: 'Pending', sto: 'STO/EEB5/1', description: 'Verify completeness of application form and supporting documents', dueDate: '2023-12-03', 
      checklistData: {
        applicationForm: [
          { id: 'sectionA', label: 'Section A', checked: false },
          { id: 'sectionB', label: 'Section B', checked: false },
          { id: 'sectionC', label: 'Section C', checked: false },
          { id: 'sectionD', label: 'Section D (not applicable to applications of public officer)', checked: false },
          { id: 'sectionE', label: 'Section E (not applicable to applications of public officer)', checked: false }
        ],
        supportingDocuments: [
          { id: 'practicalExperience', label: 'A copy of documentary proof of relevant practical working experience', checked: false, applicableToPublic: false },
          { id: 'qualifications', label: 'A copy of relevant professional qualifications', checked: false, applicableToPublic: false },
          { id: 'subscriptionFees', label: 'A copy of receipt of subscription fees to demonstrate the validity of applicant\'s professional qualification', checked: false, applicableToPublic: false },
          { id: 'paymentProof', label: 'A cheque/drafts/cashier in payment of the fee prescribed for the application', checked: false, applicableToPublic: false },
          { id: 'supportingDocs', label: 'A copy of the following documents to substantiate the application made under section 5(2) of the Buildings Energy Efficiency (Registered Energy Assessors) Regulation (Cap 610B)', checked: false, applicableToPublic: false, additionalNotes: '' },
          { id: 'nomination', label: 'A nomination made by a senior officer at D1 rank or above', checked: false, applicableToPublic: true }
        ]
      }
    }
  ];

  const mockHistory = [
    { date: '2023-11-20', action: 'Case Created', actor: 'System' },
    { date: '2023-11-21', action: 'Task Assigned', actor: 'John Doe' }
  ];

  // Remove handleMouseDown, handleMouseMove, and handleMouseUp functions

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDrawerOpen(true);
  };

  const handleTaskClose = () => {
    setTaskDrawerOpen(false);
    setSelectedTask(null);
  };

  const handleTaskSave = () => {
    // Save task logic here
    console.log('Saving task:', selectedTask);
    handleTaskClose();
  };

  const handleChecklistItemChange = (section, itemId, checked) => {
    if (!selectedTask || !selectedTask.checklistData) return;
    
    setSelectedTask(prev => {
      const updatedChecklist = {...prev.checklistData};
      const itemIndex = updatedChecklist[section].findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        updatedChecklist[section][itemIndex] = {
          ...updatedChecklist[section][itemIndex],
          checked
        };
      }
      
      return {
        ...prev,
        checklistData: updatedChecklist
      };
    });
  };
  
  const handleAdditionalNotesChange = (section, itemId, notes) => {
    if (!selectedTask || !selectedTask.checklistData) return;
    
    setSelectedTask(prev => {
      const updatedChecklist = {...prev.checklistData};
      const itemIndex = updatedChecklist[section].findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        updatedChecklist[section][itemIndex] = {
          ...updatedChecklist[section][itemIndex],
          additionalNotes: notes
        };
      }
      
      return {
        ...prev,
        checklistData: updatedChecklist
      };
    });
  };

  const taskRecords = [
    { date: '2023-11-20', action: 'Site Visit', remarks: 'Initial inspection completed', officer: 'John Doe' },
    { date: '2023-11-22', action: 'Follow-up', remarks: 'Documentation review', officer: 'Jane Smith' }
  ];

  const relatedCases = Object.entries(casesData)
    .filter(([id]) => id !== caseId)
    .map(([id, data]) => ({
      id,
      title: `${data.caseType} - ${data.fileNo}`,
      status: data.status
    }));
    
  // Filter function
  const handleTaskFilter = (searchText) => {
    setTaskFilter(searchText);
  };
  
  // Filtered tasks based on all filter criteria
  const filteredTasks = useMemo(() => {
    return mockTasks.filter(task => {
      // Filter by task name
      const nameMatch = task.name.toLowerCase().includes(taskFilter.toLowerCase());
      
      // Filter by status
      const statusMatch = statusFilter === '' || task.status === statusFilter;
      
      // Filter by STO
      const stoMatch = stoFilter === '' || task.sto.toLowerCase().includes(stoFilter.toLowerCase());
      
      // Filter by due date range
      const dueDateMatch = (
        (dueDateFromFilter === '' || new Date(task.dueDate) >= new Date(dueDateFromFilter)) &&
        (dueDateToFilter === '' || new Date(task.dueDate) <= new Date(dueDateToFilter))
      );
      
      return nameMatch && statusMatch && stoMatch && dueDateMatch;
    });
  }, [mockTasks, taskFilter, statusFilter, stoFilter, dueDateFromFilter, dueDateToFilter]);

  const renderAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.flat || ''} ${address.floor || ''} ${address.block || ''} ${address.building || ''}, ${address.street || ''}, ${address.city || ''}`.replace(/\s+/g, ' ').trim();
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>BEEO System</Typography>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem button component="a" href="/" sx={{ py: 1.5 }}>
            <ListItemIcon>
              <HomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component="a" href="/cases" sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SearchIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Cases" />
          </ListItem>
          <ListItem button component="a" href="/buildings" sx={{ py: 1.5 }}>
            <ListItemIcon>
              <ApartmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Buildings" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'hidden' }}>
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Cases', path: '/cases' },
          { label: caseData.caseId, path: `/cases/${caseData.caseId}` }
        ]} />

        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 2 }}>
          {/* Main Panel - full width */}
          <Box
            sx={{
              width: '100%',
              minWidth: 300,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card sx={{ mb: 2, flexShrink: 0 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: detailsExpanded ? 2 : 0 }}>                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>                    
                    <Typography variant="h6" sx={{ mr: 1 }}>Case Details</Typography>
                    {!detailsExpanded && (
                      <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                        {caseData.caseId} | {caseData.caseType}
                      </Typography>
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => setDetailsExpanded(!detailsExpanded)}
                      sx={{ ml: 1 }}
                    >
                      {detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Chip 
                    label={caseData.status} 
                    color={caseData.status === 'Open' ? 'primary' : (caseData.status === 'In Progress' ? 'warning' : 'default')}
                    size="small"
                  />
                </Box>
                <Collapse in={detailsExpanded} timeout="auto">
                  <Grid container spacing={1} sx={{ mt: 0.5 }}> {/* Reduced spacing for denser info */}
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Case No.</Typography>
                      <Typography variant="body1">{caseData.caseId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Subject Engineer</Typography>
                      <Typography variant="body1">{caseData.caseEngineer}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Case Type</Typography>
                      <Typography variant="body1">{caseData.caseType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created Date</Typography>
                      <Typography variant="body1">{caseData.createdDate}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">WBRS No.</Typography>
                      <Typography variant="body1">{caseData.wbrsNo}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                      <Typography variant="body2" sx={{ maxHeight: 100, overflowY: 'auto' }}>{caseData.description}</Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>

            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'none', borderRadius: '0 0 8px 8px', height: detailsExpanded ? 'calc(100% - 200px)' : 'calc(100% - 70px)' }}> {/* Rounded bottom corners with dynamic height */}
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)} 
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider', 
                  flexShrink: 0,
                  bgcolor: 'grey.50',
                  borderTopLeftRadius: 0, // Ensure top corners are not rounded if card above is
                  borderTopRightRadius: 0,
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'medium',
                    minWidth: 100, // Ensure tabs have enough space
                    padding: '12px 16px',
                    '&.Mui-selected': {
                      color: 'primary.main',
                    }
                  }
                }}
                variant="scrollable" // Changed from fullWidth to scrollable for better mobile experience
                scrollButtons="auto" // Show scroll buttons when needed
              >
                <Tab label="Application" />
                <Tab label="Tasks" />
                <Tab label="Attachments" />
                <Tab label={`Related Cases (${relatedCases.length})`} />
                <Tab label="History" />
              </Tabs>
              <Box sx={{ flex: 1, p: 2.5, overflow: 'auto', bgcolor: 'white', height: '100%' }}> {/* Added height: 100% */}
                {tabValue === 0 && applicationData && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Button
                        variant={editMode ? 'contained' : 'outlined'}
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode((prev) => !prev)}
                      >
                        {editMode ? 'Save' : 'Edit'}
                      </Button>
                    </Box>
                    {caseData.caseType === 'COCR S1' ? (
                      <>
                        {/* Building Information Card */}
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Building Information</Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Building Name (English)</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.buildingInfo?.name?.english || ''}
                                    onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', { ...editableData.buildingInfo?.name, english: e.target.value })}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.name?.english}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Building Name (Chinese)</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.buildingInfo?.name?.chinese || ''}
                                    onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', { ...editableData.buildingInfo?.name, chinese: e.target.value })}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.name?.chinese}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                                {editMode ? (
                                  <Grid container spacing={1}>
                                    <Grid item xs={12} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Street No."
                                        value={editableData.buildingInfo?.address?.streetNo || ''}
                                        onChange={(e) => handleNestedFieldChange('buildingInfo', 'address', { ...editableData.buildingInfo?.address, streetNo: e.target.value })}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4.5}>
                                      <TextField
                                        fullWidth
                                        label="Street (English)"
                                        value={editableData.buildingInfo?.address?.streetEnglish || ''}
                                        onChange={(e) => handleNestedFieldChange('buildingInfo', 'address', { ...editableData.buildingInfo?.address, streetEnglish: e.target.value })}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4.5}>
                                      <TextField
                                        fullWidth
                                        label="Street (Chinese)"
                                        value={editableData.buildingInfo?.address?.streetChinese || ''}
                                        onChange={(e) => handleNestedFieldChange('buildingInfo', 'address', { ...editableData.buildingInfo?.address, streetChinese: e.target.value })}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField
                                        fullWidth
                                        label="District (English)"
                                        value={editableData.buildingInfo?.address?.districtEnglish || ''}
                                        onChange={(e) => handleNestedFieldChange('buildingInfo', 'address', { ...editableData.buildingInfo?.address, districtEnglish: e.target.value })}
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <TextField
                                        fullWidth
                                        label="District (Chinese)"
                                        value={editableData.buildingInfo?.address?.districtChinese || ''}
                                        onChange={(e) => handleNestedFieldChange('buildingInfo', 'address', { ...editableData.buildingInfo?.address, districtChinese: e.target.value })}
                                        size="small"
                                      />
                                    </Grid>
                                  </Grid>
                                ) : (
                                  <Typography variant="body1">
                                    {applicationData.buildingInfo?.address?.streetNo} {applicationData.buildingInfo?.address?.streetEnglish} / {applicationData.buildingInfo?.address?.streetChinese},
                                    {applicationData.buildingInfo?.address?.districtEnglish} / {applicationData.buildingInfo?.address?.districtChinese}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Building Category</Typography>
                                {editMode ? (
                                  <FormControl fullWidth size="small">
                                    <Select
                                      value={editableData.buildingInfo?.buildingCategory?.[0] || ''}
                                      onChange={(e) => handleNestedFieldChange('buildingInfo', 'buildingCategory', [e.target.value])}
                                    >
                                      <MenuItem value="composite(commercial&residential)">Composite (Commercial & Residential)</MenuItem>
                                      <MenuItem value="dataCentre">Data Centre</MenuItem>
                                    </Select>
                                  </FormControl>
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.buildingCategory?.join(', ')}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Lot No.</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.buildingInfo?.lotNo || ''}
                                    onChange={(e) => handleNestedFieldChange('buildingInfo', 'lotNo', e.target.value)}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.lotNo}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Total Gross Floor Area (m²)</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    type="number"
                                    value={editableData.buildingInfo?.grossFloorArea?.total || ''}
                                    onChange={(e) => handleNestedFieldChange('buildingInfo', 'grossFloorArea', { ...editableData.buildingInfo?.grossFloorArea, total: parseFloat(e.target.value) })}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.grossFloorArea?.total}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Commercial Portion (m²)</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    type="number"
                                    value={editableData.buildingInfo?.grossFloorArea?.commercialPortion || ''}
                                    onChange={(e) => handleNestedFieldChange('buildingInfo', 'grossFloorArea', { ...editableData.buildingInfo?.grossFloorArea, commercialPortion: parseFloat(e.target.value) })}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">{applicationData.buildingInfo?.grossFloorArea?.commercialPortion}</Typography>
                                )}
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      /* Applicant Information Card */
                      <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Applicant Information</Typography>
                        <Grid container spacing={2}>
                          {/* Application Type */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Application Type</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicationType || ''}
                                onChange={(e) => handleFieldChange('applicationType', e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicationType}</Typography>
                            )}
                          </Grid>
                          {/* Company Name */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.currentCompany?.name || ''}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany, name: e.target.value })}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.currentCompany?.name}</Typography>
                            )}
                          </Grid>
                          {/* Address */}
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                            {editMode ? (
                              <Grid container spacing={1}>
                                <Grid item xs={12} sm={3}><TextField fullWidth label="Flat" value={editableData.applicantInfo?.currentCompany?.address?.flat || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, flat: e.target.value })} size="small" /></Grid>
                                <Grid item xs={12} sm={3}><TextField fullWidth label="Floor" value={editableData.applicantInfo?.currentCompany?.address?.floor || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, floor: e.target.value })} size="small" /></Grid>
                                <Grid item xs={12} sm={3}><TextField fullWidth label="Block" value={editableData.applicantInfo?.currentCompany?.address?.block || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, block: e.target.value })} size="small" /></Grid>
                                <Grid item xs={12} sm={3}><TextField fullWidth label="Building" value={editableData.applicantInfo?.currentCompany?.address?.building || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, building: e.target.value })} size="small" /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="Street" value={editableData.applicantInfo?.currentCompany?.address?.street || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, street: e.target.value })} size="small" /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth label="City" value={editableData.applicantInfo?.currentCompany?.address?.city || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, city: e.target.value })} size="small" /></Grid>
                              </Grid>
                            ) : (
                              <Typography variant="body1">{renderAddress(applicationData.applicantInfo?.currentCompany?.address)}</Typography>
                            )}
                          </Grid>
                          {/* Position */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Position</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.position || ''}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'position', e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.position}</Typography>
                            )}
                          </Grid>
                          {/* Office Phone */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Office Phone</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.contact?.officePhone || ''}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', { ...editableData.applicantInfo?.contact, officePhone: e.target.value })}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.contact?.officePhone}</Typography>
                            )}
                          </Grid>
                          {/* Fax */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Fax</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.contact?.fax || ''}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', { ...editableData.applicantInfo?.contact, fax: e.target.value })}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.contact?.fax}</Typography>
                            )}
                          </Grid>
                          {/* Declaration */}
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Declaration</Typography>
                            {editMode ? (
                              <FormGroup sx={{ mt: 1 }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={editableData.applicantInfo?.declaration?.knowledge || false}
                                      onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', { ...editableData.applicantInfo?.declaration, knowledge: e.target.checked })}
                                      size="small"
                                    />
                                  }
                                  label="Knowledge"
                                />
                                <FormControl fullWidth size="small" sx={{ my: 1 }}>
                                  <InputLabel id="criminal-record-label">Criminal Record</InputLabel>
                                  <Select
                                    labelId="criminal-record-label"
                                    value={editableData.applicantInfo?.declaration?.criminalRecord || ''}
                                    label="Criminal Record"
                                    onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', { ...editableData.applicantInfo?.declaration, criminalRecord: e.target.value })}
                                  >
                                    <MenuItem value="have">Have</MenuItem>
                                    <MenuItem value="haveNot">Have Not</MenuItem>
                                  </Select>
                                </FormControl>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={editableData.applicantInfo?.declaration?.dataAccuracy || false}
                                      onChange={(e) => handleNestedFieldChange('applicantInfo', 'declaration', { ...editableData.applicantInfo?.declaration, dataAccuracy: e.target.checked })}
                                      size="small"
                                    />
                                  }
                                  label="Data Accuracy"
                                />
                              </FormGroup>
                            ) : (
                              <Typography variant="body1">
                                Knowledge: {applicationData.applicantInfo?.declaration?.knowledge ? 'Yes' : 'No'}<br />
                                Criminal Record: {applicationData.applicantInfo?.declaration?.criminalRecord}<br />
                                Data Accuracy: {applicationData.applicantInfo?.declaration?.dataAccuracy ? 'Yes' : 'No'}
                              </Typography>
                            )}
                          </Grid>
                          {/* Signature Date */}
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Signature Date</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                type="date"
                                value={editableData.applicantInfo?.signature?.date || ''}
                                onChange={(e) => handleNestedFieldChange('applicantInfo', 'signature', { ...editableData.applicantInfo?.signature, date: e.target.value })}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.signature?.date}</Typography>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    )}

                    {caseData.caseType === 'COCR S1' ? (
                      <>
                        {/* Supporting Documents Card */}
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Supporting Documents</Typography>
                            <Grid container spacing={2}>
                              {applicationData.supportingDocuments?.map((doc, index) => (
                                <Grid item xs={12} key={index}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary">{doc.type}</Typography>
                                    {editMode ? (
                                      <FormControl fullWidth size="small">
                                        <Select
                                          value={editableData.supportingDocuments?.[index]?.status || ''}
                                          onChange={(e) => handleNestedFieldChange('supportingDocuments', index, { ...editableData.supportingDocuments?.[index], status: e.target.value })}
                                        >
                                          <MenuItem value="pending">Pending</MenuItem>
                                          <MenuItem value="submitted">Submitted</MenuItem>
                                          <MenuItem value="approved">Approved</MenuItem>
                                          <MenuItem value="rejected">Rejected</MenuItem>
                                        </Select>
                                      </FormControl>
                                    ) : (
                                      <Chip
                                        label={doc.status}
                                        color={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'default'}
                                        size="small"
                                      />
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>

                        {/* Compliance Declaration Card */}
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Compliance Declaration</Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <FormGroup>
                                  {editMode ? (
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={editableData.complianceDeclaration?.regulatoryCompliance || false}
                                          onChange={(e) => handleNestedFieldChange('complianceDeclaration', 'regulatoryCompliance', e.target.checked)}
                                          size="small"
                                        />
                                      }
                                      label="I declare that all information provided is true and accurate"
                                    />
                                  ) : (
                                    <Typography variant="body1">
                                      Regulatory Compliance: {applicationData.complianceDeclaration?.regulatoryCompliance ? 'Yes' : 'No'}
                                    </Typography>
                                  )}
                                </FormGroup>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>

                        {/* Regulatory Notes Card */}
                        <Card sx={{ mb: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>Regulatory Notes</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Regulatory Notes"
                                value={editableData.regulatoryNotes ? JSON.stringify(editableData.regulatoryNotes, null, 2) : ''}
                                onChange={(e) => handleFieldChange('regulatoryNotes', e.target.value)}
                                variant="outlined"
                                margin="normal"
                              />
                            ) : (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">Anti-Corruption Declaration:</Typography>
                                <Typography variant="body1">{applicationData.regulatoryNotes?.antiCorruption ? 'Yes' : 'No'}</Typography>
                                
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Privacy Consent:</Typography>
                                <Typography variant="body1">{applicationData.regulatoryNotes?.privacyConsent ? 'Yes' : 'No'}</Typography>
                                
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>Data Usage:</Typography>
                                <Typography variant="body1">
                                  {applicationData.regulatoryNotes?.dataUsage ? 
                                    (Array.isArray(applicationData.regulatoryNotes.dataUsage) ? 
                                      applicationData.regulatoryNotes.dataUsage.join(', ') : 
                                      String(applicationData.regulatoryNotes.dataUsage)
                                    ) : 'None'}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      /* Qualifications Card */
                      <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Qualifications</Typography>
                        {applicationData.qualifications?.map((qual, index) => (
                          <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                                {editMode ? (
                                  <TextField fullWidth value={editableData.qualifications?.[index]?.type || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], type: e.target.value })} size="small" />
                                ) : (
                                  <Typography variant="body1">{qual.type}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Registration Number</Typography>
                                {editMode ? (
                                  <TextField fullWidth value={editableData.qualifications?.[index]?.registrationNumber || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], registrationNumber: e.target.value })} size="small" />
                                ) : (
                                  <Typography variant="body1">{qual.registrationNumber}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Discipline</Typography>
                                {editMode ? (
                                  <TextField fullWidth value={editableData.qualifications?.[index]?.discipline || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], discipline: e.target.value })} size="small" />
                                ) : (
                                  <Typography variant="body1">{qual.discipline}</Typography>
                                )}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Year of Qualification</Typography>
                                {editMode ? (
                                  <TextField fullWidth type="number" value={editableData.qualifications?.[index]?.yearOfQualification || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], yearOfQualification: parseInt(e.target.value) })} size="small" />
                                ) : (
                                  <Typography variant="body1">{qual.yearOfQualification}</Typography>
                                )}
                              </Grid>
                              {qual.type === 'professionalEngineer' && (
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" color="text.secondary">HKIE Membership</Typography>
                                  {editMode ? (
                                    <Stack direction="row" spacing={1}>
                                      <TextField type="checkbox" label="Corporate Member" checked={editableData.qualifications?.[index]?.hkieMembership?.corporateMember || false} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], hkieMembership: { ...editableData.qualifications?.[index]?.hkieMembership, corporateMember: e.target.checked } })} size="small" />
                                      <TextField type="checkbox" label="Equivalent Qualification" checked={editableData.qualifications?.[index]?.hkieMembership?.equivalentQualification || false} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], hkieMembership: { ...editableData.qualifications?.[index]?.hkieMembership, equivalentQualification: e.target.checked } })} size="small" />
                                    </Stack>
                                  ) : (
                                    <Typography variant="body1">
                                      Corporate Member: {qual.hkieMembership?.corporateMember ? 'Yes' : 'No'}<br />
                                      Equivalent Qualification: {qual.hkieMembership?.equivalentQualification ? 'Yes' : 'No'}
                                    </Typography>
                                  )}
                                </Grid>
                              )}
                              {qual.type === 'otherQualification' && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" color="text.secondary">Issuing Body</Typography>
                                  {editMode ? (
                                    <TextField fullWidth value={editableData.qualifications?.[index]?.issuingBody || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], issuingBody: e.target.value })} size="small" />
                                  ) : (
                                    <Typography variant="body1">{qual.issuingBody}</Typography>
                                  )}
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>

                    )}

                    {caseData.caseType !== 'COCR S1' && (
                      /* Practical Experience Card */
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                        <Typography variant="h6" gutterBottom>Practical Experience</Typography>
                        {applicationData.practicalExperience?.map((exp, index) => (
                          <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Start Date</Typography>{editMode ? <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={editableData.practicalExperience?.[index]?.startDate || ''} onChange={(e) => handleNestedFieldChange('practicalExperience', index, { ...editableData.practicalExperience?.[index], startDate: e.target.value })} size="small" /> : <Typography variant="body1">{exp.startDate}</Typography>}</Grid>
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">End Date</Typography>{editMode ? <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={editableData.practicalExperience?.[index]?.endDate || ''} onChange={(e) => handleNestedFieldChange('practicalExperience', index, { ...editableData.practicalExperience?.[index], endDate: e.target.value })} size="small" /> : <Typography variant="body1">{exp.endDate}</Typography>}</Grid>
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Position</Typography>{editMode ? <TextField fullWidth value={editableData.practicalExperience?.[index]?.position || ''} onChange={(e) => handleNestedFieldChange('practicalExperience', index, { ...editableData.practicalExperience?.[index], position: e.target.value })} size="small" /> : <Typography variant="body1">{exp.position}</Typography>}</Grid>
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Company</Typography>{editMode ? <TextField fullWidth value={editableData.practicalExperience?.[index]?.company || ''} onChange={(e) => handleNestedFieldChange('practicalExperience', index, { ...editableData.practicalExperience?.[index], company: e.target.value })} size="small" /> : <Typography variant="body1">{exp.company}</Typography>}</Grid>
                              <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Description</Typography>{editMode ? <TextField fullWidth multiline rows={2} value={editableData.practicalExperience?.[index]?.description || ''} onChange={(e) => handleNestedFieldChange('practicalExperience', index, { ...editableData.practicalExperience?.[index], description: e.target.value })} size="small" /> : <Typography variant="body1">{exp.description}</Typography>}</Grid>
                            </Grid>
                          </Box>
                        ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Supporting Documents Card */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Supporting Documents</Typography>
                        {applicationData.supportingDocuments?.map((doc, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Document Type</Typography>{editMode ? <TextField fullWidth value={editableData.supportingDocuments?.[index]?.documentType || ''} onChange={(e) => handleNestedFieldChange('supportingDocuments', index, { ...editableData.supportingDocuments?.[index], documentType: e.target.value })} size="small" /> : <Typography variant="body1">{doc.documentType}</Typography>}</Grid>
                              <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Status</Typography>{editMode ? <TextField fullWidth value={editableData.supportingDocuments?.[index]?.status || ''} onChange={(e) => handleNestedFieldChange('supportingDocuments', index, { ...editableData.supportingDocuments?.[index], status: e.target.value })} size="small" /> : <Chip label={doc.status} size="small" color={doc.status === 'attached' ? 'success' : (doc.status === 'pending' ? 'primary' : 'warning')} />}</Grid>
                            </Grid>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Disclosure Preferences Card */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">Disclosure Preferences</Typography>
                        </Box>
                        {editMode ? (
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={editableData.disclosurePreferences?.emailDisclosure || false}
                                  onChange={(e) => handleNestedFieldChange('disclosurePreferences', 'emailDisclosure', e.target.checked)}
                                  size="small"
                                />
                              }
                              label="Email Disclosure"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={editableData.disclosurePreferences?.phoneDisclosure || false}
                                  onChange={(e) => handleNestedFieldChange('disclosurePreferences', 'phoneDisclosure', e.target.checked)}
                                  size="small"
                                />
                              }
                              label="Phone Disclosure"
                            />
                          </FormGroup>
                        ) : (
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">Email Disclosure</Typography>
                              <Typography variant="body1">
                                {applicationData.disclosurePreferences?.emailDisclosure ? 'Yes' : 'No'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary">Phone Disclosure</Typography>
                              <Typography variant="body1">
                                {applicationData.disclosurePreferences?.phoneDisclosure ? 'Yes' : 'No'}
                              </Typography>
                            </Grid>
                          </Grid>
                        )}
                      </CardContent>
                    </Card>

                    {/* Application Fee Card */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Application Fee</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}><Typography variant="subtitle2" color="text.secondary">Amount</Typography>{editMode ? <TextField fullWidth type="number" value={editableData.applicationFee?.amount || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'amount', parseFloat(e.target.value))} size="small" /> : <Typography variant="body1">{applicationData.applicationFee?.amount}</Typography>}</Grid>
                          <Grid item xs={12} md={3}><Typography variant="subtitle2" color="text.secondary">Currency</Typography>{editMode ? <TextField fullWidth value={editableData.applicationFee?.currency || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'currency', e.target.value)} size="small" /> : <Typography variant="body1">{applicationData.applicationFee?.currency}</Typography>}</Grid>
                          <Grid item xs={12} md={3}><Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>{editMode ? <TextField fullWidth value={editableData.applicationFee?.paymentMethod || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'paymentMethod', e.target.value)} size="small" /> : <Typography variant="body1">{applicationData.applicationFee?.paymentMethod}</Typography>}</Grid>
                          <Grid item xs={12} md={3}><Typography variant="subtitle2" color="text.secondary">Reference Number</Typography>{editMode ? <TextField fullWidth value={editableData.applicationFee?.referenceNumber || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'referenceNumber', e.target.value)} size="small" /> : <Typography variant="body1">{applicationData.applicationFee?.referenceNumber}</Typography>}</Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Submission Info Card */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Submission Information</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}><Typography variant="subtitle2" color="text.secondary">Submission Date</Typography>{editMode ? <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={editableData.submissionInfo?.submissionDate || ''} onChange={(e) => handleNestedFieldChange('submissionInfo', 'submissionDate', e.target.value)} size="small" /> : <Typography variant="body1">{applicationData.submissionInfo?.submissionDate}</Typography>}</Grid>
                          <Grid item xs={12} md={4}><Typography variant="subtitle2" color="text.secondary">Submission Method</Typography>{editMode ? <TextField fullWidth value={editableData.submissionInfo?.submissionMethod || ''} onChange={(e) => handleNestedFieldChange('submissionInfo', 'submissionMethod', e.target.value)} size="small" /> : <Typography variant="body1">{applicationData.submissionInfo?.submissionMethod}</Typography>}</Grid>
                          <Grid item xs={12} md={4}><Typography variant="subtitle2" color="text.secondary">Interview Scheduled</Typography>{editMode ? <TextField type="checkbox" checked={editableData.submissionInfo?.interviewScheduled || false} onChange={(e) => handleNestedFieldChange('submissionInfo', 'interviewScheduled', e.target.checked)} size="small" /> : <Typography variant="body1">{applicationData.submissionInfo?.interviewScheduled ? 'Yes' : 'No'}</Typography>}</Grid>
                          {applicationData.submissionInfo?.interviewScheduled && (
                            <Grid item xs={12} md={4}><Typography variant="subtitle2" color="text.secondary">Interview Time</Typography>{editMode ? <TextField fullWidth type="datetime-local" InputLabelProps={{ shrink: true }} value={editableData.submissionInfo?.interviewTime || ''} onChange={(e) => handleNestedFieldChange('submissionInfo', 'interviewTime', e.target.value)} size="small" /> : <Typography variant="body1">{new Date(applicationData.submissionInfo?.interviewTime).toLocaleString()}</Typography>}</Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Regulatory Compliance Card */}
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Regulatory Compliance</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Anti-Corruption Declaration</Typography>{editMode ? <TextField type="checkbox" checked={editableData.regulatoryCompliance?.antiCorruptionDeclaration || false} onChange={(e) => handleNestedFieldChange('regulatoryCompliance', 'antiCorruptionDeclaration', e.target.checked)} size="small" /> : <Typography variant="body1">{applicationData.regulatoryCompliance?.antiCorruptionDeclaration ? 'Yes' : 'No'}</Typography>}</Grid>
                          <Grid item xs={12} md={6}><Typography variant="subtitle2" color="text.secondary">Data Privacy Consent</Typography>{editMode ? <TextField type="checkbox" checked={editableData.regulatoryCompliance?.dataPrivacyConsent || false} onChange={(e) => handleNestedFieldChange('regulatoryCompliance', 'dataPrivacyConsent', e.target.checked)} size="small" /> : <Typography variant="body1">{applicationData.regulatoryCompliance?.dataPrivacyConsent ? 'Yes' : 'No'}</Typography>}</Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Tasks</Typography>
                      <Button variant="contained" onClick={() => handleTaskClick(null)}>Request Supplementary Information</Button>
                    </Box>
                    
                    {/* New Filter Section */}
                    <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Search Tasks"
                        placeholder="Enter task name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => handleTaskFilter(e.target.value)}
                        sx={{ flexGrow: 1 }}
                      />
                      
                      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          label="Status"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<FilterListIcon />}
                        onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
                      >
                        More Filters
                      </Button>
                    </Paper>
                    
                    {/* Advanced Filter Collapse Section */}
                    <Collapse in={advancedFilterOpen}>
                      <Paper sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="STO"
                              placeholder="Filter by STO"
                              variant="outlined"
                              size="small"
                              fullWidth
                              onChange={(e) => setStoFilter(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Due Date From"
                              type="date"
                              variant="outlined"
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) => setDueDateFromFilter(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Due Date To"
                              type="date"
                              variant="outlined"
                              size="small"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              onChange={(e) => setDueDateToFilter(e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    </Collapse>
                    
                    {/* Filtered Task List */}
                    <List>
                      {filteredTasks.map((task) => (
                        <ListItem 
                          key={task.id} 
                          button 
                          onClick={() => handleTaskClick(task)}
                          sx={{ 
                            border: 1, 
                            borderColor: 'divider', 
                            borderRadius: 1.5, 
                            mb: 1.5, 
                            bgcolor: 'background.paper',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
                            '&:hover': { 
                              bgcolor: 'action.hover', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              transform: 'translateY(-2px)'
                            },
                            p: 1.5 // Padding inside list item
                          }}
                        >
                          <ListItemText 
                            primary={<Typography variant="subtitle1" fontWeight="medium">{task.name}</Typography>} 
                            secondary={`STO: ${task.sto} | SE: ${task.se} | Due: ${task.dueDate}`}
                            sx={{ mr: 2 }}
                          />
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color={task.status === 'Pending' ? 'primary' : (task.status === 'In Progress' ? 'warning' : 'success')}
                            sx={{ fontWeight: 'medium' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    {filteredTasks.length === 0 && (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No tasks match your filter criteria
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Attachments</Typography>
                    <AttachmentUpload />
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Related Cases</Typography>
                    <Grid container spacing={2}>
                      {relatedCases.map((relatedCase) => (
                        <Grid item xs={12} key={relatedCase.id}>
                          <Card>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="subtitle1">{relatedCase.title}</Typography>
                                  <Typography variant="body2" color="text.secondary">Case ID: {relatedCase.id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Chip
                                    size="small"
                                    label={relatedCase.status}
                                    color={relatedCase.status === 'Open' ? 'primary' : 'default'}
                                  />
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleCaseChange(relatedCase.id)}
                                  >
                                    View Case
                                  </Button>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                {tabValue === 4 && (                  <TimelineContainer>
                    {mockHistory.map((item, index) => (
                      <TimelineEntry key={index}>
                        <TimelineDot />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {item.date}
                          </Typography>
                          <Typography variant="body1">
                            {item.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.actor}
                          </Typography>
                          {index < mockHistory.length - 1 && <Divider sx={{ mt: 1, mb: 1 }} />}
                        </Box>
                      </TimelineEntry>
                    ))}
                  </TimelineContainer>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Task Detail Drawer */}
          <TaskDrawer
            anchor="right"
            open={taskDrawerOpen}
            onClose={handleTaskClose}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Typography variant="h6">
                  {selectedTask?.id ? 'Edit Task' : 'New Task'}
                </Typography>
                <IconButton onClick={handleTaskClose}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Task Name"
                      value={selectedTask?.name || ''}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, name: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Status"
                      value={selectedTask?.status || ''}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, status: e.target.value }))}
                      variant="outlined"
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="STO"
                      value={selectedTask?.sto || ''}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, officer: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      type="date"
                      value={selectedTask?.dueDate || ''}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      value={selectedTask?.description || ''}
                      onChange={(e) => setSelectedTask(prev => ({ ...prev, description: e.target.value }))}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {selectedTask?.id === 3 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{mt: 2}}>Application Checklist</Typography>
                      
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>1. Completeness of Application Form</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="80%">Item</TableCell>
                                  <TableCell align="center">Yes</TableCell>
                                  <TableCell align="center">No</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedTask && selectedTask.checklistData && selectedTask.checklistData.applicationForm.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.label}</TableCell>
                                    <TableCell align="center">
                                      <Checkbox 
                                        checked={item.checked === true}
                                        onChange={(e) => handleChecklistItemChange('applicationForm', item.id, e.target.checked)}
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Checkbox 
                                        checked={item.checked === false && item.checked !== null}
                                        onChange={(e) => handleChecklistItemChange('applicationForm', item.id, e.target.checked ? false : null)}
                                        size="small"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>2. Provision of Supporting Documents</Typography>
                          
                          <Typography variant="subtitle2" gutterBottom>2a (not applicable to applications of public officer)</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="80%">Item</TableCell>
                                  <TableCell align="center">Yes</TableCell>
                                  <TableCell align="center">No</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedTask && selectedTask.checklistData && selectedTask.checklistData.supportingDocuments
                                  .filter(item => !item.applicableToPublic)
                                  .map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        {item.label}
                                        {item.id === 'supportingDocs' && (
                                          <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            placeholder="Please specify:"
                                            variant="outlined"
                                            size="small"
                                            value={item.additionalNotes || ''}
                                            onChange={(e) => handleAdditionalNotesChange('supportingDocuments', item.id, e.target.value)}
                                            sx={{ mt: 1 }}
                                          />
                                        )}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Checkbox 
                                          checked={item.checked === true}
                                          onChange={(e) => handleChecklistItemChange('supportingDocuments', item.id, e.target.checked)}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Checkbox 
                                          checked={item.checked === false && item.checked !== null}
                                          onChange={(e) => handleChecklistItemChange('supportingDocuments', item.id, e.target.checked ? false : null)}
                                          size="small"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          
                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>2b (applicable to applications of public officer only)</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell width="80%">Item</TableCell>
                                  <TableCell align="center">Yes</TableCell>
                                  <TableCell align="center">No</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedTask && selectedTask.checklistData && selectedTask.checklistData.supportingDocuments
                                  .filter(item => item.applicableToPublic)
                                  .map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.label}</TableCell>
                                      <TableCell align="center">
                                        <Checkbox 
                                          checked={item.checked === true}
                                          onChange={(e) => handleChecklistItemChange('supportingDocuments', item.id, e.target.checked)}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <Checkbox 
                                          checked={item.checked === false && item.checked !== null}
                                          onChange={(e) => handleChecklistItemChange('supportingDocuments', item.id, e.target.checked ? false : null)}
                                          size="small"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>Task Records</Typography>
                    <TableContainer component={Paper} elevation={2}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Remarks</TableCell>
                            <TableCell>Officer</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {taskRecords.map((record, index) => (
                            <TableRow key={index}>
                              <TableCell>{record.date}</TableCell>
                              <TableCell>{record.action}</TableCell>
                              <TableCell>{record.remarks}</TableCell>
                              <TableCell>{record.officer}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom sx={{mt:1}}>Add New Record</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Action"
                          placeholder="Enter action taken"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Remarks"
                          placeholder="Enter remarks"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{textAlign: 'right'}}>
                        <Button variant="contained" size="small">Add Record</Button>
                      </Grid>
                    </Grid>
                  </Grid>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, p: 2, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleTaskClose}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={handleTaskSave}
                >
                  {selectedTask?.id ? 'Save Changes' : 'Create Task'}
                </Button>
              </Box>
            </Box>
          </TaskDrawer>
        </Box>
      </Box>
    </Box>
  );
};

export default CaseDetail;
