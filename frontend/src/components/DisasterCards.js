import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Grid } from "@mui/material";

// Disaster Cards Component
const DisasterCards = () => {
    const disastersInfo = [
      { title: "Drought", description: "Prolonged period of insufficient rainfall." },
      { title: "Earthquake", description: "Sudden shaking of the ground." },
      { title: "Epidemic", description: "Widespread occurrence of an infectious disease." },
      { title: "Extreme Temperature", description: "Unusual and severe weather conditions." },
      { title: "Flood", description: "Overflow of water submerging land." },
      { title: "Landslide", description: "Earth sliding down a slope." },
      { title: "Storm", description: "Violent disturbance of the atmosphere." },
      { title: "Wildfire", description: "Uncontrolled fires in forests or grasslands." }
    ];
  
    return (
      <Grid container spacing={3}>
        {disastersInfo.map((disaster, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#edf2f4",
                display: "flex",
                flexDirection: "column",
                borderColor: "#2b2d42",
                borderRadius: 4,
              }}
            >
              <CardMedia
                component="img"
                image={`/disasterImages/${disaster.title.toLowerCase()}.png`}
                alt={disaster.title}
                sx={{ objectFit: "fit" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "system-ui",
                    color: "#ef233c",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {disaster.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#2b2d42", textAlign: "center" }}
                >
                  {disaster.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

export default DisasterCards;