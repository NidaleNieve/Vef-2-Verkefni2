'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function SwipeStack() {
  const [users, setUsers] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [actions, setActions] = useState([])
  const [swipeTriggers, setSwipeTriggers] = useState([]) // 🔹 new empty array

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

    // 🔹 trigger empty array entry when swiped
    setSwipeTriggers(prev => [...prev, []])

    setCurrentIndex(prev => prev + 1)
  }

  if (!users.length) return <div>Loading...</div>

  if (currentIndex >= users.length) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>No more cards!</h2>
        <p>Likes: {actions.filter(a => a.action === 'like').length}</p>
        <p>Dislikes: {actions.filter(a => a.action === 'dislike').length}</p>
        <p>Favorites: {actions.filter(a => a.action === 'favorite').length}</p>
        <button onClick={() => { setCurrentIndex(0); setActions([]); setSwipeTriggers([]) }}>
          Reset
        </button>
      </div>
    )
  }

  const visibleCards = users.slice(currentIndex, currentIndex + 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <div style={{ position: 'relative', width: '300px', height: '400px' }}>
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

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <button onClick={() => handleAction('dislike')} style={{ fontSize: '24px' }}>✖</button>
        <button onClick={() => handleAction('favorite')} style={{ fontSize: '24px' }}>⭐</button>
        <button onClick={() => handleAction('like')} style={{ fontSize: '24px' }}>♥</button>
      </div>
    </div>
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
      <img src={user.image} alt={user.name} style={{ width: '100%', height: '70%', objectFit: 'cover' }} />
      <div style={{ padding: '10px' }}>
        <h3>{user.name}, {user.age}</h3>
      </div>

      {isTop && (
        <>
          <motion.div style={{ position: 'absolute', top: 20, right: 20, color: 'green', fontWeight: 'bold', opacity: likeOpacity }}>LIKE</motion.div>
          <motion.div style={{ position: 'absolute', top: 20, left: 20, color: 'red', fontWeight: 'bold', opacity: dislikeOpacity }}>DISLIKE</motion.div>
        </>
      )}
    </motion.div>
  )
}
