import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { api, setToken } from '../api';

interface Props {
  onAuth: (token: string) => void;
}

const Auth: React.FC<Props> = ({ onAuth }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        const res = await api.post('/user/login', { email, password });
        setToken(res.data.token);
        onAuth(res.data.token);
      } else {
        await api.post('/user/register', { email, password });
        setMode('login');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '發生錯誤');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" mb={2}>{mode === 'login' ? '登入' : '註冊'}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField label="密碼" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>{mode === 'login' ? '登入' : '註冊'}</Button>
        </form>
        <Button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} sx={{ mt: 2 }}>
          {mode === 'login' ? '沒有帳號？註冊' : '已有帳號？登入'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Auth; 