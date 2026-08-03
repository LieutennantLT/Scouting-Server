import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

export default function QRScanner({ onClose, onDataImported }) {

    const scannerRef = useRef(null);
    const processingRef = useRef(false);


    useEffect(() => {

        const scanner = new Html5Qrcode("qr-reader");

        scannerRef.current = scanner;


        async function startScanner() {

            try {

                await scanner.start(
                    { facingMode: "environment" },

                    {
                        fps: 10,
                        qrbox: {
                            width: 300,
                            height: 300
                        }
                    },

                    async (decodedText) => {

                        // Prevent the scanner from processing
                        // the same QR code multiple times.
                        if (processingRef.current) {
                            return;
                        }

                        processingRef.current = true;

                        await handleQRCode(decodedText);

                    },

                    () => {
                        // QR code not detected.
                        // This happens constantly while scanning,
                        // so we intentionally do nothing here.
                    }
                );

            } catch (error) {

                console.error(
                    "Could not start camera:",
                    error
                );

                alert(
                    "Could not access the camera. Make sure camera permissions are allowed."
                );

                onClose();

            }

        }


        startScanner();


        return () => {

            if (scannerRef.current) {

                scannerRef.current
                    .stop()
                    .catch(() => {});

            }

        };

    }, []);


    async function handleQRCode(decodedText) {

        try {

            console.log(
                "QR data received:",
                decodedText
            );


            // Convert QR string back into JavaScript data
            const importedMatches =
                JSON.parse(decodedText);


            // Make sure it is an array
            if (!Array.isArray(importedMatches)) {

                throw new Error(
                    "QR code does not contain a match array."
                );

            }


            if (importedMatches.length === 0) {

                throw new Error(
                    "QR code contains no matches."
                );

            }


            console.log(
                "Matches received:",
                importedMatches
            );


            // Stop camera before importing
            if (scannerRef.current) {

                await scannerRef.current
                    .stop()
                    .catch(() => {});

            }


            // Send matches to server
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
                                importedMatches
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Server failed to import matches."
                );

            }


            alert(
                `Successfully imported ${result.count} matches.`
            );


            if (onDataImported) {
                onDataImported();
            }


            onClose();

        } catch (error) {

            console.error(
                "Error processing QR code:",
                error
            );

            alert(
                `Invalid QR code:\n${error.message}`
            );

            processingRef.current = false;

        }

    }


    return (

        <div className="qr-scanner-overlay">

            <div className="qr-scanner-modal">

                <button
                    className="qr-scanner-close"
                    onClick={onClose}
                >
                    ×
                </button>


                <h2>
                    Scan Matches
                </h2>


                <p>
                    Point the camera at the QR code
                    displayed on the scouting device.
                </p>


                <div
                    id="qr-reader"
                    className="qr-reader"
                />


                <p className="scanner-status">
                    Waiting for QR code...
                </p>

            </div>

        </div>

    );

}