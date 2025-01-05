import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const EntityExpertises = ({
  expertises,
  handleAddExpertise,
  handleRemoveExpertise,
  selectedItemExpertises = [],
}) => {
  const [showExpertiseDialog, setShowExpertiseDialog] = useState(false);

  const exprtiseListToChooseFrom = expertises.filter(
    (expertise) => !selectedItemExpertises.some((e) => e.id === expertise.id)
  );

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant='h6'>Expertises</Typography>
        <Button variant='contained' color='primary' onClick={() => setShowExpertiseDialog(true)}>
          Add
        </Button>
      </Stack>
      <List>
        {selectedItemExpertises.map((expertise) => (
          <ListItemButton key={expertise.id}>
            <ListItemText primary={expertise.name} />
            <IconButton onClick={() => handleRemoveExpertise(expertise.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>

      <Dialog open={showExpertiseDialog} onClose={() => setShowExpertiseDialog(false)}>
        <DialogTitle>Add Expertise</DialogTitle>
        <DialogContent>
          {exprtiseListToChooseFrom.map((expertise) => (
            <div key={expertise.id}>
              <Checkbox checked={false} onChange={() => handleAddExpertise(expertise.id)} />
              {expertise.name}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExpertiseDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntityExpertises;
