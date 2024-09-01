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
// app.use("/v1", (req, res, next) => {
//     if (req.headers.origin === FRONTEND_URL) {
//         next();
//     } else {
//         res.status(403).json({
//             error: "Invalid Origin Access",
//             message: `You are not authorized to make this request. Please use ${FRONTEND_URL} to make requests.`,
//         });
//     }
// });

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

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});