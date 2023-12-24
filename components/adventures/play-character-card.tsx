"use client";

import { amplitude } from "@/lib/amplitude";
import { CUSTOM_CHARACTER_NAME } from "@/lib/characters";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { track } from "@vercel/analytics/react";
import { LoaderIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Card = ({
  adventureId,
  children,
  onboardingParams,
  fastOnboard,
  variant = "landing",
  onClick,
  className = null,
}: {
  adventureId?: string;
  children: React.ReactNode;
  onboardingParams?: Record<string, any>;
  fastOnboard?: boolean;
  variant: "landing" | "adventure";
  className?: string | null;
  onClick: (e: any) => void;
}) => {
  let url = `/adventures/${adventureId}`;

  const _className = cn(
    `block group relative aspect-[2/3] w-full rounded-xl bg-gray-900/5 overflow-hidden shadow-lg`,
    adventureId ? "cursor-pointer" : "",
    variant == "landing" ? "" : "h-72",
    className
  );

  if (adventureId) {
    return (
      <a className={_className} href={url} onClick={onClick}>
        {children}
      </a>
    );
  } else {
    return <div className={_className}>{children}</div>;
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
  isDevelopment = false,
  enabled = true,
  setIsLoading = undefined,
}: {
  title: string;
  description: string;
  alt?: string;
  adventureId?: string;
  image: string;
  onboardingParams?: Record<string, any>;
  fastOnboard?: boolean;
  custom?: boolean;
  isDevelopment?: boolean;
  enabled?: boolean;
  setIsLoading?: (isLoading: boolean) => void;
  variant?: "landing" | "adventure";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const clerk = useClerk();

  if (loading) {
    return (
      <Card
        adventureId={adventureId}
        onboardingParams={onboardingParams}
        fastOnboard={fastOnboard}
        variant={variant}
        onClick={(e) => {}}
      >
        <div className="flex items-center justify-center w-full h-full">
          <LoaderIcon size={64} className="z-10" />
        </div>

        <CardDescription variant={variant} title={"Loading..."} />
      </Card>
    );
  }

  const loadAdventure = async (e: any) => {
    if (!onboardingParams) {
      return true;
    }

    amplitude.track("Button Click", {
      buttonName: "Start Adventure",
      location: "Adventure",
      action: "start-adventure-pre-login-check",
      adventureId: adventureId,
      templateCharacter: !!onboardingParams,
    });

    e.stopPropagation();
    e.preventDefault();

    if (!(process.env.NEXT_PUBLIC_ALLOW_NOAUTH_GAMEPLAY === "true")) {
      // If we aren't explicitly allowing unauthed gameplay, then we need to redirect to signin at this point.
      if (!isSignedIn) {
        clerk.openSignIn({
          redirectUrl: document.location.href,
        });
        return;
      }
    }

    track("Character Selected", {
      character: onboardingParams["name"] || "Unknown name",
    });

    amplitude.track("Button Click", {
      buttonName: "Start Adventure",
      location: "Adventure",
      action: "start-adventure",
      adventureId: adventureId,
      templateCharacter: !!onboardingParams,
    });

    if (!enabled) {
      console.log("Not enabled");
      return;
    }

    setLoading(true);
    if (setIsLoading) {
      setIsLoading(true);
    }

    let payload: any = {
      adventureId,
      isDevelopment: isDevelopment,
    };

    if (onboardingParams && onboardingParams["name"] != CUSTOM_CHARACTER_NAME) {
      payload["gameState"] = { player: {} };

      const searchParams = new URLSearchParams();
      for (const key in onboardingParams) {
        if (onboardingParams[key]) {
          payload["gameState"]["player"][key] = onboardingParams[key];
        }
      }
      if (fastOnboard) {
        searchParams.set("fastOnboard", "true");
      }
    }

    const resp = await fetch(`/api/adventure/create-instance`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const respJson = await resp.json();

    if (!respJson?.url) {
      console.log(respJson);
      console.log(resp.status);
      alert("Unable to start quest. Please try again.");
      return;
    }
    router.push(respJson.url);
  };

  return (
    <Card
      adventureId={adventureId}
      onboardingParams={onboardingParams}
      fastOnboard={fastOnboard}
      variant={variant}
      onClick={loadAdventure}
    >
      {image ? (
        <Image
          src={image}
          alt={alt || title}
          fill
          sizes="720px"
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
