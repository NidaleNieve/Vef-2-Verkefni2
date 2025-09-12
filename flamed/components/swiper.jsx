'use client';

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

//Main functioninið, sem renderar veitingastaðina
export default function Swiper() {
    //bý til breytur sem halda utan um veitingastaðina og hvað er valið
    const [restaurants, setRestaurants] = useState([]); // restaurants state
    const [loading, setLoading] = useState(true);//breyta til þess að geta byrt loading
    const [error, setError] = useState(null); //error state, segir sig sjálft

    const [current, setCurrent] = useState(0); //current staðurinn, geymir listann, byrjar á 0
    const [accepted, setAccepted] = useState([]); //array sem geymir veitingastaðin sem eru samþykktir
    const [rejected, setRejected] = useState([]);

    //function sem fetchar veitingastaðina frá supabase og byrtir loading screen
    useEffect(() => {
        const load = async () => {
            const { data, error } = await supabase
                .from('restaurants')
                .select('id,name,parent_city,avg_rating,cuisines,is_active,price_tag')
                .eq('is_active', true)
                .limit(10); //temp limit

            if (error) {
                setError(error.message);
                setRestaurants([]);
            } else {
                setRestaurants(data || []);
            }
            setLoading(false);
        };
        load();
    }, []);

    //error handling, ef enginn veitingastaður fundinn
    if (restaurants.length === 0) {
        return <div className="text-gray-600">No restaurants found.</div>;
    }

    //"results síðan" mjög basic, sýnir arrayana
    /*
    if (current >= restaurants.length) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-2">Done</h2>
                <p className="mb-1">Accepted: {accepted.join(", ")}</p>
                <p>Rejected: {rejected.join(", ")}</p>
            </div>
        );
    }
    */

    const t = restaurants[current];

    const acceptedItem = () => {
        setAccepted((prev) => [...prev, t.id]);
        setCurrent((prev) => prev + 1);
    };

    const rejectedItem = () => {
        setRejected((prev) => [...prev, t.id]);
        setCurrent((prev) => prev + 1);
    };

    const ignoreItem = () => {
        setCurrent((prev) => prev + 1);
    };

    //temp ui, þangað til að ég integrata við swiping cards
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-bold mb-2">{t.name}</h2>
            <p className="text-lg mb-1">
            {t.location.neighborhood}, Rating: {t.rating}
            </p>
            <p className="text-base text-gray-700 mb-4">Cuisine: {t.cuisine.join(", ")}</p>

            <div className="flex gap-3">
            <button
                onClick={acceptedItem}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                Accept
            </button>
            <button
                onClick={ignoreItem}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
                Skip
            </button>
            <button
                onClick={rejectedItem}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                Reject
            </button>
            </div>

            <div className="text-sm text-gray-500 mt-4">
            {current + 1} / {restaurants.length}
            </div>
        </div>
    );

    //ef að allir veitingastaðirnir eru búnir, þá sýnir results component
    if (current >= restaurants.length) {
        return (
        <Results
            restaurants={restaurants}
            acceptedIds={accepted}
            rejectedIds={rejected}
            onRestart={reset}
        />
        );
    }
}