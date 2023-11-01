"use client";
import { useEffect, useState } from "react";
import { TypographyH2 } from "../ui/typography/TypographyH2";
import { TypographyMuted } from "../ui/typography/TypographyMuted";

const AdventureEditInvitationSection = ({
  adventureId,
  userId,
}: {
  adventureId: string;
  userId?: string;
}) => {
  const [canEdit, setCanEdit] = useState<boolean>(false);

  useEffect(() => {
    if (adventureId) {
      const getCharacters = async () => {
        const res = await fetch(`/api/adventure/${adventureId}`);
        if (res.ok) {
          const json = await res.json();
          setCanEdit(userId === json.creatorId);
        }
      };
      getCharacters();
    }
  }, [adventureId]);

  // Don't show this section if we don't have any pre-made characters
  if (!canEdit) {
    return null;
  }

  return (
    <div className="mt-6">
      <TypographyH2 className="border-none">Edit Adventure</TypographyH2>
      <TypographyMuted className="text-lg">
        This is your adventure, so you may edit it! Editing this adventure only
        affects future players -- not those who have already begun one.
      </TypographyMuted>
      <div className="mt-2  max-w-4xl">
        <a href={`/adventures/editor/${adventureId}`}>Edit Adventure</a>
      </div>
    </div>
  );
};

export default AdventureEditInvitationSection;
