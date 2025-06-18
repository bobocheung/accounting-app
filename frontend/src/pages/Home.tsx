import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Button, Typography, Paper, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface Record {
  id: number;
  type: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

const categories = ['餐飲', '交通', '娛樂', '收入', '其他'];

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '', date: '', note: '' });
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    const res = await api.get('/record');
    setRecords(res.data);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/record', { ...form, amount: Number(form.amount) });
      setForm({ type: 'expense', amount: '', category: '', date: '', note: '' });
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
          </TextField>
          <TextField label="金額" name="amount" value={form.amount} onChange={handleChange} type="number" />
          <TextField select label="分類" name="category" value={form.category} onChange={handleChange}>
            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
          <TextField label="日期" name="date" type="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField label="備註" name="note" value={form.note} onChange={handleChange} />
          <Button type="submit" variant="contained">新增</Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>日期</TableCell>
            <TableCell>類型</TableCell>
            <TableCell>分類</TableCell>
            <TableCell>金額</TableCell>
            <TableCell>備註</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.date.slice(0, 10)}</TableCell>
              <TableCell>{r.type === 'income' ? '收入' : '支出'}</TableCell>
              <TableCell>{r.category}</TableCell>
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