import { useEffect, useState } from "react";

const RainEffect = () => {
  const [raindrops, setRaindrops] = useState<
    {
      id: number;
      style: React.CSSProperties;
    }[]
  >([]);
  const maxAnimationDelay = 5; // Maximum duration of animation in seconds

  useEffect(() => {
    const drops = [];
    for (let i = 0; i < 100; i++) {
      // Adjust the number of drops here
      drops.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 2 + 1}s`,
          opacity: Math.random(),
          animationDelay: `${Math.random() * maxAnimationDelay}s`, // Optional: for staggered start
        },
      });
    }
    setRaindrops(drops);
  }, []);

  return (
    <div className="relative w-full h-full opacity-50">
      {raindrops.map((drop) => (
        <div key={drop.id} className="raindrop" style={drop.style}></div>
      ))}
    </div>
  );
};

export default RainEffect;
