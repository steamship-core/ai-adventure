export const dynamic = "force-static";

import EditorSection from "@/components/landing/editor-section";
import FeatureSection from "@/components/landing/feature-section";
import LandingFooter from "@/components/landing/footer";
import LandingHero from "@/components/landing/hero";
import OpenSource from "@/components/landing/open-source-section";
import QuestSection from "@/components/landing/quest-section";
import { cn } from "@/lib/utils";
import "./globals.css";

export default async function Home() {
  return (
    <div id="main-container" className={cn("h-full flex flex-col")}>
      <LandingHero />
      <QuestSection />
      <FeatureSection />
      <EditorSection />
      <OpenSource />
      <LandingFooter />
    </div>
  );
}
