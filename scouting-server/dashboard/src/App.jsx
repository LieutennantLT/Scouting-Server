import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);


    async function loadMatches() {

        try {

            const response = await fetch("http://localhost:3000/matches");

            const data = await response.json();

            setMatches(data);

        } catch (error) {

            console.error(
                "Error loading matches:",
                error
            );

        }

        setLoading(false);
    }


    useEffect(() => {

        loadMatches();

        const interval = setInterval(
            loadMatches,
            5000
        );

        return () => clearInterval(interval);

    }, []);


    if (loading) {
        return <h1>Loading...</h1>;
    }


    return (
        <div className="dashboard">

            <h1>FRC Scouting Dashboard</h1>

            <table>

                <thead>

                    <tr>
                        <th>Match</th>
                        <th>Team</th>
                        <th>Alliance</th>
                        <th>Auto</th>
                        <th>Teleop</th>
                        <th>Pass</th>
                        <th>Climb</th>
                        <th>Notes</th>
                    </tr>

                </thead>


                <tbody>

                    {matches.map((match) => (

                        <tr key={match.id}>

                            <td>{match.id}</td>

                            <td>{match.team}</td>

                            <td>{match.alliance}</td>

                            <td>{match.autoPoints}</td>

                            <td>{match.teleopPoints}</td>

                            <td>{match.teleopPassPoints}</td>

                            <td>{match.climb}</td>

                            <td>{match.notes}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default App;