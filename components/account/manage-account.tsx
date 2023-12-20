"use client";

import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/nextjs";
import { UserInfo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { TypographyH3 } from "../ui/typography/TypographyH3";
import { TypographyH4 } from "../ui/typography/TypographyH4";
import { TypographyLarge } from "../ui/typography/TypographyLarge";
import { TypographyMuted } from "../ui/typography/TypographyMuted";
import { TypographyP } from "../ui/typography/TypographyP";
import { UserInfoForm } from "./userinfo-form";

const ManageAccount = ({ userInfo }: { userInfo: UserInfo | null }) => {
  const clerk = useClerk();
  const { user } = useUser();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 h-full flex-1">
      <div className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <TypographyLarge>Personal Information</TypographyLarge>
            <TypographyMuted>
              Manage your profile and account settings
            </TypographyMuted>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Profile Picture</Label>
              {userInfo?.avatarImage && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={userInfo.username || "Profile picture"}
                    src={userInfo.avatarImage}
                    className="rounded-md h-32 w-32"
                  />
                </>
              )}
            </div>
            <UserInfoForm userInfo={userInfo} />
            <Button variant="outline" onClick={() => clerk.openUserProfile()}>
              Manage Account
            </Button>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-background/50 z-10 backdrop-blur-md">
            <div className="w-full h-full flex items-center justify-center flex-col p-6">
              <TypographyH3>Get ready for an epic upgrade! 🏆 </TypographyH3>
              <TypographyP className="max-w-md text-center">
                User experience enhancements, permanent power-ups, and exclusive
                badges are on the horizon. Stay ahead of the game - join our{" "}
                <a
                  href="https://steamship.com/discord"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {" "}
                  Discord
                </a>{" "}
                now for the latest updates and sneak peeks!
              </TypographyP>
            </div>
          </div>
          <div className="gap-2 flex flex-col">
            <TypographyMuted>Rank</TypographyMuted>
            <TypographyH3>Wanderer</TypographyH3>
          </div>
          <div className="gap-2 flex flex-col">
            <TypographyMuted>Progress</TypographyMuted>
            <TypographyH3>
              <Progress value={0.5} />
            </TypographyH3>
          </div>
          <div className="gap-2 flex flex-col">
            <TypographyMuted>Awards</TypographyMuted>
            <div className="flex gap-12 overflow-x-scroll">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((award, i) => (
                <div
                  key={award}
                  className={cn(
                    "rounded-lg  min-w-[250px] p-8 border",
                    i < 2 ? " bg-gradient-to-r from-indigo-500 to-blue-500" : ""
                  )}
                >
                  <TypographyH4>Award {award}</TypographyH4>
                  <TypographyMuted
                    className={cn(
                      "text-white",
                      i < 2 ? "text-white" : "text-gray-500"
                    )}
                  >
                    This is where the award description goes
                  </TypographyMuted>
                  <div className="mt-8 text-sm">
                    Unlocked at <b>Level 1</b>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="destructive"
            onClick={async () => {
              await clerk.signOut();
              router.push("/");
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;
