'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';
import restaurants from '../tempRestaurants.json';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [runnerUps, setRunnerUps] = useState([]);

  const handleSwipe = (dir) => {
    const restaurant = restaurants[index];
    if (dir === 'right') {
      setLiked([...liked, { ...restaurant, match: 100 }]);
    } else if (dir === 'left') {
      const match = Math.floor(Math.random() * 40) + 60; // 60-99
      setRunnerUps([...runnerUps, { ...restaurant, match }]);
    }
    setIndex(index + 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (index >= restaurants.length) {
    return <Results liked={liked} runners={runnerUps} />;
  }

  const restaurant = restaurants[index];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <div
        {...handlers}
        className="w-80 h-[420px] bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          width={320}
          height={256}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{restaurant.name}</h2>
          <p className="text-sm text-gray-500">Swipe right to like, left to skip.</p>
        </div>
      </div>
    </div>
  );
}

function Results({ liked, runners }) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results</h1>
      {liked.length === 0 ? (
        <p className="mb-8">No matches selected.</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {liked.map((r) => (
            <li key={r.id} className="border p-4 rounded">
              <div className="font-semibold">{r.name}</div>
              <div className="text-sm text-gray-600">{r.match}% match</div>
            </li>
          ))}
        </ul>
      )}
      {runners.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-3">Runner Ups</h2>
          <ul className="space-y-3">
            {runners.map((r) => (
              <li key={r.id} className="border p-4 rounded">
                <div className="font-semibold">{r.name}</div>
                <div className="text-sm text-gray-600">{r.match}% match</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
