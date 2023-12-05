"use client";

import { amplitude } from "@/lib/amplitude";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics/react";
import { UserIcon } from "lucide-react";
import Image from "next/image";

const Card = ({
  adventureId,
  children,
  onboardingParams,
  fastOnboard,
  variant = "landing",
}: {
  adventureId?: string;
  children: React.ReactNode;
  onboardingParams?: Record<string, any>;
  fastOnboard?: boolean;
  variant: "landing" | "adventure";
}) => {
  const className = cn(
    `block group relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 overflow-hidden shadow-lg`,
    adventureId ? "cursor-pointer" : "",
    variant == "landing" ? "" : "h-72"
  );

  if (adventureId) {
    const registerClick = () => {
      amplitude.track("Button Click", {
        buttonName: "Start Adventure",
        location: "Adventure",
        action: "start-adventure",
        adventureId: adventureId,
        templateCharacter: !!onboardingParams,
      });
      if (onboardingParams) {
        track("Character Selected", {
          character: onboardingParams["name"] || "Unknown name",
        });
      }
      return true;
    };

    let url = `/adventures/${adventureId}`;
    if (onboardingParams) {
      const searchParams = new URLSearchParams();
      for (const key in onboardingParams) {
        if (onboardingParams[key]) {
          searchParams.set(key, onboardingParams[key]);
        }
      }
      if (fastOnboard) {
        searchParams.set("fastOnboard", "true");
      }
      url = `/adventures/${adventureId}/create-instance?${searchParams.toString()}`;
    }

    return (
      <a className={className} href={url} onClick={registerClick}>
        {children}
      </a>
    );
  } else {
    return <div className={className}>{children}</div>;
  }
};

const CardDescription = ({
  title,
  description,
  variant = "landing",
}: {
  title: string;
  description?: string;
  variant: "landing" | "adventure";
}) => (
  <div className="absolute bottom-0 left-0 w-full z-20">
    <div className="backdrop-blur-sm p-2 bg-background/40 text-xs">
      <div className="font-bold">{title}</div>
      {description && (
        <div
          className={cn(
            variant == "landing"
              ? "h-0 group-hover:mt-2 group-hover:h-[13rem] transition-all invisible group-hover:visible"
              : "visible"
          )}
        >
          {description}
        </div>
      )}
    </div>
  </div>
);

export default function PlayAsCharacterCard({
  title,
  description,
  image,
  alt,
  adventureId,
  onboardingParams,
  fastOnboard,
  custom,
  variant = "landing",
}: {
  title: string;
  description: string;
  alt?: string;
  adventureId?: string;
  image: string;
  onboardingParams?: Record<string, any>;
  fastOnboard?: boolean;
  custom?: boolean;
  variant?: "landing" | "adventure";
}) {
  return (
    <Card
      adventureId={adventureId}
      onboardingParams={onboardingParams}
      fastOnboard={fastOnboard}
      variant={variant}
    >
      {image ? (
        <Image
          src={image}
          alt={alt || title}
          fill
          className="object-cover z-10"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <UserIcon size={64} className="z-10" />
        </div>
      )}

      <CardDescription
        variant={variant}
        title={title}
        description={description}
      />
    </Card>
  );
}
