// Greeting.jsx - A simple, standalone greeting component
import { useState, useEffect } from 'react';

const Greeting = ({ showTime = true, className = '' }) => {
  const [greeting, setGreeting] = useState({
    text: '',
    emoji: '',
    time: ''
  });

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hour = now.getHours();
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      let text = '';
      let emoji = '';

      if (hour >= 5 && hour < 12) {
        text = 'Good Morning';
        emoji = '☀️';
      } else if (hour >= 12 && hour < 17) {
        text = 'Good Afternoon';
        emoji = '🌤️';
      } else if (hour >= 17 && hour < 21) {
        text = 'Good Evening';
        emoji = '🌙';
      } else {
        text = 'Good Evening';
        emoji = '🌌';
      }

      setGreeting({
        text,
        emoji,
        time: timeString
      });
    };

    updateGreeting(); // Set initial greeting
    
    // Update every minute to keep time current
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!greeting.text) return null;

  return (
    <div className={`flex flex-col cursor-default ${className}`}>
      <div className="flex items-center gap-2 w-full">
        <span className="text-lg">{greeting.emoji}</span>
        <h2 className="text-3xl font-semibold text-gray-500">
          {greeting.text}
        </h2>
      </div>
      {showTime && (
        <p className="text-sm text-gray-600 mt-1">
          {greeting.time}
        </p>
      )}
    </div>
  );
};

export default Greeting;