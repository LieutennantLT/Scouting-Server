import { useMemo, useState } from "react";

import useMatches from "../hooks/useMatches.js";
import TeamTable from "../Components/TeamTable.jsx";

export default function OverallTeamView() {

const {
    matches,
    loading,
    error
} = useMatches();


const [teamSearch, setTeamSearch] =
    useState("");


const teamStats = useMemo(() => {

    const teams = {};


    for (const match of matches) {

        const teamNumber =
            String(match.team);


        if (!teams[teamNumber]) {

            teams[teamNumber] = {

                team: teamNumber,

                matches: [],

                autoPoints: 0,

                teleopPoints: 0,

                teleopPassPoints: 0,

                climbScores: 0

            };

        }


        const team =
            teams[teamNumber];


        team.matches.push(
            Number(match.matchID) || 0
        );


        team.autoPoints +=
            Number(match.autoPoints) || 0;


        team.teleopPoints +=
            Number(match.teleopPoints) || 0;


        team.teleopPassPoints +=
            Number(match.teleopPassPoints) || 0;


        /*
        Convert climb to a numerical score.

        Higher number = better climb.
        */

        const climbScores = {

            "Did Not Attempt": 0,

            "Failed": 0,

            "L1": 1,

            "L2": 2,

            "L3": 3

        };


        team.climbScores +=
            climbScores[match.climb] || 0;

    }


    return Object.values(teams).map(team => {

        const count =
            team.matches.length;


        return {

            team: team.team,

            matchCount: count,

            latestMatch:
                Math.max(
                    ...team.matches
                ),

            autoPoints:
                team.autoPoints / count,

            teleopPoints:
                team.teleopPoints / count,

            teleopPassPoints:
                team.teleopPassPoints / count,

            climb:
                team.climbScores / count

        };

    });

}, [matches]);


const filteredTeams =
    teamStats.filter(team =>

        team.team
            .toLowerCase()
            .includes(
                teamSearch.toLowerCase()
            )

    );


if (loading) {

    return (

        <div className="page">

            <h1>
                Overall Team View
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
                Overall Team View
            </h1>

            <div className="error">
                Unable to load team data.
            </div>

        </div>

    );

}


return (

    <div className="page">

        <header className="page-header">

            <div>

                <h1>
                    Overall Team View
                </h1>

                <p className="match-count">

                    Showing{" "}
                    <strong>
                        {filteredTeams.length}
                    </strong>{" "}
                    teams

                </p>

            </div>

        </header>


        <div className="filters">

            <div className="filter-group">

                <label>
                    Search Team
                </label>

                <input
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


        <TeamTable
            teams={filteredTeams}
        />

    </div>

);

}
