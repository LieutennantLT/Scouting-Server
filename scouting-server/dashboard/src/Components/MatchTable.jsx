import { useState } from "react";


// Higher number = better climb

const climbRank = {

    "L3": 3,

    "L2": 2,

    "L1": 1,

    "Failed": 0,

    "Did Not Attempt": 0,

    "None": 0

};


export default function MatchTable({
    matches
}) {

    const [sortColumn, setSortColumn] =
        useState("matchID");

    const [sortDescending, setSortDescending] =
        useState(true);


    /*
    ========================================
    Handle Sorting
    ========================================
    */

    function handleSort(column) {

        if (sortColumn === column) {

            // Same column:
            // reverse sorting direction

            setSortDescending(
                previous =>
                    !previous
            );

        } else {

            // New column:
            // default to descending

            setSortColumn(column);

            setSortDescending(true);

        }

    }


    /*
    ========================================
    Sort Matches
    ========================================
    */

    const sortedMatches =
        [...matches].sort(
            (a, b) => {

                let valueA;

                let valueB;


                switch (sortColumn) {


                    /*
                    Match Number
                    */

                    case "matchID":

                        valueA =
                            Number(
                                a.matchID
                            ) || 0;

                        valueB =
                            Number(
                                b.matchID
                            ) || 0;

                        break;


                    /*
                    Team Number
                    */

                    case "team":

                        valueA =
                            Number(
                                a.team
                            ) || 0;

                        valueB =
                            Number(
                                b.team
                            ) || 0;

                        break;


                    /*
                    Auto
                    */

                    case "autoPoints":

                        valueA =
                            Number(
                                a.autoPoints
                            ) || 0;

                        valueB =
                            Number(
                                b.autoPoints
                            ) || 0;

                        break;


                    /*
                    Teleop
                    */

                    case "teleopPoints":

                        valueA =
                            Number(
                                a.teleopPoints
                            ) || 0;

                        valueB =
                            Number(
                                b.teleopPoints
                            ) || 0;

                        break;


                    /*
                    Passing
                    */

                    case "teleopPassPoints":

                        valueA =
                            Number(
                                a.teleopPassPoints
                            ) || 0;

                        valueB =
                            Number(
                                b.teleopPassPoints
                            ) || 0;

                        break;


                    /*
                    Climb
                    */

                    case "climb":

                        valueA =
                            climbRank[
                                a.climb
                            ] ?? 0;

                        valueB =
                            climbRank[
                                b.climb
                            ] ?? 0;

                        break;


                    default:

                        return 0;

                }


                if (
                    valueA < valueB
                ) {

                    return sortDescending
                        ? 1
                        : -1;

                }


                if (
                    valueA > valueB
                ) {

                    return sortDescending
                        ? -1
                        : 1;

                }


                return 0;

            }
        );


    /*
    ========================================
    Sort Button
    ========================================
    */

    function SortButton({
        column,
        children
    }) {

        const isActive =
            sortColumn === column;


        return (

            <button
                className={
                    `sort-button ${
                        isActive
                            ? "active"
                            : ""
                    }`
                }
                onClick={() =>
                    handleSort(column)
                }
            >

                {children}

                {isActive && (

                    <span className="sort-arrow">

                        {sortDescending
                            ? " ↓"
                            : " ↑"
                        }

                    </span>

                )}

            </button>

        );

    }


    /*
    ========================================
    Render
    ========================================
    */

    return (

        <div className="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            <SortButton
                                column="matchID"
                            >
                                Match
                            </SortButton>
                        </th>


                        <th>
                            <SortButton
                                column="team"
                            >
                                Team
                            </SortButton>
                        </th>


                        <th>
                            Alliance
                        </th>


                        <th>
                            <SortButton
                                column="autoPoints"
                            >
                                Auto
                            </SortButton>
                        </th>


                        <th>
                            <SortButton
                                column="teleopPoints"
                            >
                                Teleop
                            </SortButton>
                        </th>


                        <th>
                            <SortButton
                                column="teleopPassPoints"
                            >
                                Pass
                            </SortButton>
                        </th>


                        <th>
                            <SortButton
                                column="climb"
                            >
                                Climb
                            </SortButton>
                        </th>


                        <th>
                            Notes
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {sortedMatches.length === 0 ? (

                        <tr>

                            <td
                                colSpan="8"
                                className="no-matches"
                            >
                                No matches found.
                            </td>

                        </tr>

                    ) : (

                        sortedMatches.map(
                            match => (

                                <tr
                                    key={
                                        match.databaseID
                                    }
                                >

                                    <td>
                                        {
                                            match.matchID
                                        }
                                    </td>


                                    <td>
                                        {
                                            match.team
                                        }
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                `alliance-badge ${
                                                    match.alliance
                                                }`
                                            }
                                        >
                                            {
                                                match.alliance
                                            }
                                        </span>

                                    </td>


                                    <td>
                                        {
                                            match.autoPoints
                                        }
                                    </td>


                                    <td>
                                        {
                                            match.teleopPoints
                                        }
                                    </td>


                                    <td>
                                        {
                                            match.teleopPassPoints
                                        }
                                    </td>


                                    <td>
                                        {
                                            match.climb
                                        }
                                    </td>


                                    <td className="notes-cell">

                                        {
                                            match.notes ||
                                            "—"
                                        }

                                    </td>

                                </tr>

                            )
                        )

                    )}

                </tbody>

            </table>

        </div>

    );

}