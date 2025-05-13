import React, { useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  useEffect(() => {
    // Load Tableau API script dynamically
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://prod-apsoutheast-b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.body.appendChild(script);

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <tableau-viz 
        id="tableau-viz" 
        src="https://prod-apsoutheast-b.online.tableau.com/t/hoho147-967601ea99/views/Dashboard_Templatev0_2/Dashboard1"
        width="1920"
        height="919"
        hide-tabs
        toolbar="bottom"
      />
    </div>
  );
};

export default Dashboard;