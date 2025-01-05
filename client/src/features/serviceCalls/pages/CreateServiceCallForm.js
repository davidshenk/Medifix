import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useAuth } from '../../authentication';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useServiceCallApi } from '../services/useServiceCallApi';
import { SelectField } from '../components/SelectField';
import { useAlert } from '../../../context/AlertContext';
import { Roles } from '../../../constant';
import useDense from '../../../hooks/useDense';

const detailsTextFieldRows = 5;
const required = 'Required';

const serviceCallType = [
  { name: 'New', id: 1 },
  { name: 'Repair', id: 2 },
];
const serviceCallPriority = [
  { name: 'Low', id: 1 },
  { name: 'Medium', id: 2 },
  { name: 'High', id: 3 },
  { name: 'Critical', id: 4 },
];

const CreateServiceCallForm = () => {
  const [searchParams] = useSearchParams();
  const { size, largeSize } = useDense();
  const locationId = searchParams.get('locationId');
  const [isLocationFromParam, setIsLocationFromParam] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm();
  const { user, type } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const api = useServiceCallApi();
  const { displayAlert } = useAlert();
  const [clientId, setClientId] = useState(null);

  const isManager = type === Roles.manager;

  const [formData, setFormData] = useState({
    buildings: [],
    floors: [],
    departments: [],
    rooms: [],
    categories: [],
    subCategories: [],
    clients: [],
  });

  const handleClientChange = (e, value) => {
    setClientId(value?.id);
  };

  useEffect(() => {
    const initForm = async () => {
      if (locationId) {
        await fetchLocation(locationId);
      } else {
        const buildings = await api.fetchBuildings();
        setFormData((prev) => ({ ...prev, buildings }));
      }

      const categories = await api.fetchCategories();
      const clients = await api.fetchClients();
      setFormData((prev) => ({ ...prev, categories, clients }));
    };

    initForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const handleChange = async (field, value) => {
    setValue(field, value);

    const handlers = {
      building: async () => {
        const floors = await api.fetchChildren(value);
        setFormData((prev) => ({ ...prev, floors, departments: [], rooms: [] }));
        ['floor', 'department', 'room'].forEach((x) => setValue(x, ''));
      },
      floor: async () => {
        const departments = await api.fetchChildren(value);
        setFormData((prev) => ({ ...prev, departments, rooms: [] }));
        ['department', 'room'].forEach((x) => setValue(x, ''));
      },
      department: async () => {
        const rooms = await api.fetchChildren(value);
        setFormData((prev) => ({ ...prev, rooms }));
        ['room'].forEach((x) => setValue(x, ''));
      },
      category: async () => {
        const subCategories = await api.fetchSubCategories(value);
        setFormData((prev) => ({ ...prev, subCategories }));
        ['subCategory'].forEach((x) => setValue(x, ''));
      },
    };

    if (handlers[field]) {
      await handlers[field]();
    }
  };

  const fetchLocation = async (locationId) => {
    const response = await api.fetchLocation(locationId);
    if (response) {
      setIsLocationFromParam(true);
      const [building, floor, department, room] = [1, 2, 3, 4].map((value) =>
        response.find((x) => x.locationType.value === value)
      );

      setValue('building', building.id);
      setValue('floor', floor.id);
      setValue('department', department.id);
      setValue('room', room.id);

      setFormData({
        ...formData,
        buildings: [building],
        floors: [floor],
        departments: [department],
        rooms: [room],
      });
    }
  };

  const onSubmit = async (data) => {
    const serviceCall = {
      clientId: clientId || user.sub,
      locationId: data.room,
      serviceCallType: data.type,
      subCategoryId: data.subCategory,
      details: data.details,
      priority: data.priority,
    };

    const { isSuccess, error } = await api.submitServiceCall(serviceCall);
    isSuccess ? navigate(from, { replace: true }) : displayAlert(error);
  };

  return (
    <Container maxWidth='md'>
      <Paper elevation={3} sx={{ padding: { xs: 2, md: 4 }, marginY: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom marginBottom={2} align='center'>
          Service Call Request
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {isManager && (
              <>
                <Grid item xs={12}>
                  <Autocomplete
                    disablePortal
                    onChange={handleClientChange}
                    options={formData.clients.map((c) => ({ label: c.fullName, id: c.clientId }))}
                    renderInput={(params) => <TextField {...params} label='Client' />}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={6}>
              <SelectField
                label='Building'
                options={formData.buildings}
                name='building'
                register={register}
                getValues={getValues}
                errors={errors}
                disabled={isLocationFromParam}
                onChange={(e) => handleChange('building', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectField
                label='Floor'
                options={formData.floors}
                name='floor'
                register={register}
                getValues={getValues}
                errors={errors}
                disabled={isLocationFromParam}
                onChange={(e) => handleChange('floor', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectField
                label='Department'
                options={formData.departments}
                name='department'
                register={register}
                getValues={getValues}
                errors={errors}
                disabled={isLocationFromParam}
                onChange={(e) => handleChange('department', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectField
                label='Room'
                options={formData.rooms}
                name='room'
                register={register}
                getValues={getValues}
                errors={errors}
                disabled={isLocationFromParam}
                onChange={(e) => handleChange('room', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <SelectField
                label='Type'
                options={serviceCallType}
                name='type'
                register={register}
                getValues={getValues}
                errors={errors}
                onChange={(e) => handleChange('type', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectField
                label='Category'
                options={formData.categories}
                name='category'
                register={register}
                getValues={getValues}
                errors={errors}
                onChange={(e) => handleChange('category', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectField
                label='SubCategory'
                options={formData.subCategories}
                name='subCategory'
                register={register}
                getValues={getValues}
                errors={errors}
                onChange={(e) => handleChange('subCategory', e.target.value)}
                size={size}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Service call details'
                placeholder='Describe the issue or request'
                multiline
                rows={detailsTextFieldRows}
                {...register('details', { required })}
                error={!!errors.details}
                helperText={errors.details?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <SelectField
                  label='Priority'
                  options={serviceCallPriority}
                  name='priority'
                  register={register}
                  getValues={getValues}
                  errors={errors}
                  defaultValue={'1'}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  size={size}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type='submit'
                  variant='contained'
                  size={largeSize}
                  disabled={!isValid}
                  sx={{ minWidth: 120 }}>
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <DevTool control={control} placement='top-left'></DevTool>
    </Container>
  );
};

export default CreateServiceCallForm;
