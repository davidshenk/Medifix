import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import useApiClient from '../../../api';
import EntityExpertises from '../components/EntityExpertises';

const Practitioners = () => {
  const apiClient = useApiClient();
  const [practitioners, setPractitioners] = useState([]);
  const [expertises, setExpertises] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);

  useEffect(() => {
    const fetchPractitioners = async () => {
      const { isSuccess, response } = await apiClient.get('Practitioners');
      if (isSuccess) {
        setPractitioners(response.items);
      }
    };
    const fetchExpertises = async () => {
      const { isSuccess, response } = await apiClient.get('Expertises');
      if (isSuccess) {
        setExpertises(response.items);
      }
    };

    fetchPractitioners();
    fetchExpertises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePractitionerRowClick = (practitioner) => {
    setSelectedPractitioner(practitioner);
  };

  const updatePractitionerExpertises = async (practitionerId) => {
    const { isSuccess, response } = await apiClient.get(
      `Practitioners/${practitionerId}/expertises`
    );

    if (isSuccess) {
      setSelectedPractitioner((prevPractitioner) => ({
        ...prevPractitioner,
        expertises: response.items,
      }));

      setPractitioners((prev) =>
        prev.map((p) =>
          p.practitionerId === practitionerId ? { ...p, expertises: response.items } : p
        )
      );
    }
  };

  const handleAddExpertise = async (expertiseId) => {
    const { practitionerId } = selectedPractitioner;

    const { isSuccess } = await apiClient.post(`Practitioners/${practitionerId}/expertises`, {
      expertiseId,
      practitionerId,
    });

    if (isSuccess) {
      await updatePractitionerExpertises(practitionerId);
    }
  };

  const handleRemoveExpertise = async (expertiseId) => {
    const { practitionerId } = selectedPractitioner;

    const { isSuccess } = await apiClient.delete(
      `Practitioners/${practitionerId}/expertises/${expertiseId}`
    );

    if (isSuccess) {
      await updatePractitionerExpertises(practitionerId);
    }
  };

  return (
    <Box display={'flex'}>
      <Box sx={{ flexGrow: 1, marginRight: 6 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {practitioners.map((practitioner) => (
                <TableRow
                  key={practitioner.practitionerId}
                  onClick={() => handlePractitionerRowClick(practitioner)}
                  hover
                  sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
                  selected={practitioner.practitionerId === selectedPractitioner?.practitionerId}>
                  <TableCell>{practitioner.firstName}</TableCell>
                  <TableCell>{practitioner.lastName}</TableCell>
                  <TableCell>{practitioner.email}</TableCell>
                  <TableCell>{practitioner.phoneNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {selectedPractitioner && (
        <Box component={Paper} sx={{ p: 2, width: 270 }}>
          <EntityExpertises
            expertises={expertises}
            handleAddExpertise={handleAddExpertise}
            handleRemoveExpertise={handleRemoveExpertise}
            selectedItemExpertises={selectedPractitioner.expertises}
          />
        </Box>
      )}
    </Box>
  );
};

export default Practitioners;
