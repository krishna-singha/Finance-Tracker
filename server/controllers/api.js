const handleApi = (req, res) => {
    return res.send("API is working...");
}

const handleGetStocksData = async (req, res) => {
    const apiKey = 'YOUR_API_KEY';  // Replace with your Finnhub API key
    const ticker = 'AAPL';  // Replace with the ticker symbol you want

    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const stockPrice = data.c;  // Current price
            document.getElementById('stock-price').innerText = `Current price of ${ticker}: $${stockPrice}`;
        })
        .catch(error => {
            console.error('Error fetching stock price:', error);
            document.getElementById('stock-price').innerText = 'Error fetching stock price';
        });
}

module.exports = {
    handleApi,
    handleGetStocksData
};