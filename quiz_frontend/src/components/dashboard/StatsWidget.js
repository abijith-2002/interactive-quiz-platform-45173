import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { 
  PeopleOutline, 
  QuizOutlined, 
  AssignmentTurnedInOutlined, 
  TrendingUpOutlined 
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              p: 1, 
              borderRadius: 2, 
              bgcolor: `${color}.light`,
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

const StatsWidget = ({ stats }) => {
  if (!stats) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<PeopleOutline />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Quizzes"
          value={stats.activeQuizzes}
          icon={<QuizOutlined />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Submissions"
          value={stats.totalSubmissions}
          icon={<AssignmentTurnedInOutlined />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Avg. Score"
          value={`${stats.averageScore}%`}
          icon={<TrendingUpOutlined />}
          color="info"
        />
      </Grid>
    </Grid>
  );
};

export default StatsWidget;
