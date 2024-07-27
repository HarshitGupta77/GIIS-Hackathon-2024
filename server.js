// Import required packages
const express = require('express');
const cors = require('cors');


// Create Express app
const app = express();
const port = 3001;

var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
  };

  app.use(cors(corsOptions));

app.use(express.json());


app.post('/calculate', (req, res) => {
    try {
      // Get input data from the request body
      const { 
        electricityUsageKWh, 
        transportationUsageGallonsPerMonth,
        shortFlight,
        longFlight,
        dietaryChoice, 
    } = req.body;
  
      // Constants for emission factors and conversion factors
      const electricityFactor = 0.3978; 
      const transportationFactor = 9.087; 
      const shortFlightFactor = 100; 
      const longFlightFactor = 300; 
      const dietaryFactors = {
        Vegan: 200, 
        Vegetarian: 400, 
        NonVegetarian: 800 
      };

      const year = 12
  
      // Calculate CO2 emissions for electricity and transportation
      const electricityEmissions = electricityUsageKWh * electricityFactor;
      const transportationEmissions = transportationUsageGallonsPerMonth * transportationFactor;

      // Calculate air travel emissions for each type of flight
      const airTravelEmissionsShortHaul = shortFlight * shortFlightFactor;
      const airTravelEmissionsLongHaul = longFlight * longFlightFactor;

      // Calculate dietary choice emissions
      const dietaryChoiceEmissions = dietaryFactors[dietaryChoice] || 0; 

      // Calculate total air travel emissions
      const totalAirTravelEmissions =
            airTravelEmissionsShortHaul + airTravelEmissionsLongHaul;
  
      // Calculate yearly totals based on monthly inputs
      const yearlyElectricityEmissions = electricityEmissions * year;
      const yearlyTransportationEmissions = transportationEmissions * year;
  
      // Calculate total yearly CO2 emissions
      const totalYearlyEmissions = 
          yearlyElectricityEmissions + 
          yearlyTransportationEmissions +
          totalAirTravelEmissions +
          dietaryChoiceEmissions;


      const result = {
        totalYearlyEmissions: { value: totalYearlyEmissions, unit: 'kgCO2e/year' },
        yearlyTransportationEmissions: { value: yearlyTransportationEmissions, unit: 'kgCO2e/year' },
        yearlyElectricityEmissions: { value: yearlyElectricityEmissions, unit: 'kgCO2e/year' },
        totalAirTravelEmissions: { value: totalAirTravelEmissions, unit: 'kgCO2e/year' },
        dietaryChoiceEmissions: { value: dietaryChoiceEmissions, unit: 'kgCO2e/year' },
      };
  
      // Send the result as JSON response
      res.json(result);
    } catch (err) {
      console.error('Error calculating CO2 emissions:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});