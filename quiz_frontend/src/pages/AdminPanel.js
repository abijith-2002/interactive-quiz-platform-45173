import React from 'react';
import { 
  Box, 
  Grid, 
  Typography,
  Tab,
  Tabs
} from '@mui/material';
import { motion } from 'framer-motion';
import QuizManager from '../components/admin/QuizManager';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import UserManager from '../components/admin/UserManager';

const AdminPanel = () => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Quiz Management" />
            <Tab label="Analytics" />
            <Tab label="User Management" />
          </Tabs>
        </Box>

        {currentTab === 0 && <QuizManager />}
        {currentTab === 1 && <AnalyticsDashboard />}
        {currentTab === 2 && <UserManager />}
      </motion.div>
    </Box>
  );
};

export default AdminPanel;
