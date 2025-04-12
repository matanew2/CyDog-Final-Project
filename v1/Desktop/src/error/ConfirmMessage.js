import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

/**
 * ConfirmMessage component
 * @param {function} onConfirm - Confirm function
 * @param {function} onCancel - Cancel function
 * @returns {JSX.Element} - ConfirmMessage component
 * @description ConfirmMessage component for displaying confirmation message
 */
function ConfirmMessage({ onConfirm, onCancel }) {
    return (
        <Dialog open={true}>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to finish the task?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>No</Button>
                <Button onClick={onConfirm} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmMessage;