import React, { useState } from 'react';
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
  TableRow
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import BreadcrumbNav from '../common/BreadcrumbNav';
import AttachmentUpload from '../common/AttachmentUpload';

const ResizablePanel = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: -8,
    top: 0,
    width: 16,
    height: '100%',
    cursor: 'col-resize',
    userSelect: 'none'
  }
}));

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

const CaseDetail = () => {
  // Mock data - moved to the top before any hooks that reference it
  const caseData = {
    caseId: 'CASE001',
    officer: 'John Doe',
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
  };

  const [leftPanelWidth, setLeftPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [tabValue, setTabValue] = useState(0); // Default to Application tab
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  // const [taskDialogOpen, setTaskDialogOpen] = useState(false); // Not used, can be removed if not needed elsewhere
  const [selectedTask, setSelectedTask] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // For the main sidebar
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState(caseData.applicationForm || {});

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
    { id: 1, name: 'Review Documentation', status: 'Pending', officer: 'Jane Smith', description: 'Initial review of submitted documents', dueDate: '2023-12-01' },
    { id: 2, name: 'Site Inspection', status: 'In Progress', officer: 'John Doe', description: 'Conduct on-site inspection', dueDate: '2023-12-05' }
  ];

  const mockHistory = [
    { date: '2023-11-20', action: 'Case Created', actor: 'System' },
    { date: '2023-11-21', action: 'Task Assigned', actor: 'John Doe' }
  ];

  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - 240; // Adjust for sidebar width
      setLeftPanelWidth(Math.max(300, Math.min(newWidth, 800))); // Increased max width for left panel
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

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

  const taskRecords = [
    { date: '2023-11-20', action: 'Site Visit', remarks: 'Initial inspection completed', officer: 'John Doe' },
    { date: '2023-11-22', action: 'Follow-up', remarks: 'Documentation review', officer: 'Jane Smith' }
  ];

  const [relatedCases] = useState([
    { id: 'CASE002', title: 'Related Issue 1', status: 'Open' },
    { id: 'CASE003', title: 'Related Issue 2', status: 'Closed' }
  ]);

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
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
        </Box>
        {/* Add sidebar content here if needed */}
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 3, overflow: 'hidden' }}>
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'Cases', path: '/cases' },
          { label: caseData.caseId, path: `/cases/${caseData.caseId}` }
        ]} />

        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 2 }}>
          {/* Left Panel */}
          <ResizablePanel
            sx={{
              width: leftPanelWidth,
              minWidth: 300,
              maxWidth: 800, // Increased max width
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseDown={handleMouseDown}
          >
            <Card sx={{ mb: 2, flexShrink: 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Case Details</Typography>
                  <Chip 
                    label={caseData.status} 
                    color={caseData.status === 'Open' ? 'primary' : (caseData.status === 'In Progress' ? 'warning' : 'default')}
                    size="small"
                  />
                </Box>
                <Grid container spacing={1}> {/* Reduced spacing for denser info */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Case No.</Typography>
                    <Typography variant="body1">{caseData.caseId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Officer</Typography>
                    <Typography variant="body1">{caseData.officer}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Case Type</Typography>
                    <Typography variant="body1">{caseData.caseType}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Created Date</Typography>
                    <Typography variant="body1">{caseData.createdDate}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{caseData.description}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                <Tab label="Application" />
                <Tab label="Attachments" />
                <Tab label="Related Cases" />
                <Tab label="History" />
              </Tabs>
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
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
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>Applicant Information</Typography>
                        <Grid container spacing={2}>
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
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.currentCompany?.name || ''}
                                onChange={(e) => handleNestedFieldChange(['applicantInfo','currentCompany','name'], e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.currentCompany?.name}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Company Address</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={renderAddress(editableData.applicantInfo?.currentCompany?.address)}
                                onChange={(e) => handleAddressChange(e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{renderAddress(applicationData.applicantInfo?.currentCompany?.address)}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Position</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.position || ''}
                                onChange={(e) => handleNestedFieldChange(['applicantInfo','position'], e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.position}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Office Phone</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.contact?.officePhone || ''}
                                onChange={(e) => handleNestedFieldChange(['applicantInfo','contact','officePhone'], e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.contact?.officePhone}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Fax</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                value={editableData.applicantInfo?.contact?.fax || ''}
                                onChange={(e) => handleNestedFieldChange(['applicantInfo','contact','fax'], e.target.value)}
                                size="small"
                              />
                            ) : (
                              <Typography variant="body1">{applicationData.applicantInfo?.contact?.fax}</Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="text.secondary">Signature Date</Typography>
                            {editMode ? (
                              <TextField
                                fullWidth
                                type="date"
                                value={editableData.applicantInfo?.signature?.date || ''}
                                onChange={(e) => handleNestedFieldChange(['applicantInfo','signature','date'], e.target.value)}
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
                    {/* Repeat similar edit/view logic for Qualifications, Practical Experience, Supporting Documents, Submission & Fee sections */}
                  </Box>
                )}
                {tabValue === 1 && (
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'background.default',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files);
                      // Handle file upload here
                      console.log('Dropped files:', files);
                    }}
                  >
                    <AttachmentUpload />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Drag and drop files here or click to upload
                    </Typography>
                  </Box>
                )}
                {tabValue === 2 && (
                  <List>
                    {relatedCases.map((case_) => (
                      <ListItem
                        key={case_.id}
                        sx={{ 
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' }
                        }}
                        onClick={() => console.log('Navigate to case:', case_.id)} // Placeholder action
                      >
                        <ListItemText
                          primary={case_.title}
                          secondary={`Case ID: ${case_.id} | Status: ${case_.status}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
                {tabValue === 3 && (
                  <TimelineContainer>
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
          </ResizablePanel>

          {/* Right Panel - Task List */}
          <Paper sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0 }}>
              <Typography variant="h6">Tasks</Typography>
              <Button variant="contained" color="primary" onClick={() => handleTaskClick(null)} size="small">
                Add Task
              </Button>
            </Box>
            <List sx={{ overflow: 'auto', flex: 1 }}>
              {mockTasks.map((task) => (
                <ListItem
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderBottom: 1, 
                    borderColor: 'divider'
                  }}
                  disablePadding
                >
                  <ListItemText sx={{p:1.5}}
                    primary={task.name}
                    secondary={
                      <Stack direction="row" spacing={1} sx={{mt: 0.5}}>
                        <Chip label={task.status} size="small" color={task.status === 'Pending' ? 'warning' : (task.status === 'Completed' ? 'success' : 'default')} />
                        <Typography variant="caption" color="text.secondary">
                          Officer: {task.officer}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Due: {task.dueDate}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
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
                  label="Officer"
                  value={selectedTask?.officer || ''}
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
  );
};

export default CaseDetail;