import React from "react";
import {
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Grid } from "@mui/material";

// Stats Panel Component
const StatsPanel = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <Card sx={{ height: '100%', p: 2 }}>
          <Typography>No data available</Typography>
        </Card>
      );
    }
  
    const stats = data[0];
  
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Disaster Statistics</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                Total Deaths: {stats.total_deaths?.toLocaleString() || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Affected Population: {stats.affected_population?.toLocaleString() || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Economic Loss: ${stats.economic_loss?.toLocaleString() || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };
export default StatsPanel;