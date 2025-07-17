import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../utils/api';
import QuizCard from './QuizCard';

const QuizList = () => {
  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.getQuizzes().then(res => res.data),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 4 }}>
        Error loading quizzes: {error.message}
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      {quizzes.map((quiz) => (
        <Grid item key={quiz._id} xs={12} sm={6} md={4}>
          <QuizCard quiz={quiz} />
        </Grid>
      ))}
    </Grid>
  );
};

export default QuizList;
