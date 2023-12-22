import { SnowflakeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const SnowEffect = () => {
  const [snowflakes, setSnowflakes] = useState<
    {
      id: number;
      style: React.CSSProperties;
    }[]
  >([]);
  const maxAnimationDelay = 5; // Maximum duration of animation in seconds

  useEffect(() => {
    const flakes = [];
    for (let i = 0; i < 100; i++) {
      // Adjust the number of flakes here
      flakes.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 2}s`, // Slower fall for snow
          animationDelay: `${Math.random() * maxAnimationDelay}s`, // Optional: for staggered start
          height: `${Math.random() * 10 + 5}px`,
          width: `${Math.random() * 10 + 10}px`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="relative w-full h-full opacity-50">
      {snowflakes.map((flake) => (
        <SnowflakeIcon
          key={flake.id}
          className="snowflake"
          style={flake.style}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
