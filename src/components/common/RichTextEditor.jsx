import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box } from '@mui/material';

const RichTextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  return (
    <Box sx={{ 
      '& .ql-container': {
        minHeight: '200px',
        fontSize: '1rem'
      },
      '& .ql-editor': {
        minHeight: '200px'
      }
    }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        style={{ height: '200px' }}
      />
    </Box>
  );
};

export default RichTextEditor;