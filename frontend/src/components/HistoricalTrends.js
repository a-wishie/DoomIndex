import React from "react";
import {
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


// Historical Trends Component
const HistoricalTrends = ({ data }) => {
    if (!data || data.length === 0) return null;
  
    // Process data for the chart
    const chartData = data.map(item => ({
      year: item.year,
      deaths: item.total_deaths,
      affected: item.affected_population,
    }));
  
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Historical Trends</Typography>
          <LineChart width={350} height={300} data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="deaths" stroke="#ef233c" name="Deaths" />
            <Line type="monotone" dataKey="affected" stroke="#2b2d42" name="Affected" />
          </LineChart>
        </CardContent>
      </Card>
    );
  };
export default HistoricalTrends;