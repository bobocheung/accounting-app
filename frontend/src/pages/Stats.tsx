import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Box, Typography, Paper } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Record {
  id: number;
  type: string;
  amount: number;
  category: { name: string; icon: string };
  date: string;
}

const Stats: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  useEffect(() => {
    api.get('/record').then(res => setRecords(res.data));
  }, []);

  // 先計算 labels
  const labels = Array.from(new Set(records.map(r => r.category.name)));
  // 圓餅圖資料
  const pieData = {
    labels,
    datasets: [{
      data: labels.map(label => records.filter(r => r.category.name === label).reduce((sum, r) => sum + r.amount, 0)),
      backgroundColor: ['#FFB300', '#64B5F6', '#E57373', '#81C784', '#BA68C8', '#FFD54F', '#4DD0E1', '#A1887F'],
    }]
  };

  // 長條圖資料
  const barData = {
    labels: records.map(r => r.date.slice(0, 10)),
    datasets: [{
      label: '金額',
      data: records.map(r => r.amount),
      backgroundColor: '#64B5F6',
    }]
  };

  return (
    <Box p={2}>
      <Typography variant="h5">圖表統計</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography>圓餅圖</Typography>
        <Pie data={pieData} />
      </Paper>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography>長條圖</Typography>
        <Bar data={barData} />
      </Paper>
    </Box>
  );
};

export default Stats; 