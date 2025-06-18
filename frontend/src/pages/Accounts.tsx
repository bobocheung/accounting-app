import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Typography, Paper, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Account {
  id: number;
  name: string;
  balance: number;
  icon: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Account | null>(null);
  const [form, setForm] = useState({ name: '', icon: '💰' });

  const fetchAccounts = async () => {
    const res = await api.get('/account');
    setAccounts(res.data);
  };
  useEffect(() => { fetchAccounts(); }, []);

  const handleOpen = (acc?: Account) => {
    setEdit(acc || null);
    setForm(acc ? { name: acc.name, icon: acc.icon } : { name: '', icon: '💰' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (edit) {
      await api.put(`/account/${edit.id}`, form);
    } else {
      await api.post('/account', form);
    }
    setOpen(false);
    fetchAccounts();
  };
  const handleDelete = async (id: number) => {
    await api.delete(`/account/${id}`);
    fetchAccounts();
  };

  return (
    <Box p={2}>
      <Typography variant="h5">資產管理</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleOpen()}>新增帳戶</Button>
      <List>
        {accounts.map(acc => (
          <ListItem key={acc.id}>
            <ListItemText primary={`${acc.icon} ${acc.name}`} secondary={`餘額：NT$${acc.balance}`} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleOpen(acc)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(acc.id)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{edit ? '編輯帳戶' : '新增帳戶'}</DialogTitle>
        <DialogContent>
          <TextField label="名稱" fullWidth margin="normal" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="圖標" fullWidth margin="normal" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">儲存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accounts; 