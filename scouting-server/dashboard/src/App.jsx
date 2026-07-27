import { useEffect, useState } from "react";
import "./App.css";
import MatchTable from "./Components/MatchTable.jsx";

function App() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [allianceFilter, setAllianceFilter] =
        useState("all");

    const [teamSearch, setTeamSearch] =
        useState("");


    async function loadMatches() {

        try {

            const response = await fetch(
                "http://localhost:3000/matches"
            );

            if (!response.ok) {
                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            setMatches(data);

        } catch (error) {

            console.error(
                "Error loading matches:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    /*
    ========================================
    Load Matches
    ========================================
    */

    useEffect(() => {

        loadMatches();

        const interval = setInterval(
            loadMatches,
            5000
        );

        return () =>
            clearInterval(interval);

    }, []);


    /*
    ========================================
    Filter Matches
    ========================================
    */

    const filteredMatches = matches.filter(
        match => {

            /*
            Alliance filter
            */

            if (
                allianceFilter !== "all" &&
                match.alliance?.toLowerCase() !==
                    allianceFilter
            ) {
                return false;
            }


            /*
            Team search
            */

            if (
                teamSearch &&
                !String(match.team)
                    .toLowerCase()
                    .includes(
                        teamSearch.toLowerCase()
                    )
            ) {
                return false;
            }


            return true;

        }
    );


    /*
    ========================================
    Loading Screen
    ========================================
    */

    if (loading) {

        return (

            <div className="dashboard">

                <h1>
                    FRC Scouting Dashboard
                </h1>

                <div className="loading">
                    Loading matches...
                </div>

            </div>

        );

    }


    /*
    ========================================
    Dashboard
    ========================================
    */

    return (

        <div className="dashboard">

            <header className="dashboard-header">

                <div>

                    <h1>
                        FRC Scouting Dashboard
                    </h1>

                    <p className="match-count">

                        Showing{" "}
                        <strong>
                            {filteredMatches.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {matches.length}
                        </strong>{" "}
                        matches

                    </p>

                </div>

            </header>


            {/* Filters */}

            <div className="filters">

                {/* Team Search */}

                <div className="filter-group">

                    <label htmlFor="team-search">
                        Search Team
                    </label>

                    <input
                        id="team-search"
                        type="text"
                        placeholder="Team number..."
                        value={teamSearch}
                        onChange={(e) =>
                            setTeamSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* Alliance Filter */}

                <div className="filter-group">

                    <label htmlFor="alliance-filter">
                        Alliance
                    </label>

                    <select
                        id="alliance-filter"
                        value={allianceFilter}
                        onChange={(e) =>
                            setAllianceFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Alliances
                        </option>

                        <option value="red">
                            Red
                        </option>

                        <option value="blue">
                            Blue
                        </option>

                    </select>

                </div>


                {/* Reset Filters */}

                <button
                    className="reset-filters"
                    onClick={() => {

                        setAllianceFilter("all");

                        setTeamSearch("");

                    }}
                >
                    Reset Filters
                </button>

            </div>


            {/* Match Table */}

            <MatchTable
                matches={filteredMatches}
            />

        </div>

    );

}

export default App;