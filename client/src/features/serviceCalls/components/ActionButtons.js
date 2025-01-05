import React from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
// import CreateIcon from '@mui/icons-material/Create';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ActionButtons = ({ row, onDelete: onCancel, onEdit, onAssign }) => {
  return (
    <Box display='flex' justifyContent='flex-end' gap={1}>
      {!row.practitioner && row.currentStatus.status.value !== 5 && (
        <>
          <Tooltip title={'Cancel'}>
            <IconButton onClick={onCancel}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title={'Edit'}>
            <IconButton onClick={onEdit}>
              <CreateIcon />
            </IconButton>
          </Tooltip> */}
          <Tooltip title={'Assign to practitioner'}>
            <IconButton onClick={onAssign}>
              <PersonAddIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}

export default ActionButtons