import Database from "better-sqlite3";

const db = new Database("scouting.db");

// Create table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
        databaseID INTEGER PRIMARY KEY AUTOINCREMENT,

        matchID INTEGER,
        team TEXT,
        alliance TEXT,

        autoPoints INTEGER,
        teleopPoints INTEGER,
        teleopPassPoints INTEGER,

        climb TEXT,
        notes TEXT,
        broke TEXT,
        scoutName TEXT,
        trench TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS alliance_matches (

        databaseID INTEGER PRIMARY KEY AUTOINCREMENT,

        matchID INTEGER,

        team1 INTEGER,
        team1Notes TEXT,

        team2 INTEGER,
        team2Notes TEXT,

        team3 INTEGER,
        team3Notes TEXT

    )
`);


export default db;