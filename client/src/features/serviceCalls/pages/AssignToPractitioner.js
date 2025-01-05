import React, { useState, useEffect, useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  ListItemAvatar,
  Avatar,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import useApiClient from '../../../api/apiClient';
import { useAlert } from '../../../context/AlertContext';

const AssignToPractitioner = ({ subCategoryId, serviceCallId, onClose }) => {
  const [practitioners, setPractitioners] = useState([]);
  const apiClient = useApiClient();
  const { displayAlert } = useAlert();

  useEffect(() => {
    const fetchPractitioners = async () => {
      const { response, isSuccess, error } = await apiClient.get(
        `Practitioners?subCategoryId=${subCategoryId}`
      );

      if (isSuccess) {
        setPractitioners(response.items);
      } else {
        displayAlert(error);
      }
    };

    fetchPractitioners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssign = async (practitionerId) => {
    const { isSuccess, error } = await apiClient.patch(
      `ServiceCalls/${serviceCallId}/assign/${practitionerId}`
    );
    !isSuccess && displayAlert(error);
    onClose(isSuccess);
  };

  const sortedPractitioners = useMemo(() => {
    const processedPractitioners = practitioners
      .map((practitioner) => {
        const assignedWeight = 1;
        const startedWeight = 1.5;
        const workloadScore =
          (practitioner.assignedServiceCalls * assignedWeight +
            practitioner.startedServiceCalls * startedWeight) /
          (10 * ((assignedWeight + startedWeight) / 2));
        return {
          ...practitioner,
          workloadScore,
          totalCalls: practitioner.assignedServiceCalls + practitioner.startedServiceCalls,
        };
      })
      .sort((a, b) => a.workloadScore - b.workloadScore);

    // Dynamic color assignment
    const uniqueScores = [...new Set(processedPractitioners.map((p) => p.workloadScore))];
    const colorAssignment = (index) => {
      if (uniqueScores.length === 1) return 'success';
      if (uniqueScores.length === 2) return index === 0 ? 'success' : 'warning';
      return ['success', 'warning', 'error'][Math.min(index, 2)];
    };

    return processedPractitioners.map((p, index) => ({
      ...p,
      color: colorAssignment(uniqueScores.indexOf(p.workloadScore)),
    }));
  }, [practitioners]);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {sortedPractitioners.map((practitioner) => {
        const workloadPercentage = practitioner.workloadScore * 100;

        return (
          <ListItem
            key={practitioner.id}
            disablePadding
            sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <ListItemButton onClick={() => handleAssign(practitioner.practitionerId)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${practitioner.color}.main` }}>
                  {practitioner.firstName[0]}
                  {practitioner.lastName[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${practitioner.firstName} ${practitioner.lastName}`}
                secondary={
                  <React.Fragment>
                    <Typography component='span' variant='body2' color='text.primary'>
                      Assigned: {practitioner.assignedServiceCalls} | Started:{' '}
                      {practitioner.startedServiceCalls} | Total: {practitioner.totalCalls}
                    </Typography>
                    <Tooltip title={`Workload: ${workloadPercentage.toFixed(0)}%`} arrow>
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={workloadPercentage}
                          color={practitioner.color}
                        />
                      </Box>
                    </Tooltip>
                  </React.Fragment>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default AssignToPractitioner;
