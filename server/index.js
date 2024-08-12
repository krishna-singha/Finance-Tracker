const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();

const apiRouter = require("./routes/api");

// Port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.send("Server is running...");
});

app.use("/api", apiRouter);

// Start server
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});