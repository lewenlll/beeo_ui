import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [inboxMessages, setInboxMessages] = useState([
    {
      id: 1,
      subject: "New Case Assignment",
      content: "You have been assigned to Case #12345 - Building Inspection at 123 Main Street",
      date: "2024-03-20 09:30 AM",
      status: "unread"
    },
    {
      id: 2,
      subject: "Case Update Required",
      content: "Please update the inspection report for Case #12340 - Safety Assessment",
      date: "2024-03-19 02:15 PM",
      status: "read"
    },
    {
      id: 3,
      subject: "Urgent: Follow-up Required",
      content: "Immediate attention needed for Case #12338 - Emergency Maintenance",
      date: "2024-03-18 11:45 AM",
      status: "unread"
    }
  ]);

  useEffect(() => {
    // Load Tableau script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://prod-apsoutheast-b.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const markAsRead = (messageId) => {
    setInboxMessages(messages =>
      messages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' } : msg
      )
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="tableau-container">
          <tableau-viz
            id="tableau-viz"
            src="https://prod-apsoutheast-b.online.tableau.com/t/hoho147-967601ea99/views/Dashboard_Templatev0_2/Dashboard1"
            width="100%"
            height="600px"
            hide-tabs
            toolbar="bottom"
          ></tableau-viz>
        </div>
        
        <div className="inbox-container">
          <h2>Inbox Messages</h2>
          <div className="inbox-messages">
            {inboxMessages.map((message) => (
              <div 
                key={message.id} 
                className={`message-card ${message.status === 'unread' ? 'unread' : ''}`}
                onClick={() => markAsRead(message.id)}
              >
                <div className="message-header">
                  <h3>{message.subject}</h3>
                  {message.status === 'unread' && <span className="unread-badge">New</span>}
                </div>
                <p>{message.content}</p>
                <span className="message-date">{message.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;