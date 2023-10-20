"use client";
import Image from "next/image";

export const MainCTA = () => {
  return (
    <div className="w-full h-1/2 fixed top-0 overflow-hidden left-0 -z-20">
      <div className="w-full h-full relative">
        <Image
          src="/adventurer.png"
          alt="Adventurer standing over ravine"
          className="object-cover"
          sizes="1456px"
          fill
        />
      </div>
    </div>
  );
};
