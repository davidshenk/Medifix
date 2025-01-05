import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { handleCallClick } from '../../../utils/browserHelper';
import { formatJsonDateTime, getTimeDifference } from '../../../utils/dateHelper';
import useApiClient from '../../../api';
import { ServiceCallStatus } from '../../../constant';
import QrScanner from 'qr-scanner';
import { useAlert } from '../../../context/AlertContext';
import Spinner from '../../../components/ui/Spinner';

const getStatusChip = (status) => {
  const statusColors = {
    [ServiceCallStatus.started]: 'primary',
    [ServiceCallStatus.finished]: 'success',
    default: 'default',
  };
  return (
    <Chip
      label={status.name}
      color={statusColors[status.value] || statusColors.default}
      sx={{ mb: 1 }}
    />
  );
};

const qrEnabled = true;

const PractitionerServiceCallView = () => {
  const { id } = useParams();
  const { get, patch, isLoading, isSuccess } = useApiClient();
  const { displayAlert } = useAlert();
  const [item, setItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathName || '/';

  const onBack = () => {
    navigate(from);
  };

  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const [qrScanner, setQrScanner] = useState(null);

  const handleStartClick = async () => {
    const { isSuccess } = await patch(`serviceCalls/${id}/start`, {});
    console.log(isSuccess);
    if (isSuccess) {
      fetchServiceCall();
    }
  };

  const handleQRDialogOpen = () => {
    setIsQRDialogOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        const qrScanner = new QrScanner(videoRef.current, handleQRScan, {
          returnDetailedScanResult: true,
        });
        setQrScanner(qrScanner);
        qrScanner.start();
      }
    }, 0);
  };

  const handleQRDialogClose = () => {
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setIsQRDialogOpen(false);
  };

  let qrScanCount = 0;
  const handleQRScan = async (result) => {
    if (!result || ++qrScanCount > 1) return;
    handleQRDialogClose();
    handleServiceCallClose({ qrCode: result.data });
  };

  const handleServiceCallClose = async ({ qrCode }) => {
    const { isSuccess, error } = await patch(`serviceCalls/${id}/close`, {
      serviceCallId: id,
      closeDetails: item.closeDetails,
      qrCode: qrCode || (!qrEnabled && item.location.room.id),
    });

    if (isSuccess) {
      onBack();
    } else {
      displayAlert(error);
    }
  };

  const fetchServiceCall = async () => {
    const { response, isSuccess } = await get(`serviceCalls/${id}`);

    isSuccess && setItem(response.serviceCall);
  };

  useEffect(() => {
    fetchServiceCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [qrScanner]);

  if (isLoading) return <Spinner />;
  if (!isSuccess) {
    return <Typography color='error'>Failed to load service call</Typography>;
  }

  const isStarted = item.currentStatus.status.value === ServiceCallStatus.started;
  const isFinished = item.currentStatus.status.value === ServiceCallStatus.finished;

  return (
    <Box>
      <IconButton onClick={onBack} sx={{ mb: 2 }}>
        <ArrowBackIcon />
      </IconButton>

      <Card elevation={3}>
        <CardContent>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant='h5' component='h1' fontWeight='bold'>
              {item.subCategory.name}
            </Typography>
            {getStatusChip(item.currentStatus.status)}
          </Box>

          <Typography variant='body1' sx={{ mb: 3 }}>
            {item.details}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant='h6' component='h2' sx={{ mb: 2 }}>
            Client Information
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} />
              {item.client.fullName}
            </Typography>
            {item.client.phoneNumber && (
              <IconButton
                color='primary'
                onClick={(e) => handleCallClick(e, item.client.phoneNumber)}
                aria-label='Call client'>
                <PhoneIcon />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant='h6' component='h2' sx={{ mb: 2 }}>
            Location Details
          </Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ApartmentIcon sx={{ mr: 1 }} />
            {item.location.building.name}
          </Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormatListNumberedIcon sx={{ mr: 1 }} />
            {item.location.floor.name}
          </Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            {item.location.department.name}
          </Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <MeetingRoomIcon sx={{ mr: 1 }} />
            {item.location.room.name}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant='h6' component='h2' sx={{ mb: 2 }}>
            Timestamps
          </Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon sx={{ mr: 1 }} />
            Created: {formatJsonDateTime(item.dateCreated)} ({getTimeDifference(item.dateCreated)})
          </Typography>
          {isStarted && (
            <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1 }} />
              Started: {formatJsonDateTime(item.currentStatus.dateTime)} (
              {getTimeDifference(item.currentStatus.dateTime)})
            </Typography>
          )}

          {(isStarted || isFinished) && (
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Close Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant='outlined'
                  value={item.closeDetails}
                  onChange={(e) => setItem((prev) => ({ ...prev, closeDetails: e.target.value }))}
                  disabled={isFinished}
                  inputProps={{ maxLength: 500 }}
                  helperText={!isFinished ? `${item.closeDetails?.length || 0}/500` : ''}
                />
              </AccordionDetails>
            </Accordion>
          )}

          {!isFinished && (
            <Button
              variant='contained'
              color='primary'
              fullWidth
              size='large'
              startIcon={isStarted ? <QrCodeScannerIcon /> : <PlayArrowIcon />}
              onClick={
                isStarted
                  ? qrEnabled
                    ? handleQRDialogOpen
                    : handleServiceCallClose
                  : handleStartClick
              }
              disabled={isStarted && (item.closeDetails?.length || 0) === 0}
              sx={{ mt: 3 }}>
              {isStarted ? 'Close Service Call' : 'Start Service Call'}
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={isQRDialogOpen} onClose={handleQRDialogClose} maxWidth='sm' fullWidth>
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <video ref={videoRef} style={{ width: '100%', maxWidth: '400px' }} />
          </Box>
          <Typography>Please scan the QR code to proceed with closing the service call.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQRDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PractitionerServiceCallView;
