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


    /*
    ========================================
    Stop Scanner
    ========================================
    */

    async function stopScanner() {

        const scanner =
            scannerRef.current;


        if (!scanner) {
            return;
        }


        if (!scannerStartedRef.current) {
            return;
        }


        try {

            await scanner.stop();

            scanner.clear();

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


    /*
    ========================================
    Close Scanner
    ========================================
    */

    async function handleClose() {

        /*
        Stop the camera first
        */

        await stopScanner();


        /*
        Then close the component
        */

        onClose();

    }


    /*
    ========================================
    QR Code Handler
    ========================================
    */

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
            Decode payload
            ========================================
            */

            const qrPayload =
                JSON.parse(decodedText);


            if (
                qrPayload.type !==
                "scouting-data"
            ) {

                throw new Error(
                    "This QR code is not a scouting data QR code."
                );

            }


            if (
                !Array.isArray(
                    qrPayload.records
                )
            ) {

                throw new Error(
                    "QR code does not contain valid scouting records."
                );

            }


            if (
                qrPayload.records.length === 0
            ) {

                throw new Error(
                    "QR code contains no scouting data."
                );

            }


            /*
            ========================================
            Separate record types
            ========================================
            */

            const individualMatches =
                qrPayload.records
                    .filter(
                        record =>
                            record.type ===
                            "individual"
                    )
                    .map(
                        record =>
                            record.data
                    );


            const allianceMatches =
                qrPayload.records
                    .filter(
                        record =>
                            record.type ===
                            "alliance"
                    )
                    .map(
                        record =>
                            record.data
                    );


            console.log(
                "Individual matches:",
                individualMatches
            );


            console.log(
                "Alliance matches:",
                allianceMatches
            );


            /*
            ========================================
            Stop camera
            ========================================
            */

            await stopScanner();


            /*
            ========================================
            Import individual matches
            ========================================
            */

            let individualCount = 0;
            let allianceCount = 0;


            if (
                individualMatches.length > 0
            ) {

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
                                    individualMatches
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Failed to import individual matches."
                    );

                }


                individualCount =
                    result.count;

            }


            /*
            ========================================
            Import alliance matches
            ========================================
            */

            if (
                allianceMatches.length > 0
            ) {

                const response =
                    await fetch(
                        "http://localhost:3000/alliances/import",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    allianceMatches
                                )
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Failed to import alliance matches."
                    );

                }


                allianceCount =
                    result.count;

            }


            /*
            ========================================
            Success
            ========================================
            */

            alert(
                `Successfully imported:\n\n` +
                `${individualCount} individual match(es)\n` +
                `${allianceCount} alliance match(es)`
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


    /*
    ========================================
    Start Scanner
    ========================================
    */

    useEffect(() => {

        let cancelled = false;


        async function startScanner() {

            try {

                /*
                ========================================
                Make sure element exists
                ========================================
                */

                const readerElement =
                    document.getElementById(
                        "qr-reader"
                    );


                if (!readerElement) {

                    throw new Error(
                        "QR reader element was not found."
                    );

                }


                /*
                ========================================
                Create scanner
                ========================================
                */

                const scanner =
                    new Html5Qrcode(
                        "qr-reader"
                    );


                scannerRef.current =
                    scanner;


                /*
                ========================================
                Find cameras
                ========================================
                */

                const cameras =
                    await Html5Qrcode.getCameras();


                if (
                    !cameras ||
                    cameras.length === 0
                ) {

                    throw new Error(
                        "No camera was found on this computer."
                    );

                }


                console.log(
                    "Available cameras:",
                    cameras
                );


                const cameraId =
                    cameras[0].id;


                /*
                ========================================
                Start camera
                ========================================
                */

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


                        processingRef.current =
                            true;


                        await handleQRCode(
                            decodedText
                        );

                    },


                    () => {
                        // QR code not detected yet.
                    }

                );


                /*
                ========================================
                Component may have closed
                ========================================
                */

                if (cancelled) {

                    try {

                        await scanner.stop();

                    } catch {

                        // Scanner wasn't fully started.

                    }

                    return;

                }


                scannerStartedRef.current =
                    true;


                setStarting(false);


                console.log(
                    "QR scanner started."
                );


            } catch (error) {

                console.error(
                    "Could not start camera:",
                    error
                );


                setStarting(false);


                if (!cancelled) {

                    alert(
                        `Could not access the camera.\n\n${error.message}`
                    );

                    onClose();

                }

            }

        }


        startScanner();


        /*
        ========================================
        Cleanup when component closes
        ========================================
        */

        return () => {

            cancelled = true;

            stopScanner();

        };


    }, [onClose, onDataImported]);


    /*
    ========================================
    Render
    ========================================
    */

    return (

        <div className="qr-scanner-overlay">

            <div className="qr-scanner-modal">


                {/* Close button */}

                <button
                    className="qr-scanner-close"
                    onClick={handleClose}
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