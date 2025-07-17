import React from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';

const QuizForm = ({ quiz, onSubmit }) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: quiz || {
      title: '',
      description: '',
      timeLimit: 30,
      isPublished: false,
      questions: [{
        text: '',
        points: 1,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }]
    }
  });

  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: 'questions'
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Quiz Title"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Time Limit (minutes)"
            {...register('timeLimit', { 
              required: 'Time limit is required',
              min: { value: 1, message: 'Minimum time is 1 minute' }
            })}
            error={!!errors.timeLimit}
            helperText={errors.timeLimit?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch {...register('isPublished')} />}
            label="Published"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>

          {questions.map((question, questionIndex) => (
            <Card key={question.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Question {questionIndex + 1}
                  </Typography>
                  <IconButton 
                    color="error" 
                    onClick={() => removeQuestion(questionIndex)}
                    disabled={questions.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Question Text"
                      {...register(`questions.${questionIndex}.text`, {
                        required: 'Question text is required'
                      })}
                      error={!!errors.questions?.[questionIndex]?.text}
                      helperText={errors.questions?.[questionIndex]?.text?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Points"
                      {...register(`questions.${questionIndex}.points`, {
                        required: 'Points are required',
                        min: { value: 1, message: 'Minimum points is 1' }
                      })}
                      error={!!errors.questions?.[questionIndex]?.points}
                      helperText={errors.questions?.[questionIndex]?.points?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Options
                    </Typography>
                    {[0, 1, 2, 3].map((optionIndex) => (
                      <Box key={optionIndex} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          fullWidth
                          label={`Option ${optionIndex + 1}`}
                          {...register(`questions.${questionIndex}.options.${optionIndex}.text`, {
                            required: 'Option text is required'
                          })}
                          error={!!errors.questions?.[questionIndex]?.options?.[optionIndex]?.text}
                          helperText={errors.questions?.[questionIndex]?.options?.[optionIndex]?.text?.message}
                        />
                        <FormControlLabel
                          control={
                            <Switch 
                              {...register(`questions.${questionIndex}.options.${optionIndex}.isCorrect`)}
                            />
                          }
                          label="Correct"
                        />
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => appendQuestion({
              text: '',
              points: 1,
              options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
              ]
            })}
          >
            Add Question
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            {quiz ? 'Update Quiz' : 'Create Quiz'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizForm;
