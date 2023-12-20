"use client";
import { BrushIcon, PencilIcon, ScrollTextIcon } from "lucide-react";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { GradientText } from "../ui/typography/gradient-text";
import SectionContainer from "./section-container";

const features = [
  {
    title: "Epic Text-Based RPG Adventure",
    description:
      "Go on adventures in a text based RPG. Explore the world and interact with characters.",
    icon: ScrollTextIcon,
  },
  {
    title: "Captivating Art",
    description:
      "Scenes are brought to life with beautiful illustrations. Experience the world you create.",
    image: "/play.png",
    icon: BrushIcon,
  },
  {
    title: "Infinite Customization Possibilities",
    description:
      "Customize a world to your liking using our advanced editor. Create your own characters, locations, and quests. The possibilities are endless.",
    icon: PencilIcon,
  },
];

export default function FeatureSection() {
  return (
    <SectionContainer>
      <span className="text-indigo-500 uppercase font-bold text-sm text-center w-full flex items-center justify-center mb-8">
        Features
      </span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-center">
        An Immersive <GradientText>Text Based RPG</GradientText> Experience
      </h2>
      <TypographyMuted className="mt-6 text-lg leading-8 text-center max-w-3xl mx-auto">
        Every adventure is a unique experience. Explore community crafted
        adventures, or create your own. The possibilities are endless.
      </TypographyMuted>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {features.map((feature) => (
          <div
            className="rounded-xl border-muted p-8 aspect-square  bg-gradient-to-br from-muted/40 to-transparent"
            key={feature.title}
          >
            <div className="flex">
              <div className="p-2 border border-muted rounded-md bg-gradient-to-br from-muted/40 to-transparent">
                <feature.icon className="text-blue-500" />
              </div>
            </div>
            <TypographyH3 className="mt-4">{feature.title}</TypographyH3>

            <TypographyMuted className="text-xl mt-8">
              {feature.description}
            </TypographyMuted>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
