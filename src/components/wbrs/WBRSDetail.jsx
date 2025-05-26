import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Fab,
  FormControlLabel,
  Checkbox,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';

// Corrected Icon Imports
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import SearchIcon from '@mui/icons-material/Search'; 
import AssignmentIcon from '@mui/icons-material/Assignment';

import AppSidebar from '../common/AppSidebar';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description'; // WBRS App Icon
import EditIcon from '@mui/icons-material/Edit'; // Example Action
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Create Case Icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // Subject Engineer Icon
import CategoryIcon from '@mui/icons-material/Category'; // Application Type Icon
import HistoryIcon from '@mui/icons-material/History'; // For History Tab
import AttachFileIcon from '@mui/icons-material/AttachFile'; // For Attachments Tab
import InfoIcon from '@mui/icons-material/Info'; // For Details Tab
import AccountTreeIcon from '@mui/icons-material/AccountTree'; // For Related Cases Tab
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import WBRSApplicationTabs from './WBRSApplicationTabs'; // Import the new component

// Updated Mock WBRS Application Data
const mockWbrsApplicationsData = {
  'WBRS001': { 
    id: 'WBRS001', 
    applicantName: 'Tech Solutions Ltd.',
    applicantContact: 'Mr. John Doe',
    applicantEmail: 'john.doe@techsolutions.com',
    applicantPhone: '+852 1234 5678',
    status: 'Pending', 
    applicationType: 'REA Registration', 
    submissionDate: '2023-12-01',
    lastUpdated: '2023-12-05',
    description: 'Application for REA registration. Includes technical specifications and safety compliance documents. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
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
            "imageData": "base64EncodedImageString"
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
            "documentType": "professionalQualificationProof",
            "fileName": "PE_Certificate_2015.pdf"
          },
          {
            "documentType": "experienceVerificationLetter",
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
          "interviewScheduled": true,
          "interviewTime": "2023-10-12T10:00:00"
        },
        "regulatoryCompliance": {
          "antiCorruptionDeclaration": true,
          "dataPrivacyConsent": true
        }
      },
    attachments: [
      { id: 'att001', name: 'ProfQual_TechSolutions.pdf', size: '2.5MB', type: 'Qualification', uploadedDate: '2023-12-01', uploadedBy: 'Mr. John Doe' },
      { id: 'att002', name: 'ExpLetter_TechSolutions.pdf', size: '1.2MB', type: 'Experience', uploadedDate: '2023-12-01', uploadedBy: 'Mr. John Doe' }
    ],
    relatedCases: [],
    history: [
        { date: '2023-12-01', action: 'Application Submitted', actor: 'Mr. John Doe', details: 'Initial REA Registration submission.' },
        { date: '2023-12-02', action: 'Status changed to Pending', actor: 'System', details: 'Application awaiting review.' },
    ]
  },
  'WBRS002': { 
    id: 'WBRS002', 
    applicantName: 'Green Energy Corp.',
    applicantContact: 'Ms. Jane Smith',
    applicantEmail: 'jane.smith@greenenergy.com',
    applicantPhone: '+852 9876 5432',
    status: 'Case Created', 
    applicationType: 'REA Registration', 
    submissionDate: '2023-11-28',
    lastUpdated: '2023-12-04',
    description: 'REA registration for new engineer. All documents provided.',
    applicationForm: { 
        "applicationType": "new",
        "applicantInfo": {
            "currentCompany": { "name": "Green Energy Corp.", "address": { "street": "1 Earth Lane", "city": "Eco City" } },
            "position": "Energy Engineer",
            "contact": { "officePhone": "+852 9876 5432" },
            "declaration": { "knowledge": true, "criminalRecord": "haveNot", "dataAccuracy": true },
            "signature": { "date": "2023-11-27" }
        },
        "qualifications": [{ "qualificationType": "degree", "disciplines": ["Mechanical Engineering"], "dateOfQualification": "2018-01-01", "disciplineAttachments":[] }],
        "practicalExperience": [{ "id":"expGE1", "startDate": "2019-01-01", "endDate": "2023-11-01", "position": "Junior Auditor", "company": "Green Audits Inc.", "description": "Assisted in various energy audits.", "attachment": { "fileName": "Junior_Auditor_Experience.pdf", "fileSize": "1.5MB" } }],
        "supportingDocuments": [{ "id":"docGE1", "documentType": "degreeCertificate", "fileName": "Degree_GreenEnergy.pdf" }],
        "disclosurePreferences": { "emailDisclosure": true, "phoneDisclosure": false },
        "applicationFee": { "amount": 2100, "currency": "HKD", "paymentMethod": "online", "referenceNumber": "WBRS002FEE" },
        "submissionInfo": { "submissionDate": "2023-11-28", "submissionMethod": "online" },
        "regulatoryCompliance": { "antiCorruptionDeclaration": true, "dataPrivacyConsent": true }
    },
    attachments: [
      { id: 'att003', name: 'ProfessionalCert_Green.pdf', size: '3.1MB', type: 'Certification', uploadedDate: '2023-11-28', uploadedBy: 'Ms. Jane Smith' },
    ],
    relatedCases: ['CASE101'],
    history: [
        { date: '2023-11-28', action: 'Application Submitted', actor: 'Ms. Jane Smith', details: 'Renewal submitted.'},
        { date: '2023-11-29', action: 'Status changed to Pending', actor: 'System', details: 'Awaiting processing.' },
        { date: '2023-12-04', action: 'Case Created (CASE101)', actor: 'Admin User', details: 'Case created for REA Registration.' },
        { date: '2023-12-04', action: 'Status changed to Case Created', actor: 'System', details: '' },
    ]
  },
  'WBRS003': { 
    id: 'WBRS003', 
    applicantName: 'Innovate Systems',
    applicantContact: 'Dr. Emily White',
    applicantEmail: 'emily.white@innovatesys.org',
    applicantPhone: '+852 2345 6789',
    status: 'New', 
    applicationType: 'REA Registration', 
    submissionDate: '2023-11-15',
    lastUpdated: '2023-11-20',
    description: 'New REA application for senior engineer.',
    applicationForm: { 
        "applicationType": "new",
        "applicantInfo": {
            "currentCompany": { "name": "Innovate Systems", "address": { "street": "Innovation Drive", "city": "Science Park" } },
            "position": "Chief Innovation Officer",
            "contact": { "officePhone": "+852 2345 6789" },
            "declaration": { "knowledge": true, "criminalRecord": "haveNot", "dataAccuracy": true },
            "signature": { "date": "2023-11-14" }
        },
        "qualifications": [{ "qualificationType": "PhD", "disciplines":["Sustainable Energy"], "dateOfQualification": "2005-01-01", "disciplineAttachments":[] }],
        "practicalExperience": [{ "id":"expIS1", "startDate": "2006-01-01", "endDate": "2023-11-01", "position": "Research Lead", "company": "Innovate Systems", "description": "Led R&D in energy efficiency.", "attachment": { "fileName": "Research_Lead_Experience.pdf", "fileSize": "2.3MB" } }],
        "supportingDocuments": [{ "id":"docIS1", "documentType": "PhD_Certificate.pdf" }],
        "disclosurePreferences": { "emailDisclosure": true, "phoneDisclosure": true },
        "applicationFee": { "amount": 2100, "currency": "HKD", "paymentMethod": "bankTransfer", "referenceNumber": "WBRS003FEE" },
        "submissionInfo": { "submissionDate": "2023-11-15", "submissionMethod": "email" },
        "regulatoryCompliance": { "antiCorruptionDeclaration": true, "dataPrivacyConsent": true }
    },
    attachments: [],
    relatedCases: [],
    history: [
        { date: '2023-11-15', action: 'Application Submitted (New)', actor: 'Dr. Emily White', details: 'Initial submission for REA Registration.' },
    ]
  },
  'WBRS004': { 
    id: 'WBRS004', 
    applicantName: 'Energy Savers Ltd.',
    applicantContact: 'Mr. Ken Lee',
    applicantEmail: 'ken.lee@energysavers.com',
    applicantPhone: '+852 3333 4444',
    status: 'Rejected', 
    applicationType: 'New Equipment Registration',
    submissionDate: '2023-10-01',
    lastUpdated: '2023-10-10',
    description: 'Application for new solar panel model SP-X1. Rejected due to incomplete technical data.',
    applicationForm: null, 
    attachments: [
      { id: 'att007', name: 'SP-X1_Brochure.pdf', size: '1.1MB', type: 'Brochure', uploadedDate: '2023-10-01', uploadedBy: 'Mr. Ken Lee' },
    ],
    relatedCases: [],
    history: [
        { date: '2023-10-01', action: 'Application Submitted', actor: 'Mr. Ken Lee', details: 'Initial submission.'},
        { date: '2023-10-05', action: 'Status changed to Pending', actor: 'System', details: 'Under review.' },
        { date: '2023-10-10', action: 'Status changed to Rejected', actor: 'Admin User', details: 'Reason: Incomplete technical data provided for SP-X1.' },
    ]
  },
  'WBRS005': { 
    id: 'WBRS005', 
    applicantName: 'Old Power Inc.',
    applicantContact: 'Ms. Susan Chan',
    applicantEmail: 's.chan@oldpower.com',
    applicantPhone: '+852 5555 6666',
    status: 'Cancelled', 
    applicationType: 'Renewal',
    submissionDate: '2023-09-01',
    lastUpdated: '2023-09-15',
    description: 'Renewal application for generator G-500. Cancelled by applicant.',
    applicationForm: null, 
    attachments: [],
    relatedCases: [],
    history: [
        { date: '2023-09-01', action: 'Application Submitted', actor: 'Ms. Susan Chan', details: 'Renewal G-500.'},
        { date: '2023-09-05', action: 'Status changed to Pending', actor: 'System', details: 'Awaiting documents.' },
        { date: '2023-09-15', action: 'Status changed to Cancelled', actor: 'Ms. Susan Chan', details: 'Applicant requested cancellation.' },
    ]
  }
};

