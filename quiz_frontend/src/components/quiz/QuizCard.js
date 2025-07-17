import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {quiz.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {quiz.description}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Time Limit: {quiz.timeLimit} minutes
            </Typography>
            <Typography variant="body2">
              Questions: {quiz.questions?.length || 0}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            color="primary"
            onClick={() => navigate(`/quiz/${quiz._id}`)}
          >
            Start Quiz
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default QuizCard;
