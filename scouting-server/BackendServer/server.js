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
        db.prepare("DELETE FROM matches").run();

        // Reset the auto increment id for the matches table
        db.prepare("DELETE FROM sqlite_sequence WHERE name = 'matches'").run();

        res.json({success: true, message: "All matches deleted."});

    } catch (error) {

        console.error("Error deleting matches:", error);

        res.status(500).json({success: false, error: "Failed to delete matches."});

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
            INSERT OR REPLACE INTO matches (
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

/* Alliance scouting */


// Save alliance scouting

app.post("/alliance", (req, res) => {

    try {

        const alliance = req.body;
        const insert = db.prepare(`

            INSERT INTO alliance_matches (
                matchID,

                team1,
                team1Notes,

                team2,
                team2Notes,

                team3,
                team3Notes
            )

            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);


        const result = insert.run(

            alliance.matchID,

            alliance.teams[0].team,
            alliance.teams[0].notes,

            alliance.teams[1].team,
            alliance.teams[1].notes,

            alliance.teams[2].team,
            alliance.teams[2].notes

        );

        res.json({success: true, message: "Alliance scouting saved!", databaseID: result.lastInsertRowid});

    } catch (error) {
        console.error("Error saving alliance scouting:", error);
        res.status(500).json({success: false, error: "Failed to save alliance scouting."});

    }
});


// Get all alliance scouting

app.get("/alliances", (req, res) => {

    try {

        const alliances = db
            .prepare(`
                SELECT *
                FROM alliance_matches
                ORDER BY matchID DESC
            `)
            .all();


        res.json(alliances);


    } catch (error) {

        console.error(
            "Error loading alliance scouting:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Failed to load alliance scouting."

        });

    }

});

app.post("/alliances/import", (req, res) => {

    try {

        const importedAlliances =
            req.body;


        if (
            !Array.isArray(
                importedAlliances
            )
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Expected an array of alliance matches."

            });

        }


        const insert = db.prepare(`

            INSERT INTO alliance_matches (

                matchID,

                team1,
                team1Notes,

                team2,
                team2Notes,

                team3,
                team3Notes

            )

            VALUES (?, ?, ?, ?, ?, ?, ?)

        `);


        const importTransaction =
            db.transaction(
                (alliances) => {

                    for (
                        const alliance
                        of alliances
                    ) {

                        insert.run(

                            alliance.matchID,

                            alliance.teams[0].team,
                            alliance.teams[0].notes,

                            alliance.teams[1].team,
                            alliance.teams[1].notes,

                            alliance.teams[2].team,
                            alliance.teams[2].notes

                        );

                    }

                }
            );


        importTransaction(
            importedAlliances
        );


        res.json({

            success: true,

            count:
                importedAlliances.length

        });


    } catch (error) {

        console.error(
            "Error importing alliance matches:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Failed to import alliance matches."

        });

    }

});


// Delete all alliance scouting

app.delete("/alliances", (req, res) => {

    try {

        db.prepare(
            "DELETE FROM alliance_matches"
        ).run();


        db.prepare(`
            DELETE FROM sqlite_sequence
            WHERE name = 'alliance_matches'
        `).run();


        res.json({

            success: true,

            message:
                "All alliance scouting deleted."

        });


    } catch (error) {

        console.error(
            "Error deleting alliance scouting:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Failed to delete alliance scouting."

        });

    }

});
