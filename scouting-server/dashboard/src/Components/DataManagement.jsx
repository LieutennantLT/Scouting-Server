import { useRef, useState } from "react";
import QRScanner from "./QRScanner.jsx";

export default function DataManagement({
    onDataChanged
}) {

    const fileInputRef = useRef(null);


    /*
    ========================================
    Export Data
    ========================================
    */

    async function exportData() {

        try {

            const response = await fetch(
                "http://localhost:3000/matches"
            );

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }

            const matches = await response.json();


            // Convert matches to formatted JSON

            const json = JSON.stringify(
                matches,
                null,
                4
            );


            // Create a downloadable file

            const blob = new Blob(
                [json],
                {
                    type: "application/json"
                }
            );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `scouting-data-${new Date()
                    .toISOString()
                    .split("T")[0]
                }.json`;


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);


            URL.revokeObjectURL(url);


        } catch (error) {

            console.error(
                "Error exporting data:",
                error
            );

            alert(
                "Failed to export scouting data."
            );

        }

    }


    /*
    ========================================
    Import Data
    ========================================
    */

    function openFilePicker() {

        fileInputRef.current?.click();

    }


    async function handleFileSelected(event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        try {

            const text =
                await file.text();


            const importedData =
                JSON.parse(text);


            if (!Array.isArray(importedData)) {

                alert(
                    "Invalid file. The JSON must contain an array of matches."
                );

                return;

            }


            const confirmed =
                window.confirm(
                    `This will replace all current data with ${importedData.length} imported matches. Continue?`
                );


            if (!confirmed) {
                return;
            }


            const response =
                await fetch(
                    "http://localhost:3000/matches/import",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                importedData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Import failed."
                );

            }


            alert(
                `Successfully imported ${result.count} matches.`
            );


            // Refresh dashboard data

            if (onDataChanged) {

                await onDataChanged();

            }


        } catch (error) {

            console.error(
                "Error importing data:",
                error
            );

            alert(
                "Failed to import data. Make sure the file contains valid scouting JSON."
            );

        }


        // Allow selecting the same file again

        event.target.value = "";

    }


    /*
    ========================================
    Clear Data
    ========================================
    */

    async function clearData() {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete ALL scouting data? This cannot be undone."
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    "http://localhost:3000/matches",
                    {
                        method: "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Failed to clear data."
                );

            }


            alert(
                "All scouting data has been deleted."
            );


            // Refresh dashboard data

            if (onDataChanged) {

                await onDataChanged();

            }


        } catch (error) {

            console.error(
                "Error clearing data:",
                error
            );

            alert(
                "Failed to clear scouting data."
            );

        }

    }

    /* QR Scanner State */

    const [showScanner, setShowScanner] = useState(false);

    /*
    ========================================
    Render
    ========================================
    */

    return (

        <div className="data-management">

            <h2>
                Data Management
            </h2>


            <p>
                Export your scouting data to a JSON file,
                import a previous scouting session,
                or clear all data from the server.
            </p>


            {/* Export */}

            <button
                onClick={exportData}
            >
                📥 Export Data
            </button>


            {/* Import */}

            <button
                onClick={openFilePicker}
            >
                📤 Import Data
            </button>


            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={
                    handleFileSelected
                }
                style={{
                    display: "none"
                }}
            />


            {/* Clear */}

            <button
                className="danger-button"
                onClick={clearData}
            >
                🗑️ Clear All Data
            </button>

            {/* QR Scanner */}

            <button
                onClick={() => setShowScanner(true)}
            >
                📷 Scan QR Code
            </button>

            {showScanner && (
                <QRScanner
                    onClose={() => setShowScanner(false)}
                    onDataImported={onDataChanged}
                />
            )}

        </div>

    );

}
