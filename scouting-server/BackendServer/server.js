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

// Persistent matches
let matches = [];

// Recieve match data from the scouting app and save it to the database and to file

app.post("/match", (req, res) => {

    const match = req.body;

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
            broke,
            scoutName,
            trench
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        match.broke,
        match.scoutName,
        match.trench
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

app.delete("/matches", (req, res) => {

    try {

        db.prepare(
            "DELETE FROM matches"
        ).run();

        // Reset the auto-increment ID
        db.prepare(
            "DELETE FROM sqlite_sequence WHERE name = 'matches'"
        ).run();

        res.json({
            success: true,
            message: "All matches deleted."
        });

    } catch (error) {

        console.error(
            "Error deleting matches:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to delete matches."
        });

    }

});

// Importing previous matches

app.post("/matches/import", (req, res) => {

    try {

        const importedMatches = req.body;

        if (!Array.isArray(importedMatches)) {

            return res.status(400).json({
                success: false,
                error: "Expected an array of matches."
            });

        }

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
                broke,
                scoutName,
                trench
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const importTransaction = db.transaction(
            (matches) => {

                for (const match of matches) {

                    insert.run(
                        match.matchID,
                        match.team,
                        match.alliance,
                        match.autoPoints,
                        match.teleopPoints,
                        match.teleopPassPoints,
                        match.climb,
                        match.notes,
                        match.broke,
                        match.scoutName,
                        match.trench
                    );

                }

            }
        );

        importTransaction(importedMatches);

        res.json({
            success: true,
            count: importedMatches.length
        });

    } catch (error) {

        console.error(
            "Error importing matches:",
            error
        );

        res.status(500).json({
            success: false,
            error: "Failed to import matches."
        });

    }

});