import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Box
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { convertMinutes } from '../../../utils/dateHelper';
import { camelCaseToWords } from '../../../utils/stringHelper';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CountBox = ({ title, count }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h4">{count}</Typography>
  </Paper>
);

const PieChartWithCustomizedLabel = ({ data, title, size = 300 }) => {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13}>
        {value}
      </text>
    );
  };

  return (
    <Box sx={{ height: size, width: '100%' }}>
      <Typography variant="subtitle2" align="center">{title}</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={size / 4}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} (${((value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(2)}%)`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const MaintenanceDashboard = ({ data }) => {
  const { 
    countBoxes, 
    practitioners, 
    priorityPieData, 
    categoryPieData, 
    typePieData,
    buildings 
  } = data;

  return (
    <Grid container spacing={3}>
      {/* Row 1: Count Boxes */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {Object.entries(countBoxes).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={key}>
              <CountBox title={camelCaseToWords(key)} count={value} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Row 2: Practitioners Table and Pie Charts */}
      <Grid item xs={12}>
        <Box display="flex" flexDirection="row" height={300} gap={5}>
          <Box width="50%" height="100%">
            <TableContainer component={Paper} elevation={3} sx={{ height: '100%', overflow: 'auto' }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Assigned</TableCell>
                    <TableCell align="right">Started</TableCell>
                    <TableCell align="right">Finished</TableCell>
                    <TableCell align="right">Avg Time to Close</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {practitioners.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">{row.assigned}</TableCell>
                      <TableCell align="right">{row.started}</TableCell>
                      <TableCell align="right">{row.finished}</TableCell>
                      <TableCell align="right">{convertMinutes(row.avgDurationMinutes)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box component={Paper} elevation={3} width="50%" display="flex" flexDirection="row" justifyContent="space-around">
            <PieChartWithCustomizedLabel data={priorityPieData} title="Count by Priority" />
            <PieChartWithCustomizedLabel data={categoryPieData} title="Count by Category" />
            <PieChartWithCustomizedLabel data={typePieData} title="Count by Type" />
          </Box>
        </Box>
      </Grid>

      {/* Row 3: Buildings Summary */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {buildings.map((building) => (
            <Grid item xs={12} sm={6} md={3} key={building.name}>
              <Paper elevation={3} sx={{ p: 1 }}>
                <Typography variant="subtitle1" align="center">{building.name}</Typography>
                <PieChartWithCustomizedLabel
                  data={[
                    { name: 'Open', value: building.open },
                    { name: 'Assigned', value: building.assigned },
                    { name: 'Started', value: building.started },
                    { name: 'Finished', value: building.finished },
                  ]}
                  title=""
                  size={300}
                />
                <Box mt={1}>
                  <Typography variant="body2">Total Calls: {building.totalServiceCalls}</Typography>
                  <Typography variant="body2">Avg Time to Close: {convertMinutes(building.avgDurationMinutes)}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MaintenanceDashboard;