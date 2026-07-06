//https://www.w3schools.com/nodejs/nodejs_express.asp

import express from "express"
import cors from "cors"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Scouting server is running!");
});

// Receive match data
app.post("/match", (req, res) => {

    const match = req.body;

    console.log("Received match:");
    console.log(match);

    res.json({
        success: true,
        message: "Match received!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});