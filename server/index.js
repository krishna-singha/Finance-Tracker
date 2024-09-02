const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();

// ENV variables
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Import routes and database connection
const connectToMongoDB = require("./database/connection");
const userRouter = require("./routes/user");
const apiRouter = require("./routes/api");
const addDataRouter = require("./routes/addData");
const getIncomeDataRouter = require("./routes/getData");
const getAllTransactionsRouter = require("./routes/allTransections");
const getStocksRouter = require("./routes/getStocks");
const geminiRouter = require("./routes/geminiAI");
const sellStockRouter = require("./routes/sellStock");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: FRONTEND_URL,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }
));
app.use("/v1", (req, res, next) => {
    if (req.headers.origin === FRONTEND_URL) {
        next();
    } else {
        res.status(403).json({
            error: "Unauthorized",
            message: `Sorry, you are not allowed to access this API.`,
        });
    }
});

// Connect to MongoDB
connectToMongoDB();

// Routes
app.get("/", (req, res) => {
    return res.send("Server is running...");
}
);
app.use("/v1/user", userRouter);
app.use("/v1/api", apiRouter);
app.use("/v1/api/addData", addDataRouter);
app.use("/v1/api/getData", getIncomeDataRouter);
app.use("/v1/api/getAllTransactions", getAllTransactionsRouter);
app.use("/v1/api/getStocks", getStocksRouter);
app.use("/v1/api/ai", geminiRouter);
app.use("/v1/api/sellStock", sellStockRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});