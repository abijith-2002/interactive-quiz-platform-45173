import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  Box
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { submissionAPI } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';

const RecentSubmissionsWidget = () => {
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['recent-submissions'],
    queryFn: () => submissionAPI.getUserSubmissions().then(res => res.data),
  });

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Submissions
        </Typography>
        
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {submissions?.slice(0, 5).map((submission, index) => (
              <ListItem key={submission._id} divider={index !== 4}>
                <ListItemText
                  primary={submission.quiz.title}
                  secondary={
                    <>
                      Score: {submission.score}%
                      <br />
                      {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentSubmissionsWidget;