// Mock list of Subject Engineers
const mockSubjectEngineers = [
  { id: 'eng001', name: 'Alice Wonderland (E/EEB1/1)' },
  { id: 'eng002', name: 'Bob The Builder (E/EEB2/1)' },
  { id: 'eng003', name: 'Charlie Brown (E/EEB3/1)' },
  { id: 'eng004', name: 'Diana Prince (SE/EEB1/1)' }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wbrs-tabpanel-${index}`}
      aria-labelledby={`wbrs-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, px: 0.5, pb: 2 }}> {/* Added pb: 2 to align with CaseDetailTabs.jsx */}
          {children}
        </Box>
      )}
    </div>
  );
}

// Helper function to aggregate all attachments
const getAllAttachments = (wbrsApp) => {
  if (!wbrsApp) return [];
  let allAttachments = [...(wbrsApp.attachments || []).map(att => ({ ...att, source: 'Main Application' }))];

  wbrsApp.applicationForm?.qualifications?.forEach((qual, qualIndex) => {
    const qualTypeLabel = qual.qualificationType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    if (qual.qualificationType === 'other' && qual.otherAttachment?.fileName) {
      const fileName = qual.otherAttachment.fileName;
      allAttachments.push({
        id: `qual-${qualIndex}-other-att-${fileName}`,
        name: fileName,
        description: `Other Qualification: ${qual.description?.substring(0,30) || 'N/A'}...`,
        fileType: fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase() : 'N/A',
        fileSize: qual.otherAttachment.size || '1.0MB', 
        uploadedDate: qual.dateOfQualification || wbrsApp.submissionDate, 
        uploadedBy: wbrsApp.applicantName,
        source: 'Qualification Form'
      });
    } else if (qual.qualificationType !== 'other') {
      qual.disciplineAttachments?.forEach(discAtt => {
        if (discAtt.fileName) {
          const fileName = discAtt.fileName;
          allAttachments.push({
            id: `qual-${qualIndex}-disc-${discAtt.discipline}-att-${fileName}`,
            name: fileName,
            description: `${qualTypeLabel} - ${discAtt.discipline}`,
            fileType: fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase() : 'N/A',
            fileSize: discAtt.fileSize || '1.0MB', 
            uploadedDate: qual.dateOfQualification || wbrsApp.submissionDate,
            uploadedBy: wbrsApp.applicantName,
            source: 'Qualification Form'
          });
        }
      });
    }
  });
  
  // Add practical experience attachments
  wbrsApp.applicationForm?.practicalExperience?.forEach((exp, expIndex) => {
    if (exp.attachment?.fileName) {
      const fileName = exp.attachment.fileName;
      allAttachments.push({
        id: `exp-${expIndex}-att-${fileName}`,
        name: fileName,
        description: `${exp.position} at ${exp.company}`,
        fileType: fileName.includes('.') ? fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase() : 'N/A',
        fileSize: exp.attachment.fileSize || '1.0MB',
        uploadedDate: exp.endDate || wbrsApp.submissionDate,
        uploadedBy: wbrsApp.applicantName,
        source: 'Experience Form'
      });
    }
  });
  
  return allAttachments;
};

