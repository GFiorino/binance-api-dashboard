// DOM Element for Chart
const chartCanvas = document.getElementById("chart").getContext("2d");

// Initialize Chart with Binance Yellow Theme
let priceChart = new Chart(chartCanvas, {
  type: "line",
  data: {
    labels: [], // Timestamps
    datasets: [
      {
        label: "Price (USD)",
        data: [], // Prices
        borderColor: "#F3BA2F", // Binance Yellow
        backgroundColor: "rgba(243, 186, 47, 0.1)", // Light yellow fill
        borderWidth: 2,
        tension: 0.4, // Smooth line
        pointRadius: 0, // Hide points for a cleaner line
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#F5F5F5", // Light text color for the dark background
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "#F5F5F5",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#F5F5F5", // Light text color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)",
          color: "#F5F5F5",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#F5F5F5", // Light text color
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Subtle grid lines
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation
    },
  },
});

// Fetch Historical Data from Binance API
async function fetchHistoricalData(symbol) {
  const BASE_URL =
    "https://cors-anywhere.herokuapp.com/https://api.binance.com/api/v3/klines";
  const interval = "1h"; // 1-hour interval
  const limit = 50; // Fetch 50 data points

  try {
    const response = await fetch(
      `${BASE_URL}?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch historical data");
    const data = await response.json();
    return data.map((candle) => ({
      time: new Date(candle[0]).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Format timestamp (HH:MM)
      price: parseFloat(candle[4]), // Close price
    }));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}

// Update Chart Data
async function updateChart(symbol) {
  const historicalData = await fetchHistoricalData(symbol);

  if (historicalData.length > 0) {
    priceChart.data.labels = historicalData.map((entry) => entry.time); // Update timestamps
    priceChart.data.datasets[0].data = historicalData.map(
      (entry) => entry.price
    ); // Update prices
    priceChart.update(); // Redraw chart
    console.log("Chart updated successfully!");
  } else {
    console.error("No data available for chart.");
  }
}

// DOM Elements
const cryptoDropdown = document.getElementById("crypto-dropdown");

// Event Listener: Update Chart on Dropdown Change
cryptoDropdown.addEventListener("change", () => {
  const selectedSymbol = cryptoDropdown.value;
  updateChart(selectedSymbol);
});

// Initial Load
window.addEventListener("DOMContentLoaded", () => {
  const defaultSymbol = cryptoDropdown.value;
  updateChart(defaultSymbol); // Load chart for default selection
});
