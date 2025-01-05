import React, { useEffect, useState } from 'react';
import {
  Box,
  Fab,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import fabStyle from '../../../components/fabStyle';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AppsIcon from '@mui/icons-material/Apps';
import useApiClient from '../../../api';
import { useAuth } from '../../authentication';
import { useAlert } from '../../../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import CardView from './CardView';
import ServiceCallsTable from './ServiceCallsTable';
import { Roles, ServiceCallStatus } from '../../../constant';
import Spinner from '../../../components/ui/Spinner';

const ENDPOINT = 'ServiceCalls/';

const statusOptions = Object.entries(ServiceCallStatus).map(([key, value]) => ({
  value,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));

const ServiceCalls = () => {
  const [displayMode, setDisplayMode] = useState('table');
  const [selectedStatuses, setSelectedStatuses] = useState([1, 2, 3]);
  const [searchTerm, setSearchTerm] = useState('');
  const { get, isLoading, isSuccess, error, response } = useApiClient();
  const { user, type } = useAuth();
  const { displayAlert } = useAlert();

  const navigate = useNavigate();
  const isManager = type === Roles.manager;

  useEffect(() => {
    const params = !isManager ? { clientId: user.sub } : null;
    const fetch = async () => await get(ENDPOINT, params);
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayMode = (e, value) => setDisplayMode(value);

  const handleNewServiceCall = () => {
    navigate('new');
  };

  useEffect(() => {
    error && displayAlert(error);
  }, [displayAlert, error]);

  const handleStatusChange = (event) => {
    const value = event.target.value;
    if (value.includes('all')) {
      setSelectedStatuses(
        value.length === statusOptions.length + 1 ? [] : statusOptions.map((option) => option.value)
      );
    } else {
      setSelectedStatuses(value);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const ServiceCallsContent = () => {
    if (isLoading) return <Spinner />;
    if (!isSuccess) return;

    const filteredItems = response.items.filter((item) => {
      const statusMatch = selectedStatuses.includes(item.currentStatus.status.value);
      const searchMatch =
        searchTerm === '' ||
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });

    return displayMode === 'table' ? (
      <ServiceCallsTable serviceCalls={filteredItems} showActionButtons={isManager} />
    ) : (
      <CardView serviceCalls={filteredItems} showActionButtons={isManager} />
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }} gap={35}>
        <FormControl sx={{ width: 350 }}>
          <InputLabel id='status-select-label'>Status</InputLabel>
          <Select
            labelId='status-select-label'
            label='Status'
            id='status-select'
            multiple
            value={selectedStatuses}
            onChange={handleStatusChange}
            renderValue={(selected) =>
              statusOptions.length === selected.length
                ? 'All'
                : statusOptions
                    .filter((option) => selected.includes(option.value))
                    .map((option) => option.label)
                    .join(', ')
            }>
            <MenuItem key='all' value='all'>
              <Checkbox checked={selectedStatuses.length === statusOptions.length} />
              <ListItemText primary='All' />
            </MenuItem>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedStatuses.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label='Search'
          variant='outlined'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search by category, subcategory, or details...'
          sx={{ flexGrow: 2 }}
        />

        <ToggleButtonGroup
          value={displayMode}
          exclusive
          onChange={handleDisplayMode}
          aria-label='text alignment'>
          <ToggleButton value='table' aria-label='left aligned'>
            <TableRowsIcon />
          </ToggleButton>
          <ToggleButton value='grid' aria-label='centered'>
            <AppsIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ServiceCallsContent />

      <Fab color='primary' style={fabStyle} onClick={handleNewServiceCall}>
        <AddIcon />
      </Fab>
    </>
  );
};

export default ServiceCalls;
