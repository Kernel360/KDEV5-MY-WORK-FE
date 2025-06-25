import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectAmountChart } from '../DashboardSlice';

const ProjectAmountChart = () => {
  const dispatch = useDispatch();
  const { chartData, chartType, loading, error } = useSelector(
    (state) => state.dashboard.projectAmountChart
  );

  const [selectedChartType, setSelectedChartType] = useState('CHART_TYPE_WEEK');

  useEffect(() => {
    dispatch(fetchProjectAmountChart(selectedChartType));
  }, [dispatch, selectedChartType]);

  const handleChartTypeChange = (newChartType) => {
    setSelectedChartType(newChartType);
  };

  const formatAmount = (amount) => {
    // API에서 받은 값이 이미 만원 단위이므로 천 단위 콤마만 추가
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            {label}
          </Typography>
          <Typography variant="body2" color="primary.main">
            금액: {formatAmount(payload[0].value)}만원
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300,
        }}
      >
        <Typography color="error">차트 데이터를 불러오는데 실패했습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <ButtonGroup size="small" variant="outlined">
          <Button
            onClick={() => handleChartTypeChange('CHART_TYPE_WEEK')}
            variant={selectedChartType === 'CHART_TYPE_WEEK' ? 'contained' : 'outlined'}
          >
            주간
          </Button>
          <Button
            onClick={() => handleChartTypeChange('CHART_TYPE_MONTH')}
            variant={selectedChartType === 'CHART_TYPE_MONTH' ? 'contained' : 'outlined'}
          >
            월간
          </Button>
        </ButtonGroup>
      </Box>

      {chartData.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Typography color="text.secondary">
            {selectedChartType === 'CHART_TYPE_WEEK' ? '주간' : '월간'} 데이터가 없습니다.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatAmount(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalAmount"
              fill="#1976d2"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ProjectAmountChart; 