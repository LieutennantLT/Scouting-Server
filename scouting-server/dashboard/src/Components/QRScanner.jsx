import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScanner.css";

export default function QRScanner({
    onClose,
    onDataImported
}) {

    const scannerRef = useRef(null);
    const scannerStartedRef = useRef(false);
    const processingRef = useRef(false);

    const [starting, setStarting] = useState(true);


    useEffect(() => {

        const scanner =
            new Html5Qrcode("qr-reader");

        scannerRef.current = scanner;


        async function startScanner() {

            try {

                const cameras =
                    await Html5Qrcode.getCameras();


                if (!cameras || cameras.length === 0) {

                    throw new Error(
                        "No camera was found on this computer."
                    );

                }


                console.log(
                    "Available cameras:",
                    cameras
                );


                // Use the first available camera
                const cameraId =
                    cameras[0].id;


                await scanner.start(

                    cameraId,

                    {
                        fps: 10,

                        qrbox: {
                            width: 300,
                            height: 300
                        },

                        aspectRatio: 1.0
                    },


                    async (decodedText) => {

                        if (
                            processingRef.current
                        ) {
                            return;
                        }


                        processingRef.current = true;


                        await handleQRCode(
                            decodedText
                        );

                    },


                    () => {
                        // QR code not detected yet.
                        // This callback happens constantly,
                        // so we don't do anything here.
                    }

                );


                // Only mark it as started AFTER
                // start() successfully completes.

                scannerStartedRef.current = true;

                setStarting(false);


            } catch (error) {

                console.error(
                    "Could not start camera:",
                    error
                );


                setStarting(false);


                alert(
                    `Could not access the camera.\n\n${error.message}`
                );


                onClose();

            }

        }


        startScanner();


        return () => {

            stopScanner();

        };


        async function stopScanner() {

            if (
                scannerRef.current &&
                scannerStartedRef.current
            ) {

                try {

                    await scannerRef.current.stop();

                    scannerStartedRef.current =
                        false;

                    console.log(
                        "QR scanner stopped."
                    );

                } catch (error) {

                    console.error(
                        "Error stopping QR scanner:",
                        error
                    );

                }

            }

        }


        async function handleQRCode(
            decodedText
        ) {

            try {

                console.log(
                    "QR data received:",
                    decodedText
                );


                /*
                ========================================
                Convert QR data back into matches
                ========================================
                */

                const importedMatches =
                    JSON.parse(decodedText);


                if (
                    !Array.isArray(
                        importedMatches
                    )
                ) {

                    throw new Error(
                        "QR code does not contain an array of matches."
                    );

                }


                if (
                    importedMatches.length === 0
                ) {

                    throw new Error(
                        "QR code contains no matches."
                    );

                }


                console.log(
                    "Matches received:",
                    importedMatches
                );


                /*
                ========================================
                Stop camera
                ========================================
                */

                if (
                    scannerRef.current &&
                    scannerStartedRef.current
                ) {

                    await scannerRef.current.stop();

                    scannerStartedRef.current =
                        false;

                }


                /*
                ========================================
                Send matches to server
                ========================================
                */

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


                /*
                ========================================
                Success
                ========================================
                */

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
                    `Invalid QR code.\n\n${error.message}`
                );


                processingRef.current =
                    false;

            }

        }

    }, [onClose, onDataImported]);


    return (

        <div className="qr-scanner-overlay">

            <div className="qr-scanner-modal">

                {/* Close button */}

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
                    Point the camera at the QR
                    code on the scouting device.
                </p>


                {/* Camera preview */}

                <div
                    id="qr-reader"
                    className="qr-reader"
                />


                {starting ? (

                    <p className="scanner-status">
                        Starting camera...
                    </p>

                ) : (

                    <p className="scanner-status">
                        Aim the QR code inside the box.
                    </p>

                )}

            </div>

        </div>

    );

}