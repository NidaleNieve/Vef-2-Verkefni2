'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function Home() {
  const [users, setUsers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [actions, setActions] = useState([])
  const [swipeTriggers, setSwipeTriggers] = useState([])

  // Fetch JSON from public folder
  useEffect(() => {
    fetch('/tempRestaurants.json')
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map((restaurant, index) => ({
          id: index + 1,
          name: restaurant.name,
          age: Math.round(restaurant.rating * 10),
          image: restaurant.menu[0]?.image || `https://picsum.photos/300/400?random=${index + 1}`
        }))
        setUsers(mappedData)
      })
      .catch(err => console.error('Failed to load restaurants:', err))
  }, [])

  const handleAction = (action) => {
    setActions(prev => [...prev, { userId: users[currentIndex].id, action }])
    setSwipeTriggers(prev => [...prev, []])
    setCurrentIndex(prev => prev + 1)
  }

  if (!users.length) return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-6">Restaurants</h1>
        <div>Loading...</div>
      </div>
    </main>
  )

  if (currentIndex >= users.length) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-bold mb-6">Restaurants</h1>
          <div className="text-center">
            <h2 className="text-2xl mb-4">No more cards!</h2>
            <p>Likes: {actions.filter(a => a.action === 'like').length}</p>
            <p>Dislikes: {actions.filter(a => a.action === 'dislike').length}</p>
            <p>Favorites: {actions.filter(a => a.action === 'favorite').length}</p>
            <button 
              onClick={() => { setCurrentIndex(0); setActions([]); setSwipeTriggers([]) }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </main>
    )
  }

  const visibleCards = users.slice(currentIndex, currentIndex + 3)

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-6">Restaurants</h1>
        
        <div className="flex flex-col items-center mt-12">
          <div className="relative w-72 h-96">
            {visibleCards.map((user, index) => {
              const isTop = index === 0
              const stackIndex = visibleCards.length - 1 - index
              return (
                <Card
                  key={user.id}
                  user={user}
                  isTop={isTop}
                  stackIndex={stackIndex}
                  onAction={handleAction}
                />
              )
            })}
          </div>

          <div className="flex gap-5 mt-6">
            <button 
              onClick={() => handleAction('dislike')} 
              className="text-2xl p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              ✖
            </button>
            <button 
              onClick={() => handleAction('favorite')} 
              className="text-2xl p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              ⭐
            </button>
            <button 
              onClick={() => handleAction('like')} 
              className="text-2xl p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              ♥
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function Card({ user, isTop, stackIndex, onAction }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const likeOpacity = useTransform(x, [0, 200], [0, 1])
  const dislikeOpacity = useTransform(x, [-200, 0], [1, 0])

  const handleDragEnd = (_, info) => {
    const threshold = 70
    if (info.offset.x > threshold) onAction('like')
    else if (info.offset.x < -threshold) onAction('dislike')
    else x.set(0)
  }

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
      drag={isTop ? 'x' : false}
      dragConstraints={false}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={{ cursor: isTop ? 'grabbing' : 'auto' }}
    >
      <img 
        src={user.image} 
        alt={user.name} 
        className="w-full h-72 object-cover" 
      />
      <div className="p-3">
        <h3 className="text-lg font-semibold">{user.name}, {user.age}</h3>
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
  )
}