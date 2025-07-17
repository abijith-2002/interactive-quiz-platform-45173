import React from 'react';
import { Grid, Typography, Box, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, submissionAPI } from '../utils/api';
import QuizList from '../components/quiz/QuizList';
import LeaderboardWidget from '../components/dashboard/LeaderboardWidget';
import StatsWidget from '../components/dashboard/StatsWidget';
import RecentSubmissionsWidget from '../components/dashboard/RecentSubmissionsWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => analyticsAPI.getOverall(),
    enabled: isAdmin,
  });

  return (
    <Box sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.username}!
        </Typography>

        {isAdmin ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <StatsWidget stats={stats?.data} />
              <Box sx={{ mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Available Quizzes
                </Typography>
                <QuizList />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <LeaderboardWidget />
              <Box sx={{ mt: 3 }}>
                <RecentSubmissionsWidget />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Available Quizzes
              </Typography>
              <QuizList />
            </Grid>
            <Grid item xs={12} md={4}>
              <LeaderboardWidget />
            </Grid>
          </Grid>
        )}
      </motion.div>
    </Box>
  );
};

export default Dashboard;
