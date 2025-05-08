import React from 'react';
import { Container, Typography, Card, CardContent, Divider, Box } from '@mui/material';

const Section = ({ title, children }) => (
  <Card className="mb-4 shadow-sm">
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </CardContent>
  </Card>
);

const LSVLawsPage = () => {
  return (
    <Container className="my-5">
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
        Low Speed Vehicle (LSV) Laws
      </Typography>
      <Typography variant="subtitle1" align="center" className="mb-4 text-muted">
        Ensure compliance to avoid citations or towing.
      </Typography>

      <Section title="Laws for All Drivers & Passengers of LSVs">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Drivers must have a valid driver’s license.</li>
          <li className="list-group-item">All front-seat passengers of any age must wear a seat belt. (One person per seat/seatbelt.)</li>
          <li className="list-group-item">All persons under the age of 18 must wear a seat belt. (One person per seat/seatbelt.)</li>
          <li className="list-group-item">All children age 5 and under must be in a car seat or booster seat.</li>
          <li className="list-group-item">No open alcohol containers are allowed in a low-speed vehicle.</li>
        </ul>
      </Section>

      <Section title="LSV Roadway Laws">
        <ul className="list-group list-group-flush">
          <li className="list-group-item">LSVs may only be driven on roadways with speed limits of 35 MPH or less.</li>
          <li className="list-group-item">It is illegal to drive LSVs on any sidewalk or bike path.</li>
          <li className="list-group-item">It is illegal to drive LSVs on US Highway 98 or its sidewalks.</li>
          <li className="list-group-item">Crossing US Highway 98 is only allowed at a four-way intersection.</li>
        </ul>
      </Section>

      <Section title="LSV Vehicle Requirements">
        <Typography variant="body1" className="mb-3">
          Differences between a Golf Cart and an LSV per Florida Law:
        </Typography>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Must have: headlamps, turn signals, stop lamps, tail lamps, red reflectors, mirrors, parking brake, windshield, seat belts, and a VIN.</li>
          <li className="list-group-item">Must be able to reach 20 MPH but not exceed 25 MPH.</li>
          <li className="list-group-item">Must have valid registration (tag) attached to the vehicle.</li>
        </ul>
      </Section>
    </Container>
  );
};

export default LSVLawsPage;
