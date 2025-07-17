import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  CircularProgress
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { submissionAPI } from '../../utils/api';

const LeaderboardWidget = () => {
  const [timeframe, setTimeframe] = useState('weekly');

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', timeframe],
    queryFn: () => submissionAPI.getLeaderboard({ timeframe }).then(res => res.data),
  });

  const handleTimeframeChange = (event, newTimeframe) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Leaderboard
          </Typography>
          <ToggleButtonGroup
            size="small"
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
          >
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="all">All Time</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {leaderboard?.slice(0, 5).map((entry, index) => (
              <ListItem key={entry.userId} divider={index !== 4}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: index < 3 ? 'primary.main' : 'grey.500' }}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={entry.username}
                  secondary={`Score: ${entry.totalScore}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
