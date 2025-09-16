'use client';

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Results from "./results";

//Next image renderer fyrir myndir
import Image from "next/image";

//framer motion fyrir swiping cards
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

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
                .select(`
                    id,
                    name,
                    parent_city,
                    avg_rating,
                    cuisines,
                    price_tag,
                    review_count,
                    hero_img_url,
                    square_img_url    
                `)
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

    //sýnir loading
    if (loading) {
        return <div className="text-gray-600">Loading...</div>;
    }

    //error handling, ef enginn veitingastaður fundinn
    if (restaurants.length === 0) {
        return <div className="text-red-600">No restaurants found.</div>;
    }

    //sýnir generic error 
    if (error) {
        return <div className="text-red-600">Error: {error}</div>;
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

    //ef að allir veitingastaðirnir eru búnir, þá sýnir results component úr results skjalinu
    if (current >= restaurants.length) {
        return (
            <Results
                restaurants={restaurants}
                acceptedIds={accepted}
                rejectedIds={rejected}
            />
        );
    }

    const visibleCards = restaurants.slice(current, current + 3);


    return (
        <div className="min-h-[28rem] flex flex-col items-center justify-center">
            <div className="relative w-72 h-96">
                {visibleCards.map((restaurant, index) => {
                    const isTop = index === 0;
                    const stackIndex = index;
                    return (
                    <Card
                        key={restaurant.id}
                        restaurant={restaurant}
                        isTop={isTop}
                        stackIndex={stackIndex}
                        onLike={acceptedItem}
                        onDislike={rejectedItem}
                    />
                    );
                })}
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={rejectedItem}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
                    Reject
                </button>
                <button
                    onClick={ignoreItem}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded">
                    Skip
                </button>
                <button
                    onClick={acceptedItem}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                    Accept
                </button>
            </div>

            <div className="text-sm text-gray-500 mt-4">
                {current + 1} / {restaurants.length}
            </div>
        </div>
    );
}

function Card({ restaurant, isTop, stackIndex, onLike, onDislike }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const likeOpacity = useTransform(x, [0, 200], [0, 1]);
    const dislikeOpacity = useTransform(x, [-200, 0], [1, 0]);

    /*
    const handleDragEnd = (_, info) => {
    const threshold = 70;
        if (info.offset.x > threshold) onLike();
        else if (info.offset.x < -threshold) onDislike();
        else x.set(0);
    };
    */

    //Þetta function lætur cardsin fljúga út úr skjánnum þegar þau eru swiped
    const handleDragEnd = (_, info) => {
        const threshold = 200;
        if (info.offset.x > threshold) {
            animate(x, 1000, {
            type: 'tween',
            ease: 'easeOut',
            duration: 0.22,
            onComplete: onLike,
        });
        } else if (info.offset.x < -threshold) {
            animate(x, -1000, {
                type: 'tween',
                ease: 'easeOut',
                duration: 0.22,
                onComplete: onDislike,
            });
        } else {
            animate(x, 0, {
                type: 'tween',
                ease: 'easeOut',
                duration: 0.15,
            });
        }
    };


    //myndir með error handling, ef hero image er ekki til, þá nota ég square image
    const [imageSrc, setImageSrc] = useState(restaurant.hero_img_url || restaurant.square_img_url);

    const handleImageError = () => {
        setImageSrc(restaurant.square_img_url);
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                width: '100%',
                height: '100%',
                borderRadius: '16px',
                backgroundColor: '#fff',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                position: 'absolute',
                cursor: isTop ? 'grab' : 'auto',
                scale: 1 - stackIndex * 0.02,
                translateY: stackIndex * 10,
                zIndex: isTop ? 100 : 10 - stackIndex,
            }}
            drag={isTop ? true : false}
            dragConstraints={false}
            dragElastic={0.2}
            dragMomentum={false}
            onDragEnd={isTop ? handleDragEnd : undefined}
            whileTap={{ cursor: isTop ? 'grabbing' : 'auto' }}
        >
        <Image
            src={imageSrc}
            alt={restaurant.name}
            width={300}
            height={400}
            className="w-full h-72 object-cover"
            draggable={false}
            onError={handleImageError}
        />
        <div className="p-3">
            <h3 className="text-lg font-semibold">
                {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600">
                {restaurant.parent_city} • {restaurant.avg_rating ?? 'N/A'} ({restaurant.review_count ?? 0})
            </p>
        </div>

        {isTop && (
            <>
            <motion.div
                className="absolute top-5 right-5 text-green-600 font-bold"
                style={{ opacity: likeOpacity }}
            >
            LIKE
            </motion.div>
            <motion.div
                className="absolute top-5 left-5 text-red-600 font-bold"
                style={{ opacity: dislikeOpacity }}
            >
            DISLIKE
            </motion.div>
            </>
        )}
        </motion.div>
    );
}