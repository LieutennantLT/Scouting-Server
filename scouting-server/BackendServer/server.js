import express from "express";
import cors from "cors";
import db from "./database.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;


// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Middleware
app.use(cors());
app.use(express.json());

// Recieve match data from the scouting app and save it to the database

app.post("/match", (req, res) => {

    const match = req.body;

    console.log("Received match:");
    console.log(match);


    const insert = db.prepare(`
        INSERT INTO matches (
            matchID,
            team,
            alliance,
            autoPoints,
            teleopPoints,
            teleopPassPoints,
            climb,
            notes,
            broke
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);


    insert.run(
        match.matchID,
        match.team,
        match.alliance,
        match.autoPoints,
        match.teleopPoints,
        match.teleopPassPoints,
        match.climb,
        match.notes,
        match.broke
    );


    res.json({
        success: true,
        message: "Saved match!"
    });

});



// Get all matches from the database and send them to the dashboard

app.get("/matches", (req, res) => {

    const matches = db
        .prepare("SELECT * FROM matches")
        .all();

    res.json(matches);

});


// Test route to check if the server is running

app.get("/", (req, res) => {

    res.send("Scouting server is running!");

});


// Serve React dashboard
app.use(
    express.static(
        path.join(__dirname, "dashboard/dist")
    )
);

// Start server

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});