'use client';

import { useState } from "react";

//Main functioninið, sem renderar veitingastaðina, tek inn veitingastaðina sem arguement
export default function Swiper({ initialRestaurants = [] }) {
    //bý til breytur sem halda utan um veitingastaðina og hvað er valið
    const restaurants = initialRestaurants; 
    const [current, setCurrent] = useState(0); //current staðurinn, geymir listann, byrjar á 0
    const [accepted, setAccepted] = useState([]); //array sem geymir veitingastaðin sem eru samþykktir
    const [rejected, setRejected] = useState([]);

    //error handling, ef enginn veitingastaður fundinn
    if (restaurants.length === 0) {
        return <div className="text-gray-600">No restaurants found.</div>;
    }

    //"results síðan" mjög basic, sýnir arrayana
    if (current >= restaurants.length) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-2">Done</h2>
                <p className="mb-1">Accepted: {accepted.join(", ")}</p>
                <p>Rejected: {rejected.join(", ")}</p>
            </div>
        );
    }

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
}