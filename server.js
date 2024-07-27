const express = require("express")
const cors = require("cors")

const port = 3001;

const app = express();

var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json())

app.post("/calculate",(req,res) => {

    try {

        const{
            electricityUsageKWh,
            transportationUsageGallonsPerMonth, 
            shortFlight,
            longFlight,
            dieteryChoice

        } = req.body

        const electricityFactor = 0.3978;
        const transportationFactor = 9.087;
        const shortFlightFactor = 100;
        const longFlightFactor = 300;
        const dieteryChoiceFactor = {
            Vegan: 200,
            Vegeterian: 400,
            NonVegeterian: 800
        }

        const year = 12;

        const electricityEmission = electricityUsageKWh * electricityFactor;
        const transportationEmission = transportationUsageGallonsPerMonth * transportationFactor;
        
        const airTravelShortFlightEmission = shortFlight * shortFlightFactor;
        const airTravelLongFlightEmission = longFlight * longFlightFactor;
        
        const dieteryChoiceEmission = dieteryChoiceFactor[dieteryChoice] || 0;
        const totalEmissionsFlight = airTravelShortFlightEmission + airTravelLongFlightEmission
        const totalElectricityUsage = electricityEmission * year
        const totalTransportationUsage = transportationEmission * year
        
        const totalYearlyEmissions = dieteryChoiceEmission + totalEmissionsFlight + totalElectricityUsage + totalTransportationUsage
        
        const result = {
            totalYearlyEmissions: {value: totalYearlyEmissions, unit: 'kgCO2/year'},
            totalTransportationUsage: {value: totalTransportationUsage, unit: 'kgCO2/year'},
            totalElectricityUsage: {value: totalElectricityUsage, unit: 'kgCO2/year'},
            totalEmissionsFlight: {value: totalEmissionsFlight, unit: 'kgCO2/year'},
            dieteryChoiceEmission: {value: dieteryChoiceEmission, unit: 'kgCO2/year'},
        }

        res.json(result)




    } catch(err) {

        console.error("Error calculating CO2 Emisions:",err)

        res.status(500).json({error:'Internal server error'})
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})  

