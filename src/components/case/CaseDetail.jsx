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
import AppSidebar from '../common/AppSidebar';
import AttachmentUpload from '../common/AttachmentUpload';
import CaseDetailTabs from './CaseDetailTabs'; // Import the new Tabs component

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
    description: 'REA registration application - Updated to match WBRS001 structure',
    applicationForm: {
        "applicationType": "new", 
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
            // "imageData": "base64EncodedImageString" // Removed as not in WBRS mock or form
          }
        },
        "qualifications": [
          {
            "qualificationType": "registeredProfessionalEngineer",
            "dateOfQualification": "2015-05-10",
            "membershipNo": "RPE12345",
            "disciplines": ["BSS", "ELL"],
            "professionalBody": "",
            "disciplineAttachments": [
              { "discipline": "BSS", "fileName": "BSS_RPE_Cert.pdf", "fileSize": "1.2MB" },
              { "discipline": "ELL", "fileName": "ELL_RPE_Cert.pdf", "fileSize": "1.1MB" }
            ]
          },
          {
            "qualificationType": "corporateMemberHKIE",
            "dateOfQualification": "2016-07-20",
            "membershipNo": "HKIE98765",
            "disciplines": ["ENV"],
            "professionalBody": "",
            "disciplineAttachments": [
              { "discipline": "ENV", "fileName": "ENV_HKIE_Cert.pdf", "fileSize": "0.9MB" }
            ]
          },
          {
            "qualificationType": "equivalentQualification",
            "dateOfQualification": "2017-02-15",
            "membershipNo": "EQM45678",
            "disciplines": ["MCL"],
            "professionalBody": "Institution of Mechanical Engineers (IMechE)",
            "disciplineAttachments": [
              { "discipline": "MCL", "fileName": "MCL_EQ_Cert.pdf", "fileSize": "1.5MB" }
            ]
          },
          {
            "qualificationType": "other",
            "dateOfQualification": "2018-11-01", 
            "membershipNo": "", 
            "disciplines": [], 
            "description": "Certified Energy Manager (CEM)",
            "otherAttachment": { "fileName": "CEM_Cert.pdf", "size": "0.8MB" }
          }
        ],
        "practicalExperience": [
          {
            "id": "exp1", // Added ID for keying if needed
            "startDate": "2018-03-01",
            "endDate": "2021-08-31",
            "position": "Energy Auditor",
            "company": "XYZ Consultants",
            "description": "Conducted energy audits for 20+ commercial buildings under BEAM Plus certification",
            "attachment": {
              "fileName": "Energy_Auditor_Experience_Letter.pdf",
              "fileSize": "1.8MB"
            }
          },
          {
            "id": "exp2",
            "startDate": "2021-09-01",
            "endDate": "2023-10-05",
            "position": "Energy Manager",
            "company": "GreenTech Solutions",
            "description": "Led implementation of ISO 50001 energy management system in industrial facilities",
            "attachment": {
              "fileName": "Energy_Manager_Reference_Letter.pdf",
              "fileSize": "2.1MB"
            }
          }
        ],
        "supportingDocuments": [
          {
            "id": "sd1", // Added ID
            "documentType": "professionalQualificationProof",
            "status": "attached",
            "fileName": "PE_Certificate_2015.pdf"
          },
          {
            "id": "sd2",
            "documentType": "experienceVerificationLetter",
            "status": "pending",
            "fileName": null
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
          // "interviewScheduled": true, // Not in WBRS REA form, can be added if needed by CaseDetail
          // "interviewTime": "2023-10-12T10:00:00"
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
  
  const handleSaveApplicationForm = () => {
    // Logic to save the editableData
    // For now, just log it and potentially update the main casesData mock
    console.log("Saving Application Form:", editableData);
    // Potentially update casesData if this were a real backend:
    // Object.assign(casesData[caseId], { applicationForm: { ...editableData } });
    setEditMode(false); // Exit edit mode after saving
  };
  
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
  
  // Handler for deeply nested fields (3 levels) like applicantInfo.contact.officePhone
  const handleDeepNestedFieldChange = (section, subSection, field, value) => {
    setEditableData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section]?.[subSection],
          [field]: value
        }
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

  // More specific address handler for the new structure in CaseDetailTabs
  const handleTabAddressChange = (sectionPath, field, value) => {
    setEditableData(prev => {
      const pathParts = sectionPath.split('.');
      let currentLevel = prev;
      for (let i = 0; i < pathParts.length -1; i++) {
        currentLevel = currentLevel[pathParts[i]];
      }
      currentLevel[pathParts[pathParts.length-1]] = {
        ...currentLevel[pathParts[pathParts.length-1]],
        [field]: value
      };
      return {...prev};
    });
  };

  // ADDING/ADAPTING HANDLERS TO MATCH WBRSDetail/GenericApplicationForm EXPECTATIONS
  const handleSimpleFieldChange = (section, field, value) => {
    setEditableData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayObjectChange = (arrayName, index, field, value) => {
    setEditableData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      if (newArray[index]) {
        newArray[index] = { ...newArray[index], [field]: value };
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleQualificationAttachmentChange = (qualIndex, disciplineOrOther, attachmentDetails) => {
    setEditableData(prev => {
      const newQualifications = JSON.parse(JSON.stringify(prev.qualifications || [])); // Deep copy
      if (newQualifications[qualIndex]) {
        if (newQualifications[qualIndex].qualificationType === 'other') {
          newQualifications[qualIndex].otherAttachment = {
            ...(newQualifications[qualIndex].otherAttachment || {}),
            fileName: attachmentDetails.fileName,
            size: attachmentDetails.fileSize // Use 'size' to match mock data in CaseDetail.jsx
          };
        } else {
          let newDisciplineAttachments = newQualifications[qualIndex].disciplineAttachments || [];
          const attachmentIndex = newDisciplineAttachments.findIndex(att => att.discipline === disciplineOrOther);
          if (attachmentIndex > -1) {
            newDisciplineAttachments[attachmentIndex] = {
              ...newDisciplineAttachments[attachmentIndex],
              fileName: attachmentDetails.fileName,
              fileSize: attachmentDetails.fileSize // Use 'fileSize' to match mock data in CaseDetail.jsx
            };
          } else {
            newDisciplineAttachments.push({ 
              discipline: disciplineOrOther, 
              fileName: attachmentDetails.fileName, 
              fileSize: attachmentDetails.fileSize 
            });
          }
          newQualifications[qualIndex].disciplineAttachments = newDisciplineAttachments;
        }
      }
      return { ...prev, qualifications: newQualifications };
    });
  };

  // Adapting existing handleTabAddressChange to match GenericApplicationForm's handleAddressChange signature
  const adaptedAddressChangeHandler = (section, subSection, field, value) => {
    // section is like 'applicantInfo', subSection is 'currentCompany', field is 'flat', value is the new value
    setEditableData(prev => {
        const updatedSection = {
            ...prev[section],
            [subSection]: {
                ...prev[section]?.[subSection],
                address: {
                    ...(prev[section]?.[subSection]?.address || {}),
                    [field]: value
                }
            }
        };
        return {
            ...prev,
            [section]: updatedSection
        };
    });
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
        p: 1.5,
        overflowY: 'auto',
        transition: theme => theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0
      }}>
        {/* <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Cases', path: '/cases' },
          { label: caseData.caseId, path: `/cases/${caseData.caseId}` }
        ]} /> */}

        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)', gap: 1 }}>
          {/* Main Panel - full width */}
          <Box
            sx={{
              width: '100%',
              minWidth: 300,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Card sx={{ 
              mb: 1.5,
              flexShrink: 0, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: 2
            }}>
              <CardContent sx={{ p: '12px !important', pb: '12px !important' }}>
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
                    size="medium"
                    sx={{ fontWeight: 'bold', fontSize:'0.8rem', height:'28px', ml: 1 }}
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

            {/* Use the new CaseDetailTabs component */}
            <CaseDetailTabs
                currentTab={tabValue}
                handleTabChange={(e, v) => setTabValue(v)}
                caseData={caseData}
                applicationData={applicationData}
                editMode={editMode}
                setEditMode={setEditMode}
                editableData={editableData}
                handleFieldChange={handleFieldChange}
                handleNestedFieldChange={handleDeepNestedFieldChange}
                handleAddressChange={adaptedAddressChangeHandler}
                handleSimpleFieldChange={handleNestedFieldChange}
                handleArrayObjectChange={handleArrayObjectChange}
                handleQualificationAttachmentChange={handleQualificationAttachmentChange}
                // Tasks Tab Props
                filteredTasks={filteredTasks}
                taskFilter={taskFilter}
                handleTaskFilter={handleTaskFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                advancedFilterOpen={advancedFilterOpen}
                setAdvancedFilterOpen={setAdvancedFilterOpen}
                searchTaskActionBy={searchTaskActionBy}
                setSearchTaskActionBy={setSearchTaskActionBy}
                dueDateFromFilter={dueDateFromFilter}
                setDueDateFromFilter={setDueDateFromFilter}
                dueDateToFilter={dueDateToFilter}
                setDueDateToFilter={setDueDateToFilter}
                handleTaskClick={handleTaskClick}
                formatActionBy={formatActionBy}
                actionMenuAnchorEl={actionMenuAnchorEl}
                setActionMenuAnchorEl={setActionMenuAnchorEl}
                // Attachments Tab Props (add mockAttachments or real data later)
                // relatedCases already passed via caseData/applicationData if needed
                // or pass directly if CaseDetailTabs filters them itself
                relatedCases={relatedCases}
                handleViewRelatedCaseInNewTab={handleViewRelatedCaseInNewTab}
                casesData={casesData} // Pass full casesData for related case lookups
                // History Tab Props
                mockHistory={mockHistory} // Pass mockHistory
                handleSave={handleSaveApplicationForm} // Pass the save handler
            />
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
