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
import useApiClient from '../../../api';
import { capitalizeFirstLetter } from '../../../utils/stringHelper';
import EntityExpertises from '../components/EntityExpertises';
import Spinner from '../../../components/ui/Spinner';

const Categories = () => {
  const apiClient = useApiClient();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState('');

  const repository = {
    getCategory: async (id) => await apiClient.get(`Categories/${id}`),
    getCategories: async () => await apiClient.get('Categories'),
    getSubCategories: async (categoryId) =>
      await apiClient.get(`SubCategories?categoryId=${categoryId}`),
    getExpertises: async () => await apiClient.get(`Expertises`),
    createCategory: async (item) => await apiClient.post('Categories', item),
    updateCategory: async (categoryId, item) =>
      await apiClient.put(`Categories/${categoryId}`, item),
    createSubCategory: async (item) => await apiClient.post('SubCategories', item),
    updateSubCategory: async (subCategoryId, item) =>
      await apiClient.put(`SubCategories/${subCategoryId}`, item),
    addExpertise: async (categoryId, expertiseId) =>
      await apiClient.post(`${'Categories'}/${categoryId}/expertises`, { categoryId, expertiseId }),
    removeExpertise: async (categoryId, expertiseId) =>
      await apiClient.delete(`${'Categories'}/${categoryId}/expertises/${expertiseId}`),
  };

  useEffect(() => {
    fetchCategories();
    fetchExpertises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    const { response, error, isSuccess } = await repository.getCategories();
    if (isSuccess) {
      setCategories(response.items);
      setSubCategories([]);
    } else {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    const { response, error, isSuccess } = await repository.getSubCategories(categoryId);
    if (isSuccess) {
      setSubCategories(response.items);
    } else {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchExpertises = async () => {
    const { response, error, isSuccess } = await repository.getExpertises();
    if (isSuccess) {
      setExpertises(response.items);
    } else {
      console.error('Error fetching expertises:', error);
    }
  };

  const handleItemClick = (item, type) => {
    switch (type) {
      case 'category':
        setSelectedCategory(item);
        fetchSubCategories(item.id);
        break;
      case 'subCategory':
        setSelectedSubCategory(item);
        break;
      default:
        break;
    }
  };

  const updateCategoryExpertises = async (id) => {
    const { isSuccess, response } = await repository.getCategory(id);

    if (isSuccess) {
      setSelectedCategory((prev) => ({
        ...prev,
        allowedExpertises: response.allowedExpertises,
      }));

      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, allowedExpertises: response.allowedExpertises } : c))
      );
    }
  };

  const handleAddExpertise = async (expertiseId) => {
    const { id } = selectedCategory;
    const { isSuccess } = await repository.addExpertise(id, expertiseId);

    if (isSuccess) {
      await updateCategoryExpertises(id);
    }
  };

  const handleRemoveExpertise = async (expertiseId) => {
    const { id } = selectedCategory;
    const { isSuccess } = await repository.removeExpertise(id, expertiseId);

    if (isSuccess) {
      await updateCategoryExpertises(id);
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
    const action = editItem.id
      ? repository[`update${capitalizeFirstLetter(editType)}`]
      : repository[`create${capitalizeFirstLetter(editType)}`];

    const categoryId = !editItem.id ? getParentId() : null;

    const { error, isSuccess } = editItem.id
      ? await action(editItem.id, { ...editItem, categoryId })
      : await action({ ...editItem, categoryId });

    if (isSuccess) {
      handleDialogClose();
      refreshList(editType);
    } else {
      console.error('Error saving item:', error);
    }
  };

  const getParentId = () => {
    switch (editType) {
      case 'subCategory':
        return selectedCategory.id;
      default:
        return null;
    }
  };

  const refreshList = (type) => {
    switch (type) {
      case 'category':
        fetchCategories();
        break;
      case 'subCategory':
        fetchSubCategories(selectedCategory.id);
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
              (type === 'category' && selectedCategory?.id === item.id) ||
              (type === 'subCategory' && selectedSubCategory?.id === item.id)
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
      {renderList(categories, 'category', 'Categories')}
      {renderList(subCategories, 'subCategory', 'Subcategories')}
      {/* {renderList(expertises, 'expertise', 'Expertises')} */}
      <Box border={1} borderColor='grey.300' borderRadius={2} p={2} m={1} flexGrow={1}>
        <EntityExpertises
          expertises={expertises}
          handleAddExpertise={handleAddExpertise}
          handleRemoveExpertise={handleRemoveExpertise}
          selectedItemExpertises={selectedCategory?.allowedExpertises}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editItem?.id ? 'Edit' : 'Add'} {editType}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Name'
            fullWidth
            value={editItem?.name || ''}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          />
          {editItem?.isActive && (
            <Box display='flex' alignItems='center' mt={2}>
              <Typography>Active</Typography>
              <Switch
                checked={editItem?.isActive || false}
                onChange={(e) => setEditItem({ ...editItem, isActive: e.target.checked })}
              />
            </Box>
          )}
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

export default Categories;
