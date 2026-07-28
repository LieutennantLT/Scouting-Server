import { useState } from "react";

import "./App.css";

import useMatches from "./Hooks/useMatches.js";

import BottomNav from "./Components/BottomNav.jsx";

import OverallMatchView from "./Pages/OverallMatchView.jsx";
import OverallTeamView from "./Pages/OverallTeamView.jsx";
import TeamLookup from "./Pages/TeamLookup.jsx";
import Graphs from "./Pages/Graphs.jsx";
import Simulator from "./Pages/Simulator.jsx";
import DataManagement from "./Components/DataManagement.jsx";


function App() {

    const [activeTab, setActiveTab] =
        useState("matches");

    const {
        matches,
        loading,
        loadMatches
    } = useMatches();


    /*
    ========================================
    Loading
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
    Current Page
    ========================================
    */

    function renderCurrentPage() {

        switch (activeTab) {

            case "matches":

                return (
                    <OverallMatchView
                        matches={matches}
                    />
                );


            case "teams":

                return (
                    <OverallTeamView
                        matches={matches}
                    />
                );


            case "lookup":

                return (
                    <TeamLookup
                        matches={matches}
                    />
                );


            case "graphs":

                return (
                    <Graphs
                        matches={matches}
                    />
                );


            case "simulator":

                return (
                    <Simulator
                        matches={matches}
                    />
                );


            case "data":

                return (
                    <DataManagement
                        onDataChanged={loadMatches}
                    />
                );


            default:

                return (
                    <OverallMatchView
                        matches={matches}
                    />
                );

        }

    }


    /*
    ========================================
    Render
    ========================================
    */

    return (

        <div className="dashboard">

            {/* Current Page */}

            <main className="dashboard-content">

                {renderCurrentPage()}

            </main>


            {/* Fixed Bottom Navigation */}

            <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

        </div>

    );

}


export default App;