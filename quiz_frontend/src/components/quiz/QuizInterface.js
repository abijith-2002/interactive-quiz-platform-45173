import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../utils/api';
import Countdown from 'react-countdown';
import JSConfetti from 'js-confetti';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const jsConfetti = new JSConfetti();

const QuizInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeStarted, setTimeStarted] = useState(Date.now());

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuiz(id).then(res => res.data),
  });

  useEffect(() => {
    if (quiz) {
      setTimeStarted(Date.now());
    }
  }, [quiz]);

  if (isLoading) {
    return <LinearProgress />;
  }

  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = async () => {
    const timeSpent = (Date.now() - timeStarted) / 1000; // in seconds
    
    try {
      await quizAPI.submitQuiz(id, {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          question: questionId,
          selectedOption: optionId
        })),
        timeSpent
      });
      
      jsConfetti.addConfetti();
      toast.success('Quiz submitted successfully!');
      navigate('/results');
    } catch (error) {
      toast.error('Failed to submit quiz');
    }
  };

  const progress = (currentQuestion + 1) / quiz.questions.length * 100;
  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              {quiz.title}
            </Typography>
            <Countdown 
              date={timeStarted + quiz.timeLimit * 60000}
              onComplete={handleSubmit}
              renderer={({ minutes, seconds }) => (
                <Typography variant="h6" color="primary">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </Typography>
              )}
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 3 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Typography variant="h6" gutterBottom>
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {currentQuestionData.text}
              </Typography>

              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[currentQuestionData._id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestionData._id, e.target.value)}
                >
                  <Grid container spacing={2}>
                    {currentQuestionData.options.map((option) => (
                      <Grid item xs={12} key={option._id}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FormControlLabel
                            value={option._id}
                            control={<Radio />}
                            label={option.text}
                            sx={{
                              width: '100%',
                              p: 1,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 1,
                            }}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </FormControl>
            </motion.div>
          </AnimatePresence>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </Button>
            
            {currentQuestion < quiz.questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestion(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizInterface;
