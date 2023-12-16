"use client";

import { updateUserInfo } from "@/app/actions/user-info";
import { UserInfo } from "@prisma/client";
import { KeyboardEvent, useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

export const UserInfoForm = ({ userInfo }: { userInfo: UserInfo | null }) => {
  const [username, setUsername] = useState(userInfo?.username || undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) {
      return;
    }
    setLoading(true);
    try {
      const res = await updateUserInfo({ username });
      // @ts-ignore
      if (res.error) {
        // @ts-ignore
        setError(res.error);
      } else {
        setError(null);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const pattern = /[a-zA-Z0-9_-]/;
    if (!pattern.test(e.key)) {
      e.preventDefault();
    }
  };
  return (
    <form className="w-full flex flex-col gap-2" onSubmit={onSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription className=" whitespace-pre-wrap">
            {error}
          </AlertDescription>
        </Alert>
      )}
      <Label htmlFor="username">Username</Label>
      <TypographyMuted>
        Usernames may contain letters (a-z, A-Z), numbers (0-9), underscores
        (_), and hyphens (-)
      </TypographyMuted>
      <div className="relative">
        <Input
          onKeyDown={handleKeyPress}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full pr-12"
          id="username"
          name="username"
          required
        />
      </div>
      {userInfo?.username !== username && (
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      )}
    </form>
  );
};
