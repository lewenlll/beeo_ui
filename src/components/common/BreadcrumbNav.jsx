import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BreadcrumbNav = ({ paths }) => {
  const navigate = useNavigate();

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        return isLast ? (
          <Typography key={path.path} color="text.primary">
            {path.label}
          </Typography>
        ) : (
          <Link
            key={path.path}
            component="button"
            variant="body1"
            onClick={() => navigate(path.path)}
            sx={{ cursor: 'pointer' }}
          >
            {path.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;