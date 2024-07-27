import { useState } from "react";
import backgroundImage from "./assets/CarbonFootprintF1.jpg";
import backgroundImage2 from "./assets/Foliage_F2.jpg";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

export default function App() {

  const [formData, setFormData] = useState({
    electricityUsageKWh: '',
    transportationUsageGallonsPerMonth: '',
    shortFlight: '',
    longFlight: '',
    dieteryChoice: 'Vegetarian'
  });

  const [result, setResult] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement >
  ) => {
    const {name,value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/calculate",{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok){
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log("API Response Data:", data);
    
      setResult(data);


      setChartData({ 
        labels: ["Electricity","Transportation","Air Travel","Dietary Choice"],

        datasets: [
          {
            label: "CO2 Emissions (kgCO2e/year)",
            data: [
              data.totalTransportationUsage || 0,
              data.totalElectricityUsage || 0,
              data.totalEmissionsFlight|| 0,
              data.dietaryChoiceEmissions || 0
            ],
            backgroundColor: [
              "rgba(255,99,132,0.6)",
              "rgba(54,162,235,0.6)",
              "rgba(255,206,86,0.6)",
              "rgba(75,192,192,0.6)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54,162,235,1)",
              "rgba(255,206,86,1)",
              "rgba(75,192,192,1)",
            ],
            borderWidth: 1 
          },
        ],
      })

      console.log(data);
      console.log("API Response Data:", data);
    } catch(err){
      console.log(err);
    }
    
  };

  Chart.register(...registerables)

  const [ chartData, setChartData] = useState<any>({
    labels: ["Electricity","Transportation","Air Travel","Dietary Choice"],

    datasets: [
      {
        label: "CO2 Emissions (kgCO2e/year)",
        data: [
          result?.totalTransportationUsage || 0,
          result?.totalElectricityUsage || 0,
          result?.totalEmissionsFlight|| 0,
          result?.dietaryChoiceEmissions || 0
        ],
        backgroundColor: [
          "rgba(255,99,132,0.6)",
          "rgba(54,162,235,0.6)",
          "rgba(255,206,86,0.6)",
          "rgba(75,192,192,0.6)",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54,162,235,1)",
          "rgba(255,206,86,1)",
          "rgba(75,192,192,1)",
        ],
        borderWidth: 1 
      },
    ],
  });

  const charOption = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  
  return (
    <>
      <div
      className = "min-h-screen flex items-center justify-center p-5 flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
      >
        <div className = "bg-gray-200 p-10 w-full max-w-screen-lg"
        style={{
        backgroundImage: `url(${backgroundImage2})`,
        backgroundSize: "cover",
      }}
    >
      <h1 className = "text-5xl font-bold mb-6 text-center text-white"> 
        Carbon Footrprint Calculator
      </h1>

      <p className = "text-xl font-bold mb-6 text-center text-white"> 
        @ByteClub
      </p>
      </div>
        <div className = "flex flex-col md:flex-row gap-8 bg-gray-200 p-10 w-full max-w-screen-lg">
          <div className = "bg-white p-8 rounded-lg shadow-lg flex-1">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Carbon Footprint Calculator
            </h1>
            <form onSubmit={handleSubmit} className="space-y">

              <div className="flex flex-col">

                <label className="mb-2"> Electricity Usage (KWh/Month): </label>
                <input 
                  type="number" 
                  name="electricityUsageKWh" 
                  value={formData.electricityUsageKWh}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />

                <label className="mb-2"> Transportation Gasoline Usage (Gallons/Month): </label>
                <label className="mb-2">(Miles Per Month / Miles Per Gallon) * Cost Per Gallon</label>
                <input 
                  type="number" 
                  name="TransportationGasolineUsage" 
                  value={formData.TransportationGasolineUsage}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                /> 
                

                <label className="mb-2"> Short Flights (4 hours): </label>
                <input 
                  type="number" 
                  name="ShortFlights" 
                  value={formData.ShortFlights}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                /> 

                <label className="mb-2"> Long Flights (8 hours): </label>
                <input 
                  type="number" 
                  name="LongFlights" 
                  value={formData.LongFlights}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"
                />  
              </div>   
              <div className="flex flex-col">
                <label className="mb-2 "> Dietary Choice: </label>
                <select
                  name="dietaryChoice"
                  value={formData.dietaryChoice}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-2"            
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="NonVegetarian">Non Vegetarian</option>
                </select>
              </div>   
              <br></br>
              <div className="flex flex-col">
                <button
                type="submit" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Calculate
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Yearly Emisions Statictics
            </h1>
            <Bar data={chartData} options={charOption} />
            {result && (
              <div className="mt-8">
                <div>
                  <p className="text-2xl font-bold"> Air Travel: </p>
                  <p className="text-xl">
                    {result.totalEmissionsFlight.value}{" "}
                    {result.totalEmissionsFlight.unit}  
                  </p>
                  <br></br>

                  <p className="text-2xl font-bold"> Electricity: </p>
                  <p className="text-xl">
                    {result.electricityUsageKWh.value}{" "}
                    {result.electricityUsageKWh.unit}
                  </p>
                  <br></br>

                  <p className="text-2xl font-bold"> Transportation: </p>
                  <p className="text-xl">
                    {result.totalTransportationUsage.value}{" "}
                    {result.totalTransportationUsage.unit}
                  </p>
                  <br></br>

                  <p className="text-2xl font-bold"> Dietary Choice: </p>
                  <p className="text-xl">
                    {result.dietaryChoiceEmission.value}{" "}
                    {result.dietaryChoiceEmission.unit}
                  </p>
                  <br></br>

                  <p className="text-2xl font-bold"> 
                    Total: {result.TotalYearlyEmissions.value}{" "}
                    {result.TotalYearlyEmissions.unit}
                  </p>
                  <br></br>
                </div>
              </div>
            )}
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
}
