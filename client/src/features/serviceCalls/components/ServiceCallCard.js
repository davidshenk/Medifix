import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ActionButtons from "./ActionButtons"
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { refreshPage } from '../../../utils/browserHelper';

import { formatJsonDateTime } from '../../../utils/dateHelper';
import useApiClient from '../../../api';
import AssignToPractitioner from '../pages/AssignToPractitioner';


const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});



const StyledChip = styled(Chip)(({ theme, color }) => ({
  // backgroundColor: theme.palette[color].main,
  // color: theme.palette[color].contrastText,
  fontWeight: 'bold',
}));

const ServiceCallCard = ({ row, showActionButtons }) => {
  const apiClient = useApiClient();
  const [open, setOpen] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const isAssigned = !!row.practitioner;

  const subCategoryId = row.subCategory.id;
  const serviceCallId = row.id;


  const handleCancelClick = () => {
    setOpenCancelDialog(true);
  };
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };
  const handleConfirmDelete = async () => {
    const { isSuccess } = await apiClient.patch(`ServiceCalls/${row.id}/cancel`);
    if (isSuccess) refreshPage();
  
    // handleCloseCancelDialog();
  };
  
  const handleEdit = (event) => {
    event.stopPropagation();
  };
  
  const handleAssign = (event) => {
    event.stopPropagation();
    setOpenAssignDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'primary';
      case 'in progress': return 'secondary';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  return (
    <StyledCard>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: row.category.color }}>
            {row.category.name.charAt(0)}
          </Avatar>
        }
        title={`${row.category.name} | ${row.subCategory.name}`}
        subheader={formatJsonDateTime(row.dateCreated)}
        action={
          <StyledChip
            label={row.currentStatus.status.name}
            color={getStatusColor(row.currentStatus.status.name)}
            size="small"
          />
        }
      />
      <StyledCardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {row.details}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" ml={1}>
            {`${row.location.building.name}, ${row.location.floor.name}, ${row.location.department.name}, ${row.location.room.name}`}
          </Typography>
        </Box>
        {row.practitioner && (
          <Box display="flex" alignItems="center" mt={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" ml={1}>
              {row.practitioner.fullName}
            </Typography>
          </Box>
        )}
      </StyledCardContent>
      <CardActions disableSpacing>
        {showActionButtons && (
          <ActionButtons 
          row={row}
          onDelete={handleCancelClick}
          onEdit={handleEdit}
          onAssign={handleAssign}
        />
            
        )}
        
      </CardActions>
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
        <DialogTitle>Assign Practitioner</DialogTitle>
        <DialogContent>
          <AssignToPractitioner
            subCategoryId={subCategoryId}
            serviceCallId={serviceCallId}
            onClose={(refresh) => (refresh ? refreshPage() : setOpenAssignDialog(false))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default ServiceCallCard;