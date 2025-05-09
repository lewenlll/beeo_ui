import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField
} from '@mui/material';
import BreadcrumbNav from '../common/BreadcrumbNav';
import RichTextEditor from '../common/RichTextEditor';
import AttachmentUpload from '../common/AttachmentUpload';

const WBRSDetail = () => {
  const [comments, setComments] = useState('');
  
  // Mock data
  const submission = {
    applicationNo: 'WBRS001',
    status: 'Pending',
    submissionDate: '2023-11-20'
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <BreadcrumbNav paths={[
          { label: 'Home', path: '/' },
          { label: 'WBRS', path: '/wbrs' },
          { label: 'Detail', path: '/wbrs/detail' }
        ]} />

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            WBRS Submission Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Application No"
                value={submission.applicationNo}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Status"
                value={submission.status}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Submission Date"
                value={submission.submissionDate}
                disabled
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Comments
              </Typography>
              <RichTextEditor
                value={comments}
                onChange={setComments}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Attachments
              </Typography>
              <AttachmentUpload />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => console.log('Complete clicked')}
                >
                  Complete
                </Button>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => console.log('Reject clicked')}
                >
                  Reject
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => console.log('Associate Case clicked')}
                >
                  Associate Case
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default WBRSDetail;