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
  FormControl,
  Menu,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterListIcon from '@mui/icons-material/FilterList';
import InputAdornment from '@mui/material/InputAdornment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Added VisibilityIcon
import BreadcrumbNav from '../common/BreadcrumbNav';
import AppSidebar from '../common/AppSidebar';
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
            "status": "attached",
            "fileName": "PE_Certificate_2015.pdf"
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
            "mimeType": "application/pdf",
            "fileName": "Consent_Form_Signed.pdf"
          },
          {
            "type": "sitePlan",
            "status": "pending",
            "remarks": "A3 size required"
          },
          {
            "type": "reaQualification",
            "status": "attached",
            "fileName": "MHKIE_Certificate.pdf",
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

  const handleViewRelatedCaseInNewTab = (relatedCaseId) => {
    window.open(`/cases/${relatedCaseId}`, '_blank');
  };

  const [tabValue, setTabValue] = useState(0); // Default to Application tab
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true); // For the main sidebar, default to open
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState(caseData.applicationForm || {});
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  
  // Task filtering state
  const [taskFilter, setTaskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dueDateFromFilter, setDueDateFromFilter] = useState('');
  const [dueDateToFilter, setDueDateToFilter] = useState('');
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [searchTaskActionBy, setSearchTaskActionBy] = useState('');
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);

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

  // Update the mock tasks to include multiple action by roles
  const mockTasks = [
    { 
      id: 1, 
      name: 'Prepare / Issue Acknowledgement Letter Annex F1', 
      status: 'Pending', 
      actionBy: {
        sto: 'STO/EEB5/1 (Tom)',
        engineer: 'E/EEB2/1 (Ken)',
        seniorEngineer: null,
        bsi: null,
        to: null,
        sbsi: null
      },
      description: 'Initial review of submitted documents', 
      dueDate: '2023-12-01',
      priority: 'High',
      progress: 30
    },
    { 
      id: 2, 
      name: 'Review Submitted Documents', 
      status: 'In Progress', 
      actionBy: {
        sto: null,
        engineer: 'E/EEB3/2 (Amy)',
        seniorEngineer: 'SE/EEB1/1 (David)',
        bsi: 'BSI/EEB2/2 (Sarah)',
        to: null,
        sbsi: null
      },
      description: 'Conduct on-site inspection', 
      dueDate: '2023-12-05',
      priority: 'Medium',
      progress: 50
    },
    { 
      id: 3, 
      name: 'Checklist for General Checking of Application Submission', 
      status: 'Pending', 
      actionBy: {
        sto: null,
        engineer: null,
        seniorEngineer: null,
        bsi: null,
        to: 'TO/EEB4/1 (Ben)',
        sbsi: 'SBSI/EEB3/1 (Ceci)'
      },
      description: 'Verify completeness of application form and supporting documents', 
      dueDate: '2023-12-03',
      priority: 'Medium',
      progress: 10,
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
      
      // Filter by Action By (considering all possible roles)
      const actionByMatch = searchTaskActionBy === '' || 
        (task.actionBy && (
          (task.actionBy.sto && task.actionBy.sto.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
          (task.actionBy.engineer && task.actionBy.engineer.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
          (task.actionBy.seniorEngineer && task.actionBy.seniorEngineer.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
          (task.actionBy.bsi && task.actionBy.bsi.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
          (task.actionBy.to && task.actionBy.to.toLowerCase().includes(searchTaskActionBy.toLowerCase())) ||
          (task.actionBy.sbsi && task.actionBy.sbsi.toLowerCase().includes(searchTaskActionBy.toLowerCase()))
        ));
      
      // Filter by due date range
      const dueDateMatch = (
        (dueDateFromFilter === '' || new Date(task.dueDate) >= new Date(dueDateFromFilter)) &&
        (dueDateToFilter === '' || new Date(task.dueDate) <= new Date(dueDateToFilter))
      );
      
      return nameMatch && statusMatch && actionByMatch && dueDateMatch;
    });
  }, [mockTasks, taskFilter, statusFilter, searchTaskActionBy, dueDateFromFilter, dueDateToFilter]);

  const renderAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.flat || ''} ${address.floor || ''} ${address.block || ''} ${address.building || ''}, ${address.street || ''}, ${address.city || ''}`.replace(/\s+/g, ' ').trim();
  };

  // Helper function to format action by information
  const formatActionBy = (actionBy) => {
    if (!actionBy) return 'N/A';
    
    const roles = [];
    if (actionBy.sto) roles.push(actionBy.sto);
    if (actionBy.engineer) roles.push(actionBy.engineer);
    if (actionBy.seniorEngineer) roles.push(actionBy.seniorEngineer);
    if (actionBy.bsi) roles.push(actionBy.bsi);
    if (actionBy.to) roles.push(actionBy.to);
    if (actionBy.sbsi) roles.push(actionBy.sbsi);
    
    return roles.length > 0 ? roles.join(', ') : 'Not Assigned';
  };



  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <AppSidebar
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      {/* Main content */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflow: 'hidden',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
      }}>
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Cases', path: '/cases' },
          { label: caseData.caseId, path: `/cases/${caseData.caseId}` }
        ]} />

        <Box sx={{ display: 'flex', height: 'calc(100vh - 80px)', gap: 1 }}>
          {/* Main Panel - full width */}
          <Box
            sx={{
              width: '100%',
              minWidth: 300,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Card sx={{ mb: 1, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ pb: '8px !important', pt: 1.5, px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: detailsExpanded ? 1 : 0 }}>
                  <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 'medium' }}>Case Details</Typography>
                  {!detailsExpanded && (
                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                      EMSD/EEO/BC/19/01/06 | {caseData.caseType}
                    </Typography>
                  )}
                  <Chip
                    label={caseData.status}
                    color={caseData.status === 'Open' ? 'primary' : (caseData.status === 'In Progress' ? 'primary' : (caseData.status === 'Pending' ? 'warning' : (caseData.status === 'Rejected' ? 'error' : (caseData.status === 'Completed' || caseData.status === 'Closed' ? 'success' : 'default'))))}
                    size="small"
                    sx={{ height: '22px', '& .MuiChip-label': { px: 1, py: 0.25, fontSize: '0.75rem' }, ml: 1 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setDetailsExpanded(!detailsExpanded)}
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    {detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>
                <Collapse in={detailsExpanded} timeout="auto">
                  <Grid container spacing={0.75} sx={{ mt: 0 }}> {/* Reduced spacing for denser info */}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>Case No.</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.caseId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>File No.</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>EMSD/EEO/BC/19/01/06</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>Subject Engineer</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.caseEngineer}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>Case Type</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.caseType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>Created Date</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.createdDate}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>WBRS No.</Typography>
                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.wbrsNo}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold', fontSize: '0.7rem', mb: 0.5 }}>Description</Typography>
                      <Typography variant="body2" sx={{ maxHeight: 60, overflowY: 'auto', bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{caseData.description}</Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>

            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'none', borderRadius: '0 0 8px 8px', height: detailsExpanded ? 'calc(100% - 140px)' : 'calc(100% - 50px)' }}> {/* Rounded bottom corners with dynamic height */}
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
                    padding: '8px 12px',
                    minHeight: '40px',
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
              <Box sx={{ flex: 1, p: 1.5, overflow: 'auto', bgcolor: 'white', height: '100%' }}> {/* Added height: 100% */}
                {tabValue === 0 && applicationData && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                      <Button
                        variant={editMode ? 'contained' : 'outlined'}
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode((prev) => !prev)}
                        sx={{ height: '30px', fontSize: '0.8rem' }}
                      >
                        {editMode ? 'Save' : 'Edit'}
                      </Button>
                    </Box>
                    {caseData.caseType === 'COCR S1' ? (
                      <>
                        {/* Building Information Card */}
                        <Card sx={{ mb: 1 }}>
                          <CardContent sx={{ p: "8px 16px !important" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Building Information</Typography>
                            <Grid container spacing={1}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Building Name (English)</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.buildingInfo?.name?.english || ''}
                                      onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', { ...editableData.buildingInfo?.name, english: e.target.value })}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.name?.english}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Building Name (Chinese)</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.buildingInfo?.name?.chinese || ''}
                                      onChange={(e) => handleNestedFieldChange('buildingInfo', 'name', { ...editableData.buildingInfo?.name, chinese: e.target.value })}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.name?.chinese}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              {/* Add building address fields */}
                              <Grid item xs={12}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Building Address</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
                                      value={`${applicationData.buildingInfo?.address?.streetNo || ''} ${applicationData.buildingInfo?.address?.streetEnglish || ''}, ${applicationData.buildingInfo?.address?.districtEnglish || ''}`}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>
                                      {`${applicationData.buildingInfo?.address?.streetNo || ''} ${applicationData.buildingInfo?.address?.streetEnglish || ''}, ${applicationData.buildingInfo?.address?.districtEnglish || ''}`}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Building Category</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.buildingInfo?.buildingCategory?.join(", ") || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.buildingCategory?.join(", ")}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Lot Number</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.buildingInfo?.lotNo || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.lotNo}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Total Gross Floor Area (m²)</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      type="number"
                                      value={editableData.buildingInfo?.grossFloorArea?.total || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.grossFloorArea?.total}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Commercial Portion (m²)</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      type="number"
                                      value={editableData.buildingInfo?.grossFloorArea?.commercialPortion || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.buildingInfo?.grossFloorArea?.commercialPortion}</Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        
                        {/* Declaration Information Card */}
                        <Card sx={{ mb: 1 }}>
                          <CardContent sx={{ p: "8px 16px !important" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Declaration Information</Typography>
                            <Grid container spacing={1}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Submission Purpose</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.declarationInfo?.submissionPurpose || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.declarationInfo?.submissionPurpose}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Previous Reference</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      value={editableData.declarationInfo?.previousReference || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.declarationInfo?.previousReference}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Consent Date</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      type="date"
                                      value={editableData.declarationInfo?.consentDate || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.declarationInfo?.consentDate}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Construction Start Date</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      type="date"
                                      value={editableData.declarationInfo?.constructionStartDate || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.declarationInfo?.constructionStartDate}</Typography>
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} md={4}>
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Occupancy Approval Date</Typography>
                                  {editMode ? (
                                    <TextField
                                      fullWidth
                                      type="date"
                                      value={editableData.declarationInfo?.occupancyApprovalDate || ''}
                                      size="small"
                                      margin="dense"
                                      sx={{ mt: 0.5 }}
                                    />
                                  ) : (
                                    <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.declarationInfo?.occupancyApprovalDate}</Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        
                        {/* Supporting Files Card */}
                        <Card sx={{ mb: 1 }}>
                          <CardContent sx={{ p: "8px 16px !important" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Supporting Files</Typography>
                            <Grid container spacing={1}>
                              {applicationData.supportingFiles?.map((doc, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>{doc.type}</Typography>
                                    {editMode ? (
                                      <TextField fullWidth value={editableData.supportingFiles?.[index]?.status || ''} onChange={(e) => handleNestedFieldChange('supportingFiles', index, { ...editableData.supportingFiles?.[index], status: e.target.value })} size="small" margin="dense" select>
                                        <MenuItem value="attached">Attached</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="not required">Not Required</MenuItem>
                                      </TextField>
                                    ) : (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip 
                                          label={doc.status} 
                                          size="small" 
                                          color={doc.status === 'attached' ? 'success' : (doc.status === 'pending' ? 'primary' : 'warning')}
                                          sx={{ height: '22px', '& .MuiChip-label': { px: 1, py: 0.25, fontSize: '0.75rem' } }}
                                        />
                                        {doc.status === 'attached' && doc.fileName && (
                                          <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', cursor: 'pointer' }}>
                                            {doc.fileName}
                                          </Typography>
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      /* Applicant Information Card */
                      <Card sx={{ mb: 1 }}>
                        <CardContent sx={{ p: "8px 16px !important" }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Applicant Information</Typography>
                          <Grid container spacing={1}>
                            {/* Application Type */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Application Type</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.applicationType || ''}
                                    onChange={(e) => handleFieldChange('applicationType', e.target.value)}
                                    size="small"
                                    margin="dense"
                                    sx={{ mt: 0.5 }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicationType}</Typography>
                                )}
                              </Box>
                            </Grid>
                            {/* Company Name */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Company Name</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.applicantInfo?.currentCompany?.name || ''}
                                    onChange={(e) => handleNestedFieldChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany, name: e.target.value })}
                                    size="small"
                                    margin="dense"
                                    sx={{ mt: 0.5 }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicantInfo?.currentCompany?.name}</Typography>
                                )}
                              </Box>
                            </Grid>
                            {/* Position */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Position</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.applicantInfo?.position || ''}
                                    onChange={(e) => handleNestedFieldChange('applicantInfo', 'position', e.target.value)}
                                    size="small"
                                    margin="dense"
                                    sx={{ mt: 0.5 }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicantInfo?.position}</Typography>
                                )}
                              </Box>
                            </Grid>
                            {/* Office Phone */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Office Phone</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.applicantInfo?.contact?.officePhone || ''}
                                    onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', { ...editableData.applicantInfo?.contact, officePhone: e.target.value })}
                                    size="small"
                                    margin="dense"
                                    sx={{ mt: 0.5 }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicantInfo?.contact?.officePhone}</Typography>
                                )}
                              </Box>
                            </Grid>
                            {/* Fax */}
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Fax</Typography>
                                {editMode ? (
                                  <TextField
                                    fullWidth
                                    value={editableData.applicantInfo?.contact?.fax || ''}
                                    onChange={(e) => handleNestedFieldChange('applicantInfo', 'contact', { ...editableData.applicantInfo?.contact, fax: e.target.value })}
                                    size="small"
                                    margin="dense"
                                    sx={{ mt: 0.5 }}
                                  />
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicantInfo?.contact?.fax}</Typography>
                                )}
                              </Box>
                            </Grid>
                            {/* Address */}
                            <Grid item xs={12}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Address</Typography>
                                {editMode ? (
                                  <Grid container spacing={1}>
                                    <Grid item xs={12} sm={2}><TextField fullWidth label="Flat" value={editableData.applicantInfo?.currentCompany?.address?.flat || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, flat: e.target.value })} size="small" margin="dense" /></Grid>
                                    <Grid item xs={12} sm={2}><TextField fullWidth label="Floor" value={editableData.applicantInfo?.currentCompany?.address?.floor || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, floor: e.target.value })} size="small" margin="dense" /></Grid>
                                    <Grid item xs={12} sm={2}><TextField fullWidth label="Block" value={editableData.applicantInfo?.currentCompany?.address?.block || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, block: e.target.value })} size="small" margin="dense" /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Building" value={editableData.applicantInfo?.currentCompany?.address?.building || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, building: e.target.value })} size="small" margin="dense" /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="Street" value={editableData.applicantInfo?.currentCompany?.address?.street || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, street: e.target.value })} size="small" margin="dense" /></Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth label="City" value={editableData.applicantInfo?.currentCompany?.address?.city || ''} onChange={(e) => handleAddressChange('applicantInfo', 'currentCompany', { ...editableData.applicantInfo?.currentCompany?.address, city: e.target.value })} size="small" margin="dense" /></Grid>
                                  </Grid>
                                ) : (
                                  <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{renderAddress(applicationData.applicantInfo?.currentCompany?.address)}</Typography>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {caseData.caseType === 'REA Registration' && (
                      /* Qualifications Card */
                      <Card sx={{ mb: 1 }}>
                        <CardContent sx={{ p: "8px 16px !important" }}>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Qualifications</Typography>
                          {applicationData.qualifications?.map((qual, index) => (
                            <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
                              <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Type</Typography>
                                    {editMode ? (
                                      <TextField fullWidth value={editableData.qualifications?.[index]?.type || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], type: e.target.value })} size="small" margin="dense" />
                                    ) : (
                                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{qual.type}</Typography>
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Registration Number</Typography>
                                    {editMode ? (
                                      <TextField fullWidth value={editableData.qualifications?.[index]?.registrationNumber || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], registrationNumber: e.target.value })} size="small" margin="dense" />
                                    ) : (
                                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{qual.registrationNumber}</Typography>
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Discipline</Typography>
                                    {editMode ? (
                                      <TextField fullWidth value={editableData.qualifications?.[index]?.discipline || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], discipline: e.target.value })} size="small" margin="dense" />
                                    ) : (
                                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{qual.discipline}</Typography>
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Year of Qualification</Typography>
                                    {editMode ? (
                                      <TextField fullWidth type="number" value={editableData.qualifications?.[index]?.yearOfQualification || ''} onChange={(e) => handleNestedFieldChange('qualifications', index, { ...editableData.qualifications?.[index], yearOfQualification: parseInt(e.target.value) })} size="small" margin="dense" />
                                    ) : (
                                      <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{qual.yearOfQualification}</Typography>
                                    )}
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Supporting Documents Card */}
                    <Card sx={{ mb: 1 }}>
                      <CardContent sx={{ p: "8px 16px !important" }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Supporting Documents</Typography>
                        <Grid container spacing={1}>
                          {applicationData.supportingDocuments?.map((doc, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>{doc.documentType}</Typography>
                                {editMode ? (
                                  <TextField fullWidth value={editableData.supportingDocuments?.[index]?.status || ''} onChange={(e) => handleNestedFieldChange('supportingDocuments', index, { ...editableData.supportingDocuments?.[index], status: e.target.value })} size="small" margin="dense" select>
                                    <MenuItem value="attached">Attached</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="not required">Not Required</MenuItem>
                                  </TextField>
                                ) : (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip 
                                      label={doc.status} 
                                      size="small" 
                                      color={doc.status === 'attached' ? 'success' : (doc.status === 'pending' ? 'primary' : 'warning')}
                                      sx={{ height: '22px', '& .MuiChip-label': { px: 1, py: 0.25, fontSize: '0.75rem' } }}
                                    />
                                    {doc.status === 'attached' && doc.fileName && (
                                      <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', cursor: 'pointer' }}>
                                        {doc.fileName}
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>

                    {/* Application Fee Card */}
                    <Card sx={{ mb: 1 }}>
                      <CardContent sx={{ p: "8px 16px !important" }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 }}>Application Fee</Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Amount</Typography>
                              {editMode ? (
                                <TextField fullWidth type="number" value={editableData.applicationFee?.amount || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'amount', parseFloat(e.target.value))} size="small" margin="dense" />
                              ) : (
                                <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicationFee?.amount}</Typography>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Currency</Typography>
                              {editMode ? (
                                <TextField fullWidth value={editableData.applicationFee?.currency || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'currency', e.target.value)} size="small" margin="dense" />
                              ) : (
                                <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicationFee?.currency}</Typography>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Payment Method</Typography>
                              {editMode ? (
                                <TextField fullWidth value={editableData.applicationFee?.paymentMethod || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'paymentMethod', e.target.value)} size="small" margin="dense" />
                              ) : (
                                <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicationFee?.paymentMethod}</Typography>
                              )}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <Box sx={{ mb: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Reference Number</Typography>
                              {editMode ? (
                                <TextField fullWidth value={editableData.applicationFee?.referenceNumber || ''} onChange={(e) => handleNestedFieldChange('applicationFee', 'referenceNumber', e.target.value)} size="small" margin="dense" />
                              ) : (
                                <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1 }}>{applicationData.applicationFee?.referenceNumber}</Typography>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Tasks</Typography>
                      <Box>
                        <Button 
                          variant="contained" 
                          size="small"
                          startIcon={<MoreVertIcon />}
                          onClick={(event) => setActionMenuAnchorEl(event.currentTarget)}
                        >
                          Actions
                        </Button>
                        <Menu
                          anchorEl={actionMenuAnchorEl}
                          open={Boolean(actionMenuAnchorEl)}
                          onClose={() => setActionMenuAnchorEl(null)}
                        >
                          <MenuItem onClick={() => {
                            handleTaskClick(null);
                            setActionMenuAnchorEl(null);
                          }}>
                            <ListItemIcon>
                              <NoteAddIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Request Supplement</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // Handle other action
                            setActionMenuAnchorEl(null);
                          }}>
                            <ListItemIcon>
                              <CancelIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Withdraw</ListItemText>
                          </MenuItem>
                          <MenuItem onClick={() => {
                            // Handle other action
                            setActionMenuAnchorEl(null);
                          }}>
                            <ListItemIcon>
                              <BlockIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            <ListItemText>Reject</ListItemText>
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                    
                    {/* New Filter Section */}
                    <Paper sx={{ p: 2, mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Search Tasks"
                        placeholder="Enter task name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={taskFilter}
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
                        variant="text" 
                        size="small"
                        onClick={() => setAdvancedFilterOpen(!advancedFilterOpen)}
                        startIcon={<FilterListIcon fontSize="small" />}
                        sx={{ minWidth: 'unset' }}
                      >
                        More
                      </Button>
                      
                      <Button 
                        variant="text" 
                        size="small"
                        color="secondary"
                        onClick={() => {
                          setTaskFilter('');
                          setStatusFilter('');
                          setDueDateFromFilter('');
                          setDueDateToFilter('');
                          setAdvancedFilterOpen(false);
                        }}
                        sx={{ minWidth: 'unset' }}
                      >
                        Clear
                      </Button>
                    </Paper>
                    
                    {/* Advanced Filter Collapse Section */}
                    <Collapse in={advancedFilterOpen}>
                      <Paper sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Action By"
                              placeholder="Filter by any role"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={searchTaskActionBy}
                              onChange={(e) => setSearchTaskActionBy(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="Due Date From"
                              type="date"
                              variant="outlined"
                              size="small"
                              fullWidth
                              value={dueDateFromFilter}
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
                              value={dueDateToFilter}
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
                            secondary={
                              <Box sx={{ mt: 0.5 }}>
                                <Typography variant="body2" component="span" sx={{ display: 'inline-block', mr: 2 }}>
                                  <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Due: </Typography>
                                  {task.dueDate}
                                </Typography>
                                <Typography variant="body2" component="span">
                                  <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>Action By: </Typography>
                                  {formatActionBy(task.actionBy)}
                                </Typography>
                              </Box>
                            }
                            sx={{ mr: 1 }} // Reduced margin from mr: 2 to mr: 1
                          />
                          <Chip 
                            label={task.status} 
                            size="small" 
                            color={task.status === 'In Progress' ? 'primary' : (task.status === 'Pending' ? 'warning' : (task.status === 'Rejected' ? 'error' : (task.status === 'Completed' || task.status === 'Closed' ? 'success' : 'default')))}
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
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: "12px 16px !important" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Attachments</Typography>
                          <TextField
                            placeholder="Search attachments"
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: '250px' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell>File Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Uploaded By</TableCell>
                            <TableCell>Upload Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AssignmentIcon fontSize="small" /> Application_Form.pdf
                              </Typography>
                            </TableCell>
                            <TableCell>REA Application Form</TableCell>
                            <TableCell>PDF</TableCell>
                            <TableCell>John Doe</TableCell>
                            <TableCell>2023-11-20</TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AssignmentIcon fontSize="small" /> Professional_Certificate.pdf
                              </Typography>
                            </TableCell>
                            <TableCell>Professional Engineering Certificate</TableCell>
                            <TableCell>PDF</TableCell>
                            <TableCell>John Doe</TableCell>
                            <TableCell>2023-11-20</TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography variant="body2" component="a" href="#" sx={{ textDecoration: 'underline', color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AssignmentIcon fontSize="small" /> Experience_Letter.pdf
                              </Typography>
                            </TableCell>
                            <TableCell>Experience Verification Letter</TableCell>
                            <TableCell>PDF</TableCell>
                            <TableCell>John Doe</TableCell>
                            <TableCell>2023-11-20</TableCell>
                            <TableCell>
                              <IconButton size="small">
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2 }}>
                      <AttachmentUpload />
                    </Box>
                  </Box>
                )}
                {tabValue === 3 && (
                  <Box>
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: "12px 16px !important" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Related Cases</Typography>
                          <TextField
                            placeholder="Search related cases"
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                            sx={{ width: '250px' }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell>Case ID</TableCell>
                            <TableCell>File No.</TableCell>
                            <TableCell>Case Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created Date</TableCell>
                            {/* <TableCell>Actions</TableCell> */} {/* Removed Actions header */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {relatedCases.map((relatedCase) => (
                            <TableRow key={relatedCase.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ mr: 0.5 }}>{relatedCase.id}</Typography>
                                  <Tooltip title="View Case Details">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewRelatedCaseInNewTab(relatedCase.id)}
                                      color="primary"
                                    >
                                      <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell>{casesData[relatedCase.id].fileNo}</TableCell>
                              <TableCell>{casesData[relatedCase.id].caseType}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  label={relatedCase.status}
                                  color={relatedCase.status === 'Open' ? 'primary' : (relatedCase.status === 'In Progress' ? 'primary' : (relatedCase.status === 'Pending' ? 'warning' : (relatedCase.status === 'Rejected' ? 'error' : (relatedCase.status === 'Completed' || relatedCase.status === 'Closed' ? 'success' : 'default'))))}
                                  sx={{ height: '22px', '& .MuiChip-label': { px: 1, py: 0.25, fontSize: '0.75rem' } }}
                                />
                              </TableCell>
                              <TableCell>{casesData[relatedCase.id].createdDate}</TableCell>
                              {/*
                              <TableCell>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleCaseChange(relatedCase.id)} // This would change view in current tab
                                  sx={{ height: '24px', fontSize: '0.75rem', minWidth: '60px' }}
                                >
                                  View
                                </Button>
                              </TableCell>
                              */}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                {tabValue === 4 && (
                  <Box>
                    <Card sx={{ mb: 2 }}>
                      <CardContent sx={{ p: "12px 16px !important" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Case History</Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                              <InputLabel>Filter by</InputLabel>
                              <Select
                                label="Filter by"
                                value=""
                              >
                                <MenuItem value="all">All Events</MenuItem>
                                <MenuItem value="task">Task Events</MenuItem>
                                <MenuItem value="document">Document Events</MenuItem>
                                <MenuItem value="status">Status Changes</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                      <TimelineContainer>
                        {mockHistory.map((item, index) => (
                          <TimelineEntry key={index}>
                            <TimelineDot />
                            <Box sx={{ flex: 1 }}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                                    {item.date}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                  <Typography variant="body2">
                                    {item.action}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <Typography variant="caption" color="text.secondary">
                                    By: {item.actor}
                                  </Typography>
                                </Grid>
                              </Grid>
                              {index < mockHistory.length - 1 && <Divider sx={{ mt: 1.5, mb: 1.5 }} />}
                            </Box>
                          </TimelineEntry>
                        ))}
                      </TimelineContainer>
                    </Paper>
                  </Box>
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

              <Box sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                {/* Task Info Panel */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}>
                          {selectedTask?.name || 'New Task'}
                        </Typography>
                        <Chip 
                          label={selectedTask?.status || 'New'} 
                          size="small" 
                          color={selectedTask?.status === 'In Progress' ? 'primary' : (selectedTask?.status === 'Pending' ? 'warning' : (selectedTask?.status === 'Rejected' ? 'error' : (selectedTask?.status === 'Completed' || selectedTask?.status === 'Closed' ? 'success' : 'default')))}
                        />
                      </Box>
                      
                      {/* Description */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>Description:</Typography>
                        <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'grey.50' }}>
                          <Typography variant="body2">
                            {selectedTask?.description || 'No description available'}
                          </Typography>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Action By Panel */}
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Action By
                  </Typography>
                  
                  <Grid container spacing={1.5}>
                    {[
                      { label: 'Senior Engineer', field: 'seniorEngineer' },
                      { label: 'Engineer', field: 'engineer' },
                      { label: 'STO', field: 'sto' },
                      { label: 'SBSI', field: 'sbsi' },
                      { label: 'BSI', field: 'bsi' },
                      { label: 'TO', field: 'to' }
                    ].map((role) => (
                      // Only render the field if it's assigned or in new task mode
                      (selectedTask?.id ? selectedTask?.actionBy?.[role.field] : true) && (
                        <Grid item xs={6} sm={4} key={role.field}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>{role.label}</Typography>
                            {selectedTask?.id ? (
                              <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1, height: '32px', display: 'flex', alignItems: 'center' }}>
                                {selectedTask?.actionBy?.[role.field] || 'Not assigned'}
                              </Typography>
                            ) : (
                              <TextField
                                fullWidth
                                placeholder={`Assign ${role.label}`}
                                size="small"
                                margin="dense"
                                sx={{ mt: 0.5 }}
                              />
                            )}
                          </Box>
                        </Grid>
                      )
                    ))}
                    
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 'bold' }}>Due Date</Typography>
                        {selectedTask?.id ? (
                          <Typography variant="body2" sx={{ bgcolor: 'grey.50', p: 0.75, borderRadius: 1, height: '32px', display: 'flex', alignItems: 'center' }}>
                            {selectedTask?.dueDate || 'Not set'}
                          </Typography>
                        ) : (
                          <TextField
                            fullWidth
                            type="date"
                            size="small"
                            margin="dense"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    
                  </Grid>

                  {/* Add approval section for tasks that need Senior Engineer approval */}
                  {selectedTask?.id === 3 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                        Approval Required
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2">
                          This task requires approval by the assigned Senior Engineer
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small"
                          sx={{ ml: 'auto' }}
                        >
                          Approve
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
                
                {/* Task Checklist Section (if available) */}
                {selectedTask?.checklistData && (
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Application Checklist
                    </Typography>
                    
                    <TableContainer sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <Table size="small" sx={{ tableLayout: 'fixed', '& td, & th': { px: 1, py: 0.75 } }}>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell width="70%">Item</TableCell>
                            <TableCell align="center" width="15%">Yes</TableCell>
                            <TableCell align="center" width="15%">No</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedTask.checklistData.applicationForm.map((item) => (
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
                          
                          <TableRow>
                            <TableCell colSpan={3} sx={{ py: 1, bgcolor: 'grey.100' }}>
                              <Typography variant="subtitle2">Supporting Documents</Typography>
                            </TableCell>
                          </TableRow>
                          
                          {selectedTask.checklistData.supportingDocuments
                            .filter(item => !item.applicableToPublic)
                            .map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.label}
                                  {item.id === 'supportingDocs' && (
                                    <TextField
                                      fullWidth
                                      multiline
                                      rows={2}
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
                  </Box>
                )}
                
                {/* Task Records Table */}
                <Box sx={{ bgcolor: 'background.paper', p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Task Records
                    <Button variant="outlined" size="small" startIcon={<AddIcon fontSize="small" />}>
                      Add Record
                    </Button>
                  </Typography>
                  
                  <TableContainer sx={{ mb: 2 }}>
                    <Table size="small" sx={{ '& td, & th': { px: 1, py: 0.75 } }}>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                          <TableCell width="20%">Date</TableCell>
                          <TableCell width="20%">Action</TableCell>
                          <TableCell width="40%">Remarks</TableCell>
                          <TableCell width="20%">Officer</TableCell>
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
                </Box>
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
