import { useEffect, useState } from "react";


export default function useMatches() {

    const [matches, setMatches] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    async function loadMatches() {

        try {

            const response =
                await fetch(
                    "http://localhost:3000/matches"
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            setMatches(data);

        } catch (error) {

            console.error(
                "Error loading matches:",
                error
            );

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        loadMatches();


        const interval =
            setInterval(
                loadMatches,
                5000
            );


        return () =>
            clearInterval(interval);

    }, []);


    return {

        matches,

        loading,

        loadMatches

    };

}