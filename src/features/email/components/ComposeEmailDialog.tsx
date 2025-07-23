import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface ComposeEmailDialogProps {
  open: boolean;
  onClose: () => void;
  onSend: (emailData: { to: string; subject: string; body: string }) => void;
}

export const ComposeEmailDialog: React.FC<ComposeEmailDialogProps> = ({ open, onClose, onSend }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    onSend({ to, subject, body });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Compose New Email</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="to"
          label="To"
          type="email"
          fullWidth
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <TextField
          margin="dense"
          id="subject"
          label="Subject"
          type="text"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="dense"
          id="body"
          label="Body"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
