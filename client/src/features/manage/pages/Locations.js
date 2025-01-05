import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Typography,
  CircularProgress,
  ListItemButton,
  Stack,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import useApiClient from '../../../api';
import Spinner from '../../../components/ui/Spinner';

const ENDPOINT = 'Locations';

const Locations = () => {
  const apiClient = useApiClient();
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState('');

  const repository = {
    getBuildings: async () => await apiClient.get(`${ENDPOINT}/types/1`),
    getFloors: async (buildingId) => await apiClient.get(`${ENDPOINT}/${buildingId}/children`),
    getDepartments: async (floorId) => await apiClient.get(`${ENDPOINT}/${floorId}/children`),
    getRooms: async (departmentId) => await apiClient.get(`${ENDPOINT}/${departmentId}/children`),
    createItem: async (type, parentId, item) =>
      apiClient.post(ENDPOINT, {
        locationType: type,
        name: item.name,
        parentLocationId: parentId,
      }),
    updateItem: async (type, item) =>
      await apiClient.put(`${ENDPOINT}/${item.id}`, {
        locationId: item.id,
        name: item.name,
        isActive: item.isActive,
      }),
  };

  useEffect(() => {
    fetchBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBuildings = async () => {
    const { response, error, isSuccess } = await repository.getBuildings();
    if (isSuccess) {
      setBuildings(response.items);
      setFloors([]);
      setDepartments([]);
      setRooms([]);
    } else {
      console.error('Error fetching buildings:', error);
    }
  };

  const fetchFloors = async (buildingId) => {
    const { response, error, isSuccess } = await repository.getFloors(buildingId);
    if (isSuccess) {
      setFloors(response.items);
      setDepartments([]);
      setRooms([]);
    } else {
      setFloors([]);
      setDepartments([]);
      setRooms([]);
      console.error('Error fetching floors:', error);
    }
  };

  const fetchDepartments = async (floorId) => {
    const { response, error, isSuccess } = await repository.getDepartments(floorId);
    if (isSuccess) {
      setDepartments(response.items);
      setRooms([]);
    } else {
      setDepartments([]);
      setRooms([]);
      console.error('Error fetching departments:', error);
    }
  };

  const fetchRooms = async (departmentId) => {
    const { response, error, isSuccess } = await repository.getRooms(departmentId);
    if (isSuccess) {
      setRooms(response.items);
    } else {
      setRooms([]);
      console.error('Error fetching rooms:', error);
    }
  };

  const handleItemClick = (item, type) => {
    switch (type) {
      case 'building':
        setSelectedBuilding(item);
        fetchFloors(item.id);
        break;
      case 'floor':
        setSelectedFloor(item);
        fetchDepartments(item.id);
        break;
      case 'department':
        setSelectedDepartment(item);
        fetchRooms(item.id);
        break;
      default:
        break;
    }
  };

  const handleAddItem = (type) => {
    setEditItem({ name: '', isActive: true });
    setEditType(type);
    setDialogOpen(true);
  };

  const handleEditItem = (item, type) => {
    setEditItem(item);
    setEditType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditItem(null);
    setEditType('');
  };

  const handleSaveItem = async () => {
    const { error, isSuccess } = editItem.id
      ? await repository.updateItem(editType, editItem)
      : await repository.createItem(editType, getParentId(), editItem);

    if (isSuccess) {
      handleDialogClose();
      refreshList(editType);
    } else {
      console.error('Error saving item:', error);
    }
  };

  const getParentId = () => {
    switch (editType) {
      case 'floor':
        return selectedBuilding.id;
      case 'department':
        return selectedFloor.id;
      case 'room':
        return selectedDepartment.id;
      default:
        return null;
    }
  };

  const refreshList = (type) => {
    switch (type) {
      case 'building':
        fetchBuildings();
        break;
      case 'floor':
        fetchFloors(selectedBuilding.id);
        break;
      case 'department':
        fetchDepartments(selectedFloor.id);
        break;
      case 'room':
        fetchRooms(selectedDepartment.id);
        break;
      default:
        break;
    }
  };

  const renderList = (items, type, title) => (
    <Box border={1} borderColor='grey.300' borderRadius={2} p={2} m={1} flexGrow={1}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant='h6'>{title}</Typography>
        <Button variant='contained' color='primary' onClick={() => handleAddItem(type)}>
          Add
        </Button>
      </Stack>
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.id}
            onClick={() => handleItemClick(item, type)}
            selected={
              (type === 'building' && selectedBuilding?.id === item.id) ||
              (type === 'floor' && selectedFloor?.id === item.id) ||
              (type === 'department' && selectedDepartment?.id === item.id)
            }>
            <ListItemText
              primary={item.name}
              secondary={`Active: ${item.isActive ? 'Yes' : 'No'}`}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleEditItem(item, type);
              }}>
              Edit
            </Button>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  if (apiClient.isLoading) return <Spinner />;

  return (
    <Box display='flex'>
      {renderList(buildings, 'building', 'Buildings')}
      {renderList(floors, 'floor', 'Floors')}
      {renderList(departments, 'department', 'Departments')}
      {renderList(rooms, 'room', 'Rooms')}

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editItem?.id ? 'Edit' : 'Add'} {editType}
        </DialogTitle>
        <DialogContent>
          <Box display='flex' flexDirection={'row-reverse'}>
            <Box width={editItem?.id ? 500 : 350}>
              <TextField
                autoFocus
                margin='dense'
                label='Name'
                fullWidth
                value={editItem?.name || ''}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              />
              <Box display='flex' alignItems='center' mt={2}>
                <Typography>Active</Typography>
                <Switch
                  checked={editItem?.isActive || false}
                  onChange={(e) => setEditItem({ ...editItem, isActive: e.target.checked })}
                />
              </Box>
            </Box>
            {editItem?.id && (
              <Box mr={4}>
                <QRCodeSVG value={editItem.id} title='QR Code' />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveItem} color='primary' disabled={!editItem?.name}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Locations;
