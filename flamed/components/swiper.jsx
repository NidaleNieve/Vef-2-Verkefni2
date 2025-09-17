'use client';

import { useEffect, useMemo, useState, useRef, forwardRef, useImperativeHandle } from "react"; //bætti við useRef, forwardRef, useImperativeHandle til þess að geta notað takkana sem swipe
import { supabase } from "../lib/supabaseClient";
import Results from "./results";

//Next image renderer fyrir myndir
import Image from "next/image";

//framer motion fyrir swiping cards
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom"; //fyrir edge glow like/dislike

//finnur vindow width
const vw = window?.innerWidth || 1000;

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
                {/*Animate Presence leyfir exit animation að virka vel og hverfa*/}
                <AnimatePresence initial={false} mode="popLayout">
                    {visibleCards.map((restaurant, index) => {
                        const isTop = index === 0;
                        const stackIndex = index;
                        return (
                        <Card
                            key={restaurant.id}
                            restaurant={restaurant}
                            isTop={isTop}
                            stackIndex={stackIndex}
                            acceptedItem={acceptedItem}
                            rejectedItem={rejectedItem}
                        />
                        );
                    })}
                </AnimatePresence>
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

function Card({ restaurant, isTop, stackIndex, acceptedItem, rejectedItem }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const likeOpacity = useTransform(x, [0, 200, vw], [0, 1, 0]);
    const dislikeOpacity = useTransform(x, [-vw, -200, 0], [0, 1, 0]);
    //Exit breyta til þess að fá cardið til þess að fljúga út
    const [exitX, setExitX] = useState(null);

    //Þetta function lætur cardsin fljúga út úr skjánum þegar þau eru swiped
    const handleDragEnd = (_, info) => {
        //breytur sem halda uta um window width til þess að láta cards fljúga út responsively
        const target = vw + 200; //target aðeins lengra en window width þannig cardið hverfi alveg
        const duration = Math.min(0.5, 0.14 + vw / 8000); //dynamic animation duration eftir skjástærð

        if (info.offset.x > 120) {
            setExitX(target); //keyri exit
            animate(x, target, {
                type: 'tween',
                ease: 'easeOut',
                duration, //nota dynamic duration
            });
            requestAnimationFrame(acceptedItem);
        } else if (info.offset.x < -120) {
            setExitX(-target); //keyri exit
            animate(x, -target, {
                type: 'tween',
                ease: 'easeOut',
                duration,
            });
            requestAnimationFrame(rejectedItem);
        } else {
            animate(x, 0, {
                type: 'tween',
                ease: 'easeOut',
                duration: 0.20,
            });
            animate(y, 0, {
                type: 'tween',
                ease: 'easeOut',
                duration: 0.20,
            });
        }
    };


    //myndir með error handling, ef hero image er ekki til, þá nota ég square image
    const [imageSrc, setImageSrc] = useState(restaurant.hero_img_url || restaurant.square_img_url);
    const handleImageError = () => {
        setImageSrc(restaurant.square_img_url);
    };

    // Triggerinn fyrir cardið næst í röðinni
    const targetScale = 1 - stackIndex * 0.02;
    const targetY = stackIndex * 10;

    return (
        <motion.div
            //animations fyrir card næst í röðinni
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: isTop ? 100 : 10 - stackIndex,
            }}
            initial={false}
            animate={{ scale: targetScale, y: targetY }}
            exit={{ opacity: 0, transition: { delay: 0.16, duration: 0.02 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
            <motion.div
                //nota tailwind fyrir sum style til þess að stylea fyrir dark mode létllega
                className="bg-white dark:bg-black 
                            shadow-[0_4px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_5px_rgba(128,128,128,0.2)] 
                            border border-gray-300 dark:border-gray-700
                            [--drag-shadow:0_8px_25px_rgba(0,0,0,0.35)] 
                            dark:[--drag-shadow:0_8px_15px_rgba(128,128,128,0.25)]"
                    style={{
                    x,
                    y,
                    rotate,
                    width: '100%',
                    height: '100%',
                    borderRadius: '16px',
                    //backgroundColor: '#fff',
                    overflow: 'hidden',
                    //boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
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
                whileDrag={{
                    scale: 1.05,
                    boxShadow: "var(--drag-shadow)"
                }}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {restaurant.parent_city} • {restaurant.avg_rating ?? 'N/A'} ({restaurant.review_count ?? 0})
                    </p>
                </div>
        </motion.div>

        {isTop && createPortal(
            <>
            <motion.div
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: likeOpacity,
                    background: 'linear-gradient(to right, rgba(34,197,94,0) 75%, rgba(34,197,94,0.45) 100%)',
                    willChange: 'opacity',
                }}
            />
            <motion.div
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: dislikeOpacity,
                    background: 'linear-gradient(to left, rgba(239,68,68,0) 75%, rgba(239,68,68,0.45) 100%)',
                    willChange: 'opacity',
                }}
            />
            </>,
            document.body
        )}
        </motion.div>
    );
}