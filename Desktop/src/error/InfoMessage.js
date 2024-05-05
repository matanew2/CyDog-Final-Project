import { useAuth } from "../contexts/AuthContext";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';

export default function InfoMessage() {
    const { message, setMessage } = useAuth();

    const handleClose = () => {
        setMessage(null);
    };

    return (
        <Dialog open={!!message} onClose={handleClose}>
            <DialogTitle>NOTE</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Alert icon={<GppMaybeIcon />} severity="info">
                        <AlertTitle>Pay Attention</AlertTitle>
                        {message}
                    </Alert>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}