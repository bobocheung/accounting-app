import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Typography, Paper, Grid } from '@mui/material';

interface Category {
  id: number;
  name: string;
  icon: string;
  type: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    api.get('/category').then(res => setCategories(res.data));
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5">分類管理</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {categories.map(cat => (
          <Grid item xs={3} sm={2} md={1} key={cat.id} item>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <span style={{ fontSize: 32 }}>{cat.icon}</span>
              <Typography>{cat.name}</Typography>
              <Typography variant="caption" color="text.secondary">{cat.type === 'income' ? '收入' : cat.type === 'expense' ? '支出' : '轉帳'}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Categories; 