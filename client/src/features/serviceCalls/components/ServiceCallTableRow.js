import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import AssignToPractitioner from '../pages/AssignToPractitioner';
import { refreshPage } from '../../../utils/browserHelper';
import { formatJsonDateTime } from '../../../utils/dateHelper';
import ActionButtons from './ActionButtons';
import { Fragment, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { truncateText } from '../../../utils/stringHelper';
import useApiClient from '../../../api';

function ServiceCallTableRow(props) {
  const { row, showActionButtons } = props;

  const apiClient = useApiClient();
  const [open, setOpen] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const { location } = row;
  const building = location.building.name;
  const floor = location.floor.name;
  const department = location.department.name;
  const room = location.room.name;
  const subCategoryId = row.subCategory.id;
  const serviceCallId = row.id;

  const category = (
    <span>
      {row.category.name}
      <br />
      {row.subCategory.name}
    </span>
  );
  const depAndRoom = `${department} - ${room}`;
  const locationString = `Building ${building}, Floor ${floor}, ${department}, Room ${room}`;

  const handleRowClick = () => {
    // navigate(`/serviceCalls/${row.id}`);
  };

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

  return (
    <Fragment>
      <TableRow
        hover
        sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
        onClick={handleRowClick}>
        <TableCell>
          <IconButton
            size='small'
            onClick={(event) => {
              event.stopPropagation();
              setOpen(!open);
            }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{category}</TableCell>
        <TableCell>{formatJsonDateTime(row.dateCreated)}</TableCell>
        <Tooltip title={row.details} placement='left'>
          <TableCell>{truncateText(row.details, 50)}</TableCell>
        </Tooltip>
        {showActionButtons && <TableCell>{row.client.fullName}</TableCell>}
        <Tooltip title={locationString}>
          <TableCell>{depAndRoom}</TableCell>
        </Tooltip>
        <TableCell>{row.currentStatus.status.name}</TableCell>
        <TableCell>{row.practitioner?.fullName}</TableCell>
        {showActionButtons && (
          <TableCell>
            <ActionButtons
              row={row}
              onDelete={handleCancelClick}
              onEdit={handleEdit}
              onAssign={handleAssign}
            />
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1, marginLeft: 6 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Status History
              </Typography>
              <Table size='small' sx={{ width: 'auto' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.statusUpdates.map((historyRow) => (
                    <TableRow key={historyRow.dateTime}>
                      <TableCell component='th' scope='row'>
                        {historyRow.status.name}
                      </TableCell>
                      <TableCell>{formatJsonDateTime(historyRow.dateTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

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
    </Fragment>
  );
}

export default ServiceCallTableRow;
