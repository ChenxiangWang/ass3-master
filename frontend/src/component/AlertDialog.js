import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

AlertDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onOk: PropTypes.func,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
}

export default function AlertDialog (props) {
  const { title, content, onOk, open, setOpen } = props;
  const handleClose = () => {
    if (onOk) {
      onOk();
    }
    setOpen(false);
  };

  return (
        <div>
            <Dialog
                open={open || false}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
  );
}
