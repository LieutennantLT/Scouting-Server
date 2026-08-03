import { useState } from "react";

export default function MatchTable({
matches
}) {

const [sortKey, setSortKey] =
    useState("matchID");

const [sortDirection, setSortDirection] =
    useState("desc");


function handleSort(key) {

    if (sortKey === key) {

        setSortDirection(
            previous =>
                previous === "asc"
                    ? "desc"
                    : "asc"
        );

    } else {

        setSortKey(key);

        setSortDirection("desc");

    }

}


const sortedMatches =
    [...matches].sort((a, b) => {

        let aValue =
            a[sortKey];

        let bValue =
            b[sortKey];


        /*
        Climb needs custom
        numerical sorting.
        */

        if (sortKey === "climb") {

            const climbValues = {

                "Did Not Attempt": 0,

                "Failed": 0,

                "L1": 1,

                "L2": 2,

                "L3": 3

            };

            aValue =
                climbValues[a.climb] || 0;

            bValue =
                climbValues[b.climb] || 0;

        }


        /*
        Convert numbers
        */

        if (
            sortKey !== "climb"
        ) {

            aValue =
                Number(aValue) || 0;

            bValue =
                Number(bValue) || 0;

        }


        if (
            aValue < bValue
        ) {

            return sortDirection === "asc"
                ? -1
                : 1;

        }


        if (
            aValue > bValue
        ) {

            return sortDirection === "asc"
                ? 1
                : -1;

        }


        return 0;

    });


function SortHeader({
    children,
    sortKeyName
}) {

    const isActive =
        sortKey === sortKeyName;


    return (

        <th>

            <button
                className="sort-button"
                onClick={() =>
                    handleSort(
                        sortKeyName
                    )
                }
            >

                {children}

                {isActive && (
                    sortDirection === "asc"
                        ? " ▲"
                        : " ▼"
                )}

            </button>

        </th>

    );

}


return (

    <div className="table-container">

        <table>

            <thead>

                <tr>

                    <SortHeader
                        sortKeyName="matchID"
                    >
                        Match
                    </SortHeader>

                    <SortHeader
                        sortKeyName="team"
                    >
                        Team
                    </SortHeader>

                    <th>
                        Alliance
                    </th>

                    <SortHeader
                        sortKeyName="autoPoints"
                    >
                        Auto
                    </SortHeader>

                    <SortHeader
                        sortKeyName="teleopPoints"
                    >
                        Teleop
                    </SortHeader>

                    <SortHeader
                        sortKeyName="teleopPassPoints"
                    >
                        Pass
                    </SortHeader>

                    <SortHeader
                        sortKeyName="climb"
                    >
                        Climb
                    </SortHeader>

                    <th>
                        Trench
                    </th>

                    <th>
                        Notes
                    </th>

                </tr>

            </thead>


            <tbody>

                {sortedMatches.map(
                    match => (

                        <tr
                            key={
                                match.databaseID
                            }
                        >

                            <td>
                                {match.matchID}
                            </td>

                            <td>
                                {match.team}
                            </td>

                            <td>
                                {match.alliance}
                            </td>

                            <td>
                                {match.autoPoints}
                            </td>

                            <td>
                                {match.teleopPoints}
                            </td>

                            <td>
                                {match.teleopPassPoints}
                            </td>

                            <td>
                                {match.climb}
                            </td>

                            <td>
                                {match.trench}
                            </td>

                            <td>
                                {match.notes}
                            </td>

                        </tr>

                    )
                )}

            </tbody>

        </table>

    </div>

);

}
