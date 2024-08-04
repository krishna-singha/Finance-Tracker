import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your API key
const SYMBOL = 'AAPL'; // Example stock symbol

const RealTimeStock = () => {
  const [stock, setStock] = useState(null);

  const fetchStock = async () => {
    try {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: SYMBOL,
          interval: '1min',
          apikey: API_KEY,
        },
      });
      const data = response.data['Time Series (1min)'];
      const latestTime = Object.keys(data)[0];
      const latestValue = data[latestTime]['1. open'];
      setStock({ name: SYMBOL, value: parseFloat(latestValue) });
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 60000); // Refresh data every 60 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div>
      <h2>Real-Time Stock Price</h2>
      {stock ? (
        <div>{stock.name}: ${stock.value.toFixed(2)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default RealTimeStock;
