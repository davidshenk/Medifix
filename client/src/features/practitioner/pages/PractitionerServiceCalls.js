import React, { useEffect } from 'react';
import { List, Typography, Grid, Box, IconButton, Divider, CardContent, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useApiClient from '../../../api';
import { useAuth } from '../../authentication';
import { useAlert } from '../../../context/AlertContext';
import { truncateText } from '../../../utils/stringHelper';
import { getTimeDifference } from '../../../utils/dateHelper';
import { handleCallClick } from '../../../utils/browserHelper';
import { ServiceCallStatus } from '../../../constant';
import { getUserGreeting } from '../../../utils/util';
import Spinner from '../../../components/ui/Spinner';

const ENDPOINT = 'ServiceCalls/';

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 2: // Medium
      return <WarningIcon color='action' fontSize='small' />;
    case 3: // High
      return <PriorityHighIcon color='warning' fontSize='small' />;
    case 4: // Critical
      return <ErrorIcon color='error' fontSize='small' />;
    default: // Low or any other value
      return null;
  }
};

const DetailsMaxLength = 70;

const PractitionerServiceCalls = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading, isSuccess, error, response, get } = useApiClient();
  const { displayAlert } = useAlert();

  const handleItemClick = (item) => {
    navigate(item.id);
  };

  useEffect(() => {
    const fetch = async () => await get(ENDPOINT, { practitionerId: user.sub });
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    error && displayAlert(error);
  }, [displayAlert, error]);

  return isLoading ? (
    <Spinner />
  ) : !isSuccess ? (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        No service calls.
      </Typography>
    </Box>
  ) : (
    <Grid item xs={12} md={6}>
      <Typography sx={{ mb: 1 }} variant='h6' component='div' align='center'>
        {getUserGreeting(user.name)}
      </Typography>
      <List sx={{ padding: 0 }}>
        {response.items.map((item) => {
          const { location } = item;
          const building = location.building.name;
          const department = location.department.name;
          const locationString = `${building}, ${department}`;

          const title = item.subCategory.name;
          const currentStatus = item.currentStatus.status.value;
          const type = item.type.name;

          const isFinished = currentStatus === ServiceCallStatus.finished;

          return (
            <Card
              key={item.id}
              onClick={() => handleItemClick(item)}
              sx={{
                mb: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: isFinished ? '#deffe7' : 'inherit',
              }}>
              <CardContent sx={{ padding: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}>
                  <Typography variant='subtitle1' component='div' sx={{ fontWeight: 'bold' }}>
                    {title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {currentStatus === ServiceCallStatus.started && (
                      <PlayArrowIcon color='success' sx={{ mr: 0.5 }} />
                    )}
                    {getPriorityIcon(item.priority.value)}

                    <Divider orientation='vertical' sx={{ mx: 0.5 }} flexItem />
                    {type === 'Repair' ? (
                      <BuildIcon
                        fontSize='small'
                        color={type === 'Repair' ? 'secondary' : 'primary'}
                      />
                    ) : (
                      <AddCircleOutlineIcon
                        fontSize='small'
                        color={type === 'Repair' ? 'secondary' : 'primary'}
                      />
                    )}
                  </Box>
                </Box>

                <Typography variant='body2' sx={{ mb: 1, color: 'text.secondary' }}>
                  {truncateText(item.details, DetailsMaxLength)}
                </Typography>

                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon fontSize='small' sx={{ mr: 0.5 }} />
                      {item.client.fullName}
                    </Typography>
                    {item.client.phoneNumber && (
                      <IconButton
                        size='small'
                        color='primary'
                        onClick={(e) => handleCallClick(e, item.client.phoneNumber)}
                        aria-label='Call client'>
                        <PhoneIcon fontSize='small' />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon fontSize='small' sx={{ mr: 0.5 }} />
                    {locationString}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize='small' sx={{ mr: 0.5 }} />
                      Created: {getTimeDifference(item.dateCreated)}
                    </Typography>
                    {currentStatus === ServiceCallStatus.started && (
                      <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon fontSize='small' sx={{ mr: 0.5 }} />
                        Open: {getTimeDifference(item.currentStatus.dateTime)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </List>
    </Grid>
  );
};

export default PractitionerServiceCalls;
