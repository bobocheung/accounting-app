import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Button, Typography, Paper, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Select, InputLabel, FormControl } from '@mui/material';

interface Record {
  id: number;
  type: string;
  amount: number;
  category: { id: number; name: string };
  account: { id: number; name: string };
  date: string;
  note?: string;
}
interface Category {
  id: number;
  name: string;
  type: string;
}
interface Account {
  id: number;
  name: string;
  icon: string;
}

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [form, setForm] = useState({ type: 'expense', amount: '', categoryId: '', accountId: '', date: '', note: '' });
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    const res = await api.get('/record');
    setRecords(res.data);
  };
  const fetchCategories = async () => {
    const res = await api.get('/category');
    setCategories(res.data);
  };
  const fetchAccounts = async () => {
    const res = await api.get('/account');
    setAccounts(res.data);
  };

  useEffect(() => {
    fetchRecords();
    fetchCategories();
    fetchAccounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as string]: value });
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.accountId || !form.categoryId) {
      setError('請選擇帳戶與分類');
      return;
    }
    try {
      await api.post('/record', { ...form, amount: Number(form.amount), categoryId: Number(form.categoryId), accountId: Number(form.accountId) });
      setForm({ type: 'expense', amount: '', categoryId: '', accountId: '', date: '', note: '' });
      fetchRecords();
    } catch {
      setError('發生錯誤');
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">記帳本</Typography>
        <Button onClick={onLogout}>登出</Button>
      </Box>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <TextField select label="類型" name="type" value={form.type} onChange={handleChange}>
            <MenuItem value="expense">支出</MenuItem>
            <MenuItem value="income">收入</MenuItem>
            <MenuItem value="transfer">轉帳</MenuItem>
          </TextField>
          <TextField label="金額" name="amount" value={form.amount} onChange={handleChange} type="number" />
          <FormControl sx={{ minWidth: 120 }} required>
            <InputLabel>帳戶</InputLabel>
            <Select label="帳戶" name="accountId" value={form.accountId} onChange={handleSelectChange} required>
              {accounts.map(acc => <MenuItem key={acc.id} value={acc.id}>{acc.icon} {acc.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }} required>
            <InputLabel>分類</InputLabel>
            <Select label="分類" name="categoryId" value={form.categoryId} onChange={handleSelectChange} required>
              {categories.filter(c => c.type === form.type).map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="日期" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="備註" name="note" value={form.note} onChange={handleChange} />
          <Button type="submit" variant="contained" disabled={!form.accountId || !form.categoryId}>新增</Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>日期</TableCell>
            <TableCell>類型</TableCell>
            <TableCell>帳戶</TableCell>
            <TableCell>分類</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>備註</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.date.slice(0, 10)}</TableCell>
              <TableCell>{r.type === 'income' ? '收入' : r.type === 'expense' ? '支出' : '轉帳'}</TableCell>
              <TableCell>{r.account?.name}</TableCell>
              <TableCell>{r.category?.name}</TableCell>
              <TableCell>{r.amount}</TableCell>
              <TableCell>{r.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Home; 