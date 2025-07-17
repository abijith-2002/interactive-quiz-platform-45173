import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { analyticsAPI } from '../../utils/api';
import { motion } from 'framer-motion';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [selectedQuiz, setSelectedQuiz] = useState('all');

  // Fetch overall analytics data
  const { data: overallData, isLoading: loadingOverall } = useQuery({
    queryKey: ['analytics-overall'],
    queryFn: () => analyticsAPI.getOverall(),
  });

  // Fetch quiz-specific analytics if a quiz is selected
  const { data: quizData, isLoading: loadingQuiz } = useQuery({
    queryKey: ['analytics-quiz', selectedQuiz],
    queryFn: () => selectedQuiz !== 'all' ? analyticsAPI.getQuizAnalytics(selectedQuiz) : null,
    enabled: selectedQuiz !== 'all',
  });

  const participationData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Quiz Participation',
        data: [65, 75, 82, 90],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const scoreDistributionData = {
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        label: 'Score Distribution',
        data: [10, 20, 30, 25, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };

  const completionTimeData = {
    labels: ['<5min', '5-10min', '10-15min', '15-20min', '>20min'],
    datasets: [
      {
        label: 'Completion Time',
        data: [15, 30, 25, 20, 10],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  if (loadingOverall || loadingQuiz) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="weekly">Last Week</MenuItem>
              <MenuItem value="monthly">Last Month</MenuItem>
              <MenuItem value="yearly">Last Year</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Quiz</InputLabel>
            <Select
              value={selectedQuiz}
              label="Quiz"
              onChange={(e) => setSelectedQuiz(e.target.value)}
            >
              <MenuItem value="all">All Quizzes</MenuItem>
              {/* Add quiz options dynamically */}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Participation Trends */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Participation Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={participationData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Score Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Score Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie 
                    data={scoreDistributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Completion Time Analysis */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Completion Time Analysis
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar
                    data={completionTimeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional metrics can be added here */}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default AnalyticsDashboard;
