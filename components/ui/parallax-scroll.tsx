"use client";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import PlayAsCharacterCard from "../adventures/play-character-card";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: { image: string; title: string; description: string }[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div className={cn("items-start w-full", className)} ref={gridRef}>
      <div className="flex justify-center gap-8" ref={gridRef}>
        <div className="flex flex-col gap-8 mt-60">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }} // Apply the translateY motion value here
              key={"grid-1" + idx}
              className="w-44"
            >
              <PlayAsCharacterCard {...el} />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-8 mt-32">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond }}
              key={"grid-2" + idx}
              className="w-44"
            >
              <PlayAsCharacterCard {...el} />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird }}
              key={"grid-3" + idx}
              className="w-44"
            >
              <PlayAsCharacterCard {...el} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
