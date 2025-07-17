import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAPI } from '../../utils/api';
import { toast } from 'react-hot-toast';
import QuizForm from './QuizForm';

const QuizManager = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const queryClient = useQueryClient();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => quizAPI.getQuizzes(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => quizAPI.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-quizzes']);
      toast.success('Quiz deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete quiz');
    },
  });

  const handleOpenDialog = (quiz = null) => {
    setSelectedQuiz(quiz);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedQuiz(null);
    setOpenDialog(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Quiz Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create New Quiz
        </Button>
      </Box>

      <Grid container spacing={3}>
        {quizzes?.data.map((quiz) => (
          <Grid item xs={12} md={6} key={quiz._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    {quiz.title}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(quiz)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this quiz?')) {
                          deleteMutation.mutate(quiz._id);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {quiz.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Questions: {quiz.questions?.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    Time Limit: {quiz.timeLimit} minutes
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={quiz.isPublished}
                        onChange={(e) => {
                          quizAPI.updateQuiz(quiz._id, {
                            ...quiz,
                            isPublished: e.target.checked
                          }).then(() => {
                            queryClient.invalidateQueries(['admin-quizzes']);
                            toast.success('Quiz status updated');
                          });
                        }}
                      />
                    }
                    label="Published"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}
        </DialogTitle>
        <DialogContent>
          <QuizForm 
            quiz={selectedQuiz}
            onSubmit={(data) => {
              const promise = selectedQuiz
                ? quizAPI.updateQuiz(selectedQuiz._id, data)
                : quizAPI.createQuiz(data);

              promise.then(() => {
                queryClient.invalidateQueries(['admin-quizzes']);
                handleCloseDialog();
                toast.success(`Quiz ${selectedQuiz ? 'updated' : 'created'} successfully`);
              }).catch((error) => {
                toast.error(error.response?.data?.message || `Failed to ${selectedQuiz ? 'update' : 'create'} quiz`);
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default QuizManager;
