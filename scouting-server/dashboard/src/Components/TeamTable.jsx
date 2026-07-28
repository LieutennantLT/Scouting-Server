import { useState } from "react";

export default function TeamTable({
teams
}) {

const [sortKey, setSortKey] =
    useState("latestMatch");

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


const sortedTeams =
    [...teams].sort((a, b) => {

        const aValue =
            Number(a[sortKey]) || 0;

        const bValue =
            Number(b[sortKey]) || 0;


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
                        sortKeyName="team"
                    >
                        Team
                    </SortHeader>

                    <SortHeader
                        sortKeyName="latestMatch"
                    >
                        Latest Match
                    </SortHeader>

                    <th>
                        Matches
                    </th>

                    <SortHeader
                        sortKeyName="autoPoints"
                    >
                        Avg Auto
                    </SortHeader>

                    <SortHeader
                        sortKeyName="teleopPoints"
                    >
                        Avg Teleop
                    </SortHeader>

                    <SortHeader
                        sortKeyName="teleopPassPoints"
                    >
                        Avg Pass
                    </SortHeader>

                    <SortHeader
                        sortKeyName="climb"
                    >
                        Avg Climb
                    </SortHeader>

                </tr>

            </thead>


            <tbody>

                {sortedTeams.map(
                    team => (

                        <tr
                            key={team.team}
                        >

                            <td>
                                {team.team}
                            </td>

                            <td>
                                {team.latestMatch}
                            </td>

                            <td>
                                {team.matchCount}
                            </td>

                            <td>
                                {team.autoPoints.toFixed(1)}
                            </td>

                            <td>
                                {team.teleopPoints.toFixed(1)}
                            </td>

                            <td>
                                {team.teleopPassPoints.toFixed(1)}
                            </td>

                            <td>
                                {team.climb.toFixed(2)}
                            </td>

                        </tr>

                    )
                )}

            </tbody>

        </table>

    </div>

);

}
