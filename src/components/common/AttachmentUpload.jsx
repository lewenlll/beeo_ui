import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const AttachmentUpload = () => {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Predefined document types
  const documentTypes = [
    'Professional Qualification Proof',
    'Experience Verification Letter',
    'Identity Document',
    'Certificate',
    'Reference Letter',
    'Other'
  ];

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      file,
      type: '',
      description: ''
    }));
    setFiles([...files, ...newFiles]);
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
  
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  }, [isDragActive]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        type: '',
        description: ''
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.dataTransfer.clearData();
    }
  }, []);
  
  const handleTypeChange = (index, value) => {
    const updatedFiles = [...files];
    updatedFiles[index].type = value;
    setFiles(updatedFiles);
  };
  
  const handleDescriptionChange = (index, value) => {
    const updatedFiles = [...files];
    updatedFiles[index].description = value;
    setFiles(updatedFiles);
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      
      <Paper 
        variant="outlined"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 3,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: isDragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          borderRadius: 1,
          bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
          transition: 'all 0.2s ease-in-out',
          minHeight: 120,
          cursor: 'pointer'
        }}
      >
        <FileUploadIcon sx={{ fontSize: 40, color: isDragActive ? 'primary.main' : 'text.secondary', mb: 1 }} />
        <Typography variant="body1" color={isDragActive ? 'primary' : 'text.secondary'} align="center">
          {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          or
        </Typography>
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 1 }}
            size="small"
          >
            Browse Files
          </Button>
        </label>
      </Paper>

      <List sx={{ width: '100%' }}>
        {files.map((fileObj, index) => (
          <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', border: '1px solid #eee', borderRadius: 1, mb: 1, p: 2 }}>
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 2 }}>
              <ListItemText 
                primary={fileObj.file.name}
                secondary={`${(fileObj.file.size / 1024).toFixed(2)} KB`}
              />
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`file-type-label-${index}`}>Document Type</InputLabel>
                  <Select
                    labelId={`file-type-label-${index}`}
                    value={fileObj.type}
                    label="Document Type"
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                  >
                    {documentTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  value={fileObj.description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  placeholder="Add a description for this file"
                />
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AttachmentUpload;