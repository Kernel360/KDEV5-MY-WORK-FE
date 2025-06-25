import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Paper,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectAmountChart } from "../DashboardSlice";

const ProjectAmountChart = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { chartData, loading, error } = useSelector(
    (state) => state.dashboard.projectAmountChart
  );

  const [selectedChartType, setSelectedChartType] = useState("CHART_TYPE_WEEK");
  const [chartMode, setChartMode] = useState("bar");

  useEffect(() => {
    dispatch(fetchProjectAmountChart(selectedChartType));
  }, [dispatch, selectedChartType]);

  const handleChartTypeChange = (type) => setSelectedChartType(type);
  const handleChartModeChange = (mode) => setChartMode(mode);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("ko-KR").format(amount);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <Paper
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            border: "1px solid",
            borderColor: theme.palette.divider,
            boxShadow: 3,
          }}
        >
          <Typography fontSize={13} fontWeight={600} color="text.primary">
            {label}
          </Typography>
          <Typography fontSize={12} color="primary.main">
            금액: {formatAmount(payload[0].value)}만원
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const getButtonStyle = (isActive) => ({
    px: 2,
    textTransform: "none",
    fontSize: 13,
    fontWeight: 500,
    color: isActive
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    backgroundColor: isActive
      ? theme.palette.primary.main
      : theme.palette.grey[100],
    "&:hover": {
      backgroundColor: isActive
        ? theme.palette.primary.dark
        : theme.palette.grey[200],
    },
  });

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 20, left: 10, bottom: 10 },
    };

    const axes = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => formatAmount(v)}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
      </>
    );

    if (chartMode === "line") {
      return (
        <LineChart {...commonProps}>
          {axes}
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            dot={{ r: 4, stroke: theme.palette.primary.main }}
          />
        </LineChart>
      );
    }

    return (
      <BarChart {...commonProps}>
        {axes}
        <Bar
          dataKey="totalAmount"
          fill={theme.palette.primary.main}
          radius={[6, 6, 0, 0]}
          maxBarSize={50}
          isAnimationActive={false}
          activeBar={false}
        />
      </BarChart>
    );
  };

  return (
    <Box>
      {/* Chart Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 1,
        }}
      >
        <ButtonGroup size="small" variant="outlined">
          <Button
            onClick={() => handleChartTypeChange("CHART_TYPE_WEEK")}
            variant={
              selectedChartType === "CHART_TYPE_WEEK" ? "contained" : "outlined"
            }
            sx={getButtonStyle(selectedChartType === "CHART_TYPE_WEEK")}
          >
            주간
          </Button>
          <Button
            onClick={() => handleChartTypeChange("CHART_TYPE_MONTH")}
            variant={
              selectedChartType === "CHART_TYPE_MONTH"
                ? "contained"
                : "outlined"
            }
            sx={getButtonStyle(selectedChartType === "CHART_TYPE_MONTH")}
          >
            월간
          </Button>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Button
            onClick={() => handleChartModeChange("bar")}
            variant={chartMode === "bar" ? "contained" : "outlined"}
            sx={getButtonStyle(chartMode === "bar")}
          >
            막대
          </Button>
          <Button
            onClick={() => handleChartModeChange("line")}
            variant={chartMode === "line" ? "contained" : "outlined"}
            sx={getButtonStyle(chartMode === "line")}
          >
            꺾은선
          </Button>
        </ButtonGroup>
      </Box>

      {/* Chart */}
      {loading ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Typography color="error">
            차트 데이터를 불러오지 못했습니다.
          </Typography>
        </Box>
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            border: "1px solid",
            borderColor: theme.palette.divider,
          }}
        >
          <Typography color="text.secondary">
            {selectedChartType === "CHART_TYPE_WEEK" ? "주간" : "월간"} 데이터가
            없습니다.
          </Typography>
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default ProjectAmountChart;
