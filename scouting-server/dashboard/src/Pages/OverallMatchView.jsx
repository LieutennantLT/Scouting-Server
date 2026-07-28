import { useState } from "react";

import useMatches from "../Hooks/useMatches.js";
import MatchTable from "../Components/MatchTable.jsx";

export default function OverallMatchView() {

const {
    matches,
    loading,
    error
} = useMatches();


const [teamSearch, setTeamSearch] =
    useState("");


const filteredMatches =
    matches.filter(match => {

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

    });


if (loading) {

    return (

        <div className="page">

            <h1>
                Overall Match View
            </h1>

            <div className="loading">
                Loading matches...
            </div>

        </div>

    );

}


if (error) {

    return (

        <div className="page">

            <h1>
                Overall Match View
            </h1>

            <div className="error">

                Unable to load matches.

                <br />

                Make sure the scouting server
                is running.

            </div>

        </div>

    );

}


return (

    <div className="page">

        <header className="page-header">

            <div>

                <h1>
                    Overall Match View
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


        <div className="filters">

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


            <button
                className="reset-filters"
                onClick={() =>
                    setTeamSearch("")
                }
            >
                Reset Search
            </button>

        </div>


        <MatchTable
            matches={filteredMatches}
        />

    </div>

);

}