const WBRSDetail = () => {
  const { wbrsId } = useParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [wbrsApp, setWbrsApp] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [createCaseDialogOpen, setCreateCaseDialogOpen] = useState(false);
  const [selectedSubjectEngineer, setSelectedSubjectEngineer] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  const aggregatedAttachments = React.useMemo(() => getAllAttachments(wbrsApp), [wbrsApp]);

  useEffect(() => {
    // Reset session storage for WBRS001 to ensure we have the latest data
    if (wbrsId === 'WBRS001') {
      const existingApps = JSON.parse(sessionStorage.getItem('wbrsApplications')) || {};
      const updatedApps = { ...existingApps, 'WBRS001': mockWbrsApplicationsData['WBRS001'] };
      sessionStorage.setItem('wbrsApplications', JSON.stringify(updatedApps));
    }

    const storedApps = JSON.parse(sessionStorage.getItem('wbrsApplications')) || mockWbrsApplicationsData;
    const foundApp = storedApps[wbrsId];
    
    if (foundApp) {
      setWbrsApp(foundApp);
      setEditableData(JSON.parse(JSON.stringify(foundApp.applicationForm || {})));
    } else {
      console.error('WBRS Application not found:', wbrsId);
    }
  }, [wbrsId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowBackToTop(true);
      else setShowBackToTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);

  const handleOpenCreateCaseDialog = () => {
    setSelectedSubjectEngineer('');
    setCreateCaseDialogOpen(true);
  };

  const handleCloseCreateCaseDialog = () => setCreateCaseDialogOpen(false);

  const handleConfirmCreateCase = () => {
    if (!selectedSubjectEngineer) {
      setSnackbarMessage('Please select a Subject Engineer.');
      setSnackbarOpen(true);
      return;
    }
    const newCaseNo = `CASE${String(Date.now()).slice(-3)}`;
    const storedApps = JSON.parse(sessionStorage.getItem('wbrsApplications')) || mockWbrsApplicationsData;
    const updatedApp = { 
        ...storedApps[wbrsApp.id], 
        relatedCases: [...(storedApps[wbrsApp.id].relatedCases || []), newCaseNo],
        status: 'Case Created'
    };
    const updatedApps = { ...storedApps, [wbrsApp.id]: updatedApp };
    sessionStorage.setItem('wbrsApplications', JSON.stringify(updatedApps));
    setWbrsApp(updatedApp);
    setSnackbarMessage(`Case ${newCaseNo} created successfully!`);
    setSnackbarOpen(true);
    setCreateCaseDialogOpen(false);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'New': return 'info';
      case 'Pending': return 'warning';
      case 'Case Created': return 'success';
      case 'Rejected': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

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
        if (field === 'disciplines') {
          const currentDisciplines = newArray[index].disciplines || [];
          const newDisciplines = currentDisciplines.includes(value)
            ? currentDisciplines.filter(d => d !== value)
            : [...currentDisciplines, value];
          newArray[index] = { ...newArray[index], disciplines: newDisciplines };

          let newDisciplineAttachments = newArray[index].disciplineAttachments || [];
          if (newDisciplines.includes(value) && !newDisciplineAttachments.find(att => att.discipline === value)) {
            newDisciplineAttachments.push({ discipline: value, fileName: '' });
          } else if (!newDisciplines.includes(value)) {
            newDisciplineAttachments = newDisciplineAttachments.filter(att => att.discipline !== value);
          }
          newArray[index] = { ...newArray[index], disciplineAttachments: newDisciplineAttachments.sort((a, b) => a.discipline.localeCompare(b.discipline)) };

        } else {
          newArray[index] = { ...newArray[index], [field]: value };
        }
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
            size: attachmentDetails.fileSize // Use 'size' to match mock data
          };
        } else {
          let newDisciplineAttachments = newQualifications[qualIndex].disciplineAttachments || [];
          const attachmentIndex = newDisciplineAttachments.findIndex(att => att.discipline === disciplineOrOther);
          if (attachmentIndex > -1) {
            newDisciplineAttachments[attachmentIndex] = {
              ...newDisciplineAttachments[attachmentIndex],
              fileName: attachmentDetails.fileName,
              fileSize: attachmentDetails.fileSize
            };
          } else {
            // This case should ideally not happen if discipline exists but attachment object is new via selection of discipline checkbox
            // However, if it does, create a new attachment entry
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

  const handleNestedFieldChange = (section, subSection, field, value) => {
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

  const handleFieldChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (section, subSection, addressField, value) => {
    setEditableData(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [subSection]: {
                ...prev[section]?.[subSection],
                address: {
                    ...prev[section]?.[subSection]?.address,
                    [addressField]: value
                }
            }
        }
    }));
  };

  const handleSaveApplicationForm = () => {
    const updatedWbrsApp = { ...wbrsApp, applicationForm: editableData };
    const storedApps = JSON.parse(sessionStorage.getItem('wbrsApplications')) || mockWbrsApplicationsData;
    const updatedApps = { ...storedApps, [wbrsApp.id]: updatedWbrsApp };
    sessionStorage.setItem('wbrsApplications', JSON.stringify(updatedApps));
    setWbrsApp(updatedWbrsApp);
    setEditMode(false);
    setSnackbarMessage('Application form updated successfully!');
    setSnackbarOpen(true);
  };

  if (!wbrsApp) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading WBRS Application Data...</Typography>
      </Box>
    );
  }
  
  const applicationDataForTabs = editMode ? editableData : (wbrsApp.applicationForm || {});
  
  // Detail Item component for consistent styling (Summary Card)
  const DetailItem = ({ label, value, fullWidth = false }) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : (label.length > 20 ? 12 : 6)} sx={{mb: 0.5}}>
      <Typography variant="caption" color="textSecondary" display="block" fontWeight="bold" sx={{fontSize: '0.7rem'}}>{label}:</Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word', bgcolor: 'grey.50', p: 0.75, borderRadius: 1, minHeight:'30px', display:'flex', alignItems:'center' }}>
        {value || <Typography component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>N/A</Typography>}
      </Typography>
    </Grid>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppSidebar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Box sx={{ flex: 1, p: 1.5, overflowY: 'auto', position: 'relative' }}>
        {/* Breadcrumbs and Top Summary Card remain here ... */}
        {/* <Box sx={{ 
          mb: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'background.paper',
          borderRadius: 1,
          p: 0.75,
          fontSize: '0.85rem'
        }}>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/')} 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <HomeIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />Home
          </Link>
          <NavigateNextIcon fontSize="small" sx={{ mx: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={() => navigate('/wbrs-search')} 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            WBRS Applications
          </Link>
          <NavigateNextIcon fontSize="small" sx={{ mx: 0.5, color: 'text.secondary', fontSize: '0.9rem' }} />
          <Typography color="text.primary" sx={{ fontWeight: 'medium' }}>
            {wbrsApp.id}
          </Typography>
        </Box> */}

        <Card sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: '12px !important', pb: '12px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: detailsExpanded ? 1 : 0 }}>
              <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 'medium' }}>Application Details</Typography>
              {!detailsExpanded && (
                <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary' }}>
                  {wbrsApp.id} | {wbrsApp.applicationType}
                </Typography>
              )}
              <Chip 
                label={wbrsApp.status} 
                size="medium" 
                color={getStatusChipColor(wbrsApp.status)} 
                sx={{ fontWeight: 'bold', fontSize:'0.8rem', height:'28px' }} 
              />
              <Box sx={{ flexGrow: 1 }}></Box>
              {wbrsApp.status === 'Pending' && (
                <Tooltip title="Create Case from this Application">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleOpenCreateCaseDialog}
                    size="small"
                    sx={{ height: '28px', fontSize:'0.75rem'}}
                  >
                    Create Case
                  </Button>
                </Tooltip>
              )}
              <IconButton
                size="small"
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                sx={{ ml: 0.5, p: 0.5 }}
              >
                {detailsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Collapse in={detailsExpanded} timeout="auto">
              <Grid container spacing={1}>
                <DetailItem label="Applicant Name" value={wbrsApp.applicantName}/>
                <DetailItem label="Application Type" value={wbrsApp.applicationType}/>
                <DetailItem label="Submission Date" value={new Date(wbrsApp.submissionDate).toLocaleDateString()}/>
                <DetailItem label="Last Updated" value={new Date(wbrsApp.lastUpdated).toLocaleDateString()}/>
              </Grid>
            </Collapse>
          </CardContent>
        </Card>

        {/* Use the new WBRSApplicationTabs component */}
        <WBRSApplicationTabs 
            currentTab={currentTab}
            handleTabChange={handleTabChange}
            wbrsApp={wbrsApp}
            applicationData={applicationDataForTabs} // Derived from editableData or wbrsApp.applicationForm
            editMode={editMode}
            setEditMode={setEditMode} // Pass setEditMode for the Edit/Save button inside tabs
            handleSaveApplicationForm={handleSaveApplicationForm}
            handleFieldChange={handleFieldChange}
            handleSimpleFieldChange={handleSimpleFieldChange}
            handleNestedFieldChange={handleNestedFieldChange}
            handleAddressChange={handleAddressChange}
            handleArrayObjectChange={handleArrayObjectChange}
            handleQualificationAttachmentChange={handleQualificationAttachmentChange}
            aggregatedAttachments={aggregatedAttachments}
        />

        {/* Dialogs and Snackbar remain here ... */}
        <Dialog open={createCaseDialogOpen} onClose={handleCloseCreateCaseDialog} maxWidth="sm" fullWidth PaperProps={{sx:{borderRadius:2}}}>
          <DialogTitle sx={{ py:1.5, px:2, fontWeight: 'medium', backgroundColor: 'white', color: 'black' }}>
            Create New Case
          </DialogTitle>
          <DialogContent dividers sx={{p:2}}>
            <DialogContentText sx={{mb:2}}>
              Creating a new case from WBRS Application <strong>{wbrsApp.id}</strong>.
            </DialogContentText>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4} sx={{display:'flex', alignItems:'center', justifyContent:{xs:'flex-start', sm:'flex-end'}}}>
                    <Typography variant="body2" sx={{fontWeight:'medium'}}>Case Type:</Typography>
                </Grid>
                 <Grid item xs={12} sm={8}>
                    <TextField fullWidth disabled value={wbrsApp.applicationType} size="small" InputProps={{readOnly: true, style:{fontSize:'0.875rem'}}}/>
                </Grid>
                <Grid item xs={12} sm={4} sx={{display:'flex', alignItems:'center', justifyContent:{xs:'flex-start', sm:'flex-end'}}}>
                    <Typography variant="body2" sx={{fontWeight:'medium'}}>Subject Engineer<span style={{color:'red'}}>*</span>:</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <FormControl fullWidth size="small" required error={!selectedSubjectEngineer && snackbarMessage.includes('Subject Engineer')}>
                        <InputLabel id="subject-engineer-select-label" sx={{fontSize:'0.875rem'}}>Select Engineer</InputLabel>
                        <Select labelId="subject-engineer-select-label" value={selectedSubjectEngineer} label="Select Engineer" onChange={(e) => setSelectedSubjectEngineer(e.target.value)} sx={{fontSize:'0.875rem'}}>
                            <MenuItem value="" disabled sx={{fontSize:'0.875rem'}}><em>Select an engineer</em></MenuItem>
                            {mockSubjectEngineers.map((engineer) => (<MenuItem key={engineer.id} value={engineer.name} sx={{fontSize:'0.875rem'}}>{engineer.name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{p: '12px 16px', borderTop: '1px solid', borderColor:'divider'}}>
            <Button onClick={handleCloseCreateCaseDialog} color="inherit" sx={{textTransform:'none', fontSize:'0.8rem'}}>CANCEL</Button>
            <Button onClick={handleConfirmCreateCase} variant="contained" color="primary" sx={{textTransform:'none', fontSize:'0.8rem'}}>
              CREATE
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarMessage.includes('Please select') ? 'error' : 'success'} variant="filled" sx={{ width: '100%', '& .MuiAlert-message': {fontSize:'0.9rem'} }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {showBackToTop && (
          <Fab color="primary" size="small" onClick={scrollToTop} sx={{ position: 'fixed', bottom: 20, right: 20, opacity:0.8, '&:hover':{opacity:1} }} aria-label="back to top">
            <ArrowUpwardIcon />
          </Fab>
        )}
      </Box>
    </Box>
  );
};

export default WBRSDetail; 